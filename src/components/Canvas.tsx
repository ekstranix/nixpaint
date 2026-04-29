import { useEffect, useRef } from "react";
import { hexKey, hexToPixel, parseHexKey, pixelToHex } from "../lib/grid";
import { useCanvasStore } from "../store/canvas";
import type { Viewport } from "../types";
import { Lambda } from "./Lambda";

const BUFFER = 100; // Extra pixels outside viewport to render

function isVisible(px: number, py: number, vp: Viewport): boolean {
	return (
		px >= vp.x - BUFFER &&
		px <= vp.x + vp.width + BUFFER &&
		py >= vp.y - BUFFER &&
		py <= vp.y + vp.height + BUFFER
	);
}

/** Convert screen coordinates to SVG viewBox coordinates using the SVG's own transform matrix. */
function screenToSvg(svg: SVGSVGElement, screenX: number, screenY: number): DOMPoint {
	const ctm = svg.getScreenCTM();
	if (!ctm) return new DOMPoint(screenX, screenY);
	return new DOMPoint(screenX, screenY).matrixTransform(ctm.inverse());
}

interface PanState {
	startScreenX: number;
	startScreenY: number;
	startVp: Viewport;
	ctm: DOMMatrix;
}

interface SelectDragState {
	startX: number;
	startY: number;
	shift: boolean;
}

interface MoveDragState {
	startSvgX: number;
	startSvgY: number;
	startHex: { q: number; r: number };
}

function getCursor(mode: string): string {
	switch (mode) {
		case "erase":
			return "crosshair";
		case "pan":
			return "grab";
		case "node":
			return "crosshair";
		case "select":
			return "default";
		default:
			return "default";
	}
}

export function Canvas() {
	const svgRef = useRef<SVGSVGElement>(null);
	const isPainting = useRef(false);
	const isPanning = useRef(false);
	const lastPixel = useRef<{ x: number; y: number } | null>(null);
	const panStart = useRef<PanState | null>(null);
	const selectDrag = useRef<SelectDragState | null>(null);
	const moveDrag = useRef<MoveDragState | null>(null);

	const cells = useCanvasStore((s) => s.cells);
	const viewport = useCanvasStore((s) => s.viewport);
	const mode = useCanvasStore((s) => s.mode);
	const backgroundColor = useCanvasStore((s) => s.backgroundColor);
	const nodePoints = useCanvasStore((s) => s.nodePoints);
	const selectedCells = useCanvasStore((s) => s.selectedCells);
	const selectionRect = useCanvasStore((s) => s.selectionRect);
	const dragMove = useCanvasStore((s) => s.dragMove);

	useEffect(() => {
		const svg = svgRef.current;
		if (!svg) return;

		const handlePointerDown = (e: PointerEvent) => {
			const store = useCanvasStore.getState();
			const { mode } = store;

			// Pan: middle-click always, or left-click in pan mode
			if (e.button === 1 || (e.button === 0 && mode === "pan")) {
				e.preventDefault();
				isPanning.current = true;
				const ctm = svg.getScreenCTM();
				panStart.current = {
					startScreenX: e.clientX,
					startScreenY: e.clientY,
					startVp: { ...store.viewport },
					ctm: ctm || new DOMMatrix(),
				};
				svg.setPointerCapture(e.pointerId);
				return;
			}

			if (e.button !== 0) return;

			// Non-interactive modes
			if (mode === "foreground" || mode === "background") return;

			const pt = screenToSvg(svg, e.clientX, e.clientY);

			// Select mode
			if (mode === "select") {
				const clickHex = pixelToHex(pt.x, pt.y);
				const clickKey = hexKey(clickHex);
				const hasCell = store.cells.has(clickKey);
				const isSelected = store.selectedCells.has(clickKey);

				if (hasCell && isSelected && !e.shiftKey) {
					// Start move drag on an already-selected lambda
					moveDrag.current = {
						startSvgX: pt.x,
						startSvgY: pt.y,
						startHex: clickHex,
					};
					store.setDragMove({ startX: pt.x, startY: pt.y, currentX: pt.x, currentY: pt.y });
					svg.setPointerCapture(e.pointerId);
				} else if (hasCell && e.shiftKey) {
					store.toggleSelectCell(clickKey);
				} else if (hasCell) {
					store.selectCell(clickKey);
				} else {
					// Start rectangle drag on empty space, or clear
					if (!e.shiftKey) {
						store.clearSelection();
					}
					selectDrag.current = { startX: pt.x, startY: pt.y, shift: e.shiftKey };
					store.setSelectionRect({ x1: pt.x, y1: pt.y, x2: pt.x, y2: pt.y });
					svg.setPointerCapture(e.pointerId);
				}
				return;
			}

			// Node tool
			if (mode === "node") {
				if (store.nodePoints.length > 0) {
					store.pushHistory();
				}
				store.nodeClick(pt.x, pt.y);
				return;
			}

			// Paint/erase — snapshot before the stroke
			store.pushHistory();
			isPainting.current = true;
			lastPixel.current = { x: pt.x, y: pt.y };

			if (mode === "paint") {
				store.paintAtPixel(pt.x, pt.y);
			} else if (mode === "erase") {
				store.eraseAtPixel(pt.x, pt.y);
			}
			svg.setPointerCapture(e.pointerId);
		};

		const handlePointerMove = (e: PointerEvent) => {
			// Panning
			if (isPanning.current && panStart.current) {
				const hasButton = (e.buttons & 4) !== 0 || (e.buttons & 1) !== 0;
				if (!hasButton) {
					isPanning.current = false;
					panStart.current = null;
					return;
				}
				const ps = panStart.current;
				const inv = ps.ctm.inverse();
				const startSvg = new DOMPoint(ps.startScreenX, ps.startScreenY).matrixTransform(inv);
				const curSvg = new DOMPoint(e.clientX, e.clientY).matrixTransform(inv);
				const dx = curSvg.x - startSvg.x;
				const dy = curSvg.y - startSvg.y;
				useCanvasStore.getState().setViewport({
					...ps.startVp,
					x: ps.startVp.x - dx,
					y: ps.startVp.y - dy,
				});
				return;
			}

			// Select: rectangle drag
			if (selectDrag.current) {
				const pt = screenToSvg(svg, e.clientX, e.clientY);
				const sd = selectDrag.current;
				useCanvasStore.getState().setSelectionRect({
					x1: sd.startX,
					y1: sd.startY,
					x2: pt.x,
					y2: pt.y,
				});
				return;
			}

			// Select: move drag
			if (moveDrag.current) {
				const pt = screenToSvg(svg, e.clientX, e.clientY);
				useCanvasStore.getState().setDragMove({
					startX: moveDrag.current.startSvgX,
					startY: moveDrag.current.startSvgY,
					currentX: pt.x,
					currentY: pt.y,
				});
				return;
			}

			// Painting/erasing
			if (!isPainting.current || !lastPixel.current) return;
			const store = useCanvasStore.getState();

			// Stamp mode: don't drag-paint
			if (store.mode === "paint" && store.paintMode === "stamp") return;

			const pt = screenToSvg(svg, e.clientX, e.clientY);
			const prev = lastPixel.current;

			if (store.mode === "paint") {
				store.paintLine(prev.x, prev.y, pt.x, pt.y);
			} else if (store.mode === "erase") {
				store.eraseLine(prev.x, prev.y, pt.x, pt.y);
			}
			lastPixel.current = { x: pt.x, y: pt.y };
		};

		const handlePointerUp = () => {
			// Finalize rectangle selection
			if (selectDrag.current) {
				const sd = selectDrag.current;
				const store = useCanvasStore.getState();
				const rect = store.selectionRect;
				if (rect) {
					const dx = Math.abs(rect.x2 - rect.x1);
					const dy = Math.abs(rect.y2 - rect.y1);
					if (dx > 2 || dy > 2) {
						if (sd.shift) {
							store.addRegion(rect);
						} else {
							store.selectRegion(rect);
						}
					} else {
						store.setSelectionRect(null);
					}
				}
				selectDrag.current = null;
			}

			// Finalize move drag
			if (moveDrag.current) {
				const store = useCanvasStore.getState();
				const dm = store.dragMove;
				if (dm) {
					const startHex = pixelToHex(dm.startX, dm.startY);
					const endHex = pixelToHex(dm.currentX, dm.currentY);
					const deltaQ = endHex.q - startHex.q;
					const deltaR = endHex.r - startHex.r;
					if (deltaQ !== 0 || deltaR !== 0) {
						store.moveSelected(deltaQ, deltaR);
					} else {
						store.setDragMove(null);
					}
				}
				moveDrag.current = null;
			}

			isPainting.current = false;
			isPanning.current = false;
			lastPixel.current = null;
			panStart.current = null;
		};

		const handleDblClick = () => {
			const { mode } = useCanvasStore.getState();
			if (mode === "node") {
				useCanvasStore.getState().clearNodePoints();
			}
		};

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				const store = useCanvasStore.getState();
				if (store.mode === "node") {
					store.clearNodePoints();
				}
				if (store.mode === "select") {
					store.clearSelection();
				}
			}

			const mod = e.ctrlKey || e.metaKey;
			if (mod && e.key === "z" && !e.shiftKey) {
				e.preventDefault();
				useCanvasStore.getState().undo();
			}
			if (mod && e.key === "z" && e.shiftKey) {
				e.preventDefault();
				useCanvasStore.getState().redo();
			}
			if (mod && e.key === "Z") {
				e.preventDefault();
				useCanvasStore.getState().redo();
			}
		};

		const handleWheel = (e: WheelEvent) => {
			e.preventDefault();
			const vp = useCanvasStore.getState().viewport;
			const zoomFactor = e.deltaY > 0 ? 1.1 : 0.9;
			const cursor = screenToSvg(svg, e.clientX, e.clientY);
			const newWidth = vp.width * zoomFactor;
			const newHeight = vp.height * zoomFactor;
			const fracX = (cursor.x - vp.x) / vp.width;
			const fracY = (cursor.y - vp.y) / vp.height;

			useCanvasStore.getState().setViewport({
				x: cursor.x - fracX * newWidth,
				y: cursor.y - fracY * newHeight,
				width: newWidth,
				height: newHeight,
				zoom: vp.zoom / zoomFactor,
			});
		};

		const handleContextMenu = (e: MouseEvent) => e.preventDefault();

		svg.addEventListener("pointerdown", handlePointerDown);
		svg.addEventListener("pointermove", handlePointerMove);
		svg.addEventListener("pointerup", handlePointerUp);
		svg.addEventListener("dblclick", handleDblClick);
		svg.addEventListener("wheel", handleWheel, { passive: false });
		svg.addEventListener("contextmenu", handleContextMenu);
		document.addEventListener("keydown", handleKeyDown);

		return () => {
			svg.removeEventListener("pointerdown", handlePointerDown);
			svg.removeEventListener("pointermove", handlePointerMove);
			svg.removeEventListener("pointerup", handlePointerUp);
			svg.removeEventListener("dblclick", handleDblClick);
			svg.removeEventListener("wheel", handleWheel);
			svg.removeEventListener("contextmenu", handleContextMenu);
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	// Collect visible cells
	const visibleLambdas: Array<{
		key: string;
		x: number;
		y: number;
		rotation: number;
		color: string;
	}> = [];
	for (const [key, cell] of cells) {
		const hex = parseHexKey(key);
		const { x, y } = hexToPixel(hex);
		if (isVisible(x, y, viewport)) {
			visibleLambdas.push({ key, x, y, rotation: cell.rotation, color: cell.color });
		}
	}

	// Last node point indicator
	const lastNode = nodePoints.length > 0 ? nodePoints[nodePoints.length - 1] : null;

	return (
		<svg
			ref={svgRef}
			style={{
				width: "100%",
				height: "100%",
				display: "block",
				cursor: getCursor(mode),
			}}
			viewBox={`${viewport.x} ${viewport.y} ${viewport.width} ${viewport.height}`}
			preserveAspectRatio="none"
		>
			<title>Nixpaint Canvas</title>
			<rect
				x={viewport.x}
				y={viewport.y}
				width={viewport.width}
				height={viewport.height}
				fill={backgroundColor}
			/>
			{visibleLambdas.map(({ key, x, y, rotation, color }) => (
				<Lambda key={key} x={x} y={y} rotation={rotation} color={color} selected={selectedCells.has(key)} />
			))}
			{lastNode && mode === "node" && (
				<circle cx={lastNode.x} cy={lastNode.y} r={4} fill="#7ebae4" opacity={0.8} />
			)}
			{selectionRect && (
				<rect
					x={Math.min(selectionRect.x1, selectionRect.x2)}
					y={Math.min(selectionRect.y1, selectionRect.y2)}
					width={Math.abs(selectionRect.x2 - selectionRect.x1)}
					height={Math.abs(selectionRect.y2 - selectionRect.y1)}
					fill="rgba(126, 186, 228, 0.15)"
					stroke="#7ebae4"
					strokeWidth={1 / (viewport.zoom || 1)}
					strokeDasharray={`${4 / (viewport.zoom || 1)}`}
				/>
			)}
			{dragMove && mode === "select" && (() => {
				const dx = dragMove.currentX - dragMove.startX;
				const dy = dragMove.currentY - dragMove.startY;
				const ghosts: Array<{ key: string; x: number; y: number; rotation: number; color: string }> = [];
				for (const key of selectedCells) {
					const cell = cells.get(key);
					if (cell) {
						const hex = parseHexKey(key);
						const { x, y } = hexToPixel(hex);
						ghosts.push({ key, x: x + dx, y: y + dy, rotation: cell.rotation, color: cell.color });
					}
				}
				return ghosts.map(({ key, x, y, rotation, color }) => (
					<Lambda key={`ghost-${key}`} x={x} y={y} rotation={rotation} color={color} opacity={0.4} />
				));
			})()}
		</svg>
	);
}
