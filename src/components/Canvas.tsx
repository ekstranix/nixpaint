import { useEffect, useRef } from "react";
import { hexToPixel, parseHexKey } from "../lib/grid";
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
	/** CTM captured at pan start, used for consistent delta calculation */
	ctm: DOMMatrix;
}

export function Canvas() {
	const svgRef = useRef<SVGSVGElement>(null);
	const isPainting = useRef(false);
	const isPanning = useRef(false);
	const lastPixel = useRef<{ x: number; y: number } | null>(null);
	const panStart = useRef<PanState | null>(null);

	const cells = useCanvasStore((s) => s.cells);
	const viewport = useCanvasStore((s) => s.viewport);
	const mode = useCanvasStore((s) => s.mode);

	useEffect(() => {
		const svg = svgRef.current;
		if (!svg) return;

		const handlePointerDown = (e: PointerEvent) => {
			const { mode } = useCanvasStore.getState();

			// Pan: middle-click always, or left-click in pan mode
			if (e.button === 1 || (e.button === 0 && mode === "pan")) {
				e.preventDefault();
				isPanning.current = true;
				const ctm = svg.getScreenCTM();
				panStart.current = {
					startScreenX: e.clientX,
					startScreenY: e.clientY,
					startVp: { ...useCanvasStore.getState().viewport },
					ctm: ctm || new DOMMatrix(),
				};
				svg.setPointerCapture(e.pointerId);
				return;
			}

			if (e.button !== 0) return;

			isPainting.current = true;
			const pt = screenToSvg(svg, e.clientX, e.clientY);
			lastPixel.current = { x: pt.x, y: pt.y };

			const store = useCanvasStore.getState();
			if (mode === "paint") {
				store.paintAtPixel(pt.x, pt.y);
			} else if (mode === "erase") {
				store.eraseLine(pt.x, pt.y, pt.x, pt.y);
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
				// Use the CTM from pan start for consistent deltas
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

			// Painting/erasing
			if (!isPainting.current || !lastPixel.current) return;
			const pt = screenToSvg(svg, e.clientX, e.clientY);
			const prev = lastPixel.current;
			const { mode } = useCanvasStore.getState();

			if (mode === "paint") {
				useCanvasStore.getState().paintLine(prev.x, prev.y, pt.x, pt.y);
			} else if (mode === "erase") {
				useCanvasStore.getState().eraseLine(prev.x, prev.y, pt.x, pt.y);
			}
			lastPixel.current = { x: pt.x, y: pt.y };
		};

		const handlePointerUp = () => {
			isPainting.current = false;
			isPanning.current = false;
			lastPixel.current = null;
			panStart.current = null;
		};

		const handleWheel = (e: WheelEvent) => {
			e.preventDefault();
			const vp = useCanvasStore.getState().viewport;
			const zoomFactor = e.deltaY > 0 ? 1.1 : 0.9;

			// Zoom around cursor position using SVG's own coordinate transform
			const cursor = screenToSvg(svg, e.clientX, e.clientY);

			const newWidth = vp.width * zoomFactor;
			const newHeight = vp.height * zoomFactor;

			// cursor.x should stay at the same screen position after zoom
			// cursor.x = newVp.x + fracX * newWidth, where fracX is the same proportion
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
		svg.addEventListener("wheel", handleWheel, { passive: false });
		svg.addEventListener("contextmenu", handleContextMenu);

		return () => {
			svg.removeEventListener("pointerdown", handlePointerDown);
			svg.removeEventListener("pointermove", handlePointerMove);
			svg.removeEventListener("pointerup", handlePointerUp);
			svg.removeEventListener("wheel", handleWheel);
			svg.removeEventListener("contextmenu", handleContextMenu);
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

	return (
		<svg
			ref={svgRef}
			style={{
				width: "100%",
				height: "100%",
				display: "block",
				cursor: mode === "erase" ? "crosshair" : mode === "pan" ? "grab" : "default",
			}}
			viewBox={`${viewport.x} ${viewport.y} ${viewport.width} ${viewport.height}`}
			preserveAspectRatio="none"
		>
			<title>Nixpaint Canvas</title>
			{visibleLambdas.map(({ key, x, y, rotation, color }) => (
				<Lambda key={key} x={x} y={y} rotation={rotation} color={color} />
			))}
		</svg>
	);
}
