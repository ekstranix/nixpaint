import { useCallback, useEffect, useRef } from "react";
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

export function Canvas() {
	const svgRef = useRef<SVGSVGElement>(null);
	const isPainting = useRef(false);
	const lastPixel = useRef<{ x: number; y: number } | null>(null);

	const cells = useCanvasStore((s) => s.cells);
	const viewport = useCanvasStore((s) => s.viewport);
	const mode = useCanvasStore((s) => s.mode);
	const paintLine = useCanvasStore((s) => s.paintLine);
	const paintAtPixel = useCanvasStore((s) => s.paintAtPixel);
	const eraseLine = useCanvasStore((s) => s.eraseLine);
	const setViewport = useCanvasStore((s) => s.setViewport);

	const svgPointFromEvent = useCallback(
		(e: React.PointerEvent | PointerEvent): { x: number; y: number } => {
			return {
				x: viewport.x + (e.clientX / window.innerWidth) * viewport.width,
				y: viewport.y + (e.clientY / window.innerHeight) * viewport.height,
			};
		},
		[viewport],
	);

	const handlePointerDown = useCallback(
		(e: React.PointerEvent) => {
			if (e.button === 1) return; // Middle click reserved for pan
			isPainting.current = true;
			const pt = svgPointFromEvent(e);
			lastPixel.current = pt;

			if (mode === "paint") {
				paintAtPixel(pt.x, pt.y);
			} else {
				eraseLine(pt.x, pt.y, pt.x, pt.y);
			}
			(e.target as Element).setPointerCapture(e.pointerId);
		},
		[mode, paintAtPixel, eraseLine, svgPointFromEvent],
	);

	const handlePointerMove = useCallback(
		(e: React.PointerEvent) => {
			if (!isPainting.current || !lastPixel.current) return;
			const pt = svgPointFromEvent(e);
			const prev = lastPixel.current;

			if (mode === "paint") {
				paintLine(prev.x, prev.y, pt.x, pt.y);
			} else {
				eraseLine(prev.x, prev.y, pt.x, pt.y);
			}
			lastPixel.current = pt;
		},
		[mode, paintLine, eraseLine, svgPointFromEvent],
	);

	const handlePointerUp = useCallback(() => {
		isPainting.current = false;
		lastPixel.current = null;
	}, []);

	// Pan with middle mouse button
	const panStart = useRef<{ x: number; y: number; vp: Viewport } | null>(null);

	const handleMiddleDown = useCallback(
		(e: React.PointerEvent) => {
			if (e.button !== 1) return;
			e.preventDefault();
			panStart.current = { x: e.clientX, y: e.clientY, vp: { ...viewport } };
			(e.target as Element).setPointerCapture(e.pointerId);
		},
		[viewport],
	);

	const handlePanMove = useCallback(
		(e: React.PointerEvent) => {
			if (!panStart.current) return;
			if (e.buttons !== 4) {
				panStart.current = null;
				return;
			}
			const dx = ((e.clientX - panStart.current.x) / window.innerWidth) * panStart.current.vp.width;
			const dy =
				((e.clientY - panStart.current.y) / window.innerHeight) * panStart.current.vp.height;
			setViewport({
				...panStart.current.vp,
				x: panStart.current.vp.x - dx,
				y: panStart.current.vp.y - dy,
			});
		},
		[setViewport],
	);

	// Zoom with wheel
	useEffect(() => {
		const svg = svgRef.current;
		if (!svg) return;

		const handleWheel = (e: WheelEvent) => {
			e.preventDefault();
			const store = useCanvasStore.getState();
			const vp = store.viewport;
			const zoomFactor = e.deltaY > 0 ? 1.1 : 0.9;

			// Zoom around cursor position
			const cursorX = vp.x + (e.clientX / window.innerWidth) * vp.width;
			const cursorY = vp.y + (e.clientY / window.innerHeight) * vp.height;

			const newWidth = vp.width * zoomFactor;
			const newHeight = vp.height * zoomFactor;
			const newX = cursorX - (e.clientX / window.innerWidth) * newWidth;
			const newY = cursorY - (e.clientY / window.innerHeight) * newHeight;

			store.setViewport({
				x: newX,
				y: newY,
				width: newWidth,
				height: newHeight,
				zoom: vp.zoom / zoomFactor,
			});
		};

		svg.addEventListener("wheel", handleWheel, { passive: false });
		return () => svg.removeEventListener("wheel", handleWheel);
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
				width: "100vw",
				height: "100vh",
				display: "block",
				cursor: mode === "erase" ? "crosshair" : "default",
			}}
			viewBox={`${viewport.x} ${viewport.y} ${viewport.width} ${viewport.height}`}
			onPointerDown={(e) => {
				handleMiddleDown(e);
				handlePointerDown(e);
			}}
			onPointerMove={(e) => {
				handlePanMove(e);
				handlePointerMove(e);
			}}
			onPointerUp={handlePointerUp}
			onContextMenu={(e) => e.preventDefault()}
		>
			<title>Nixpaint Canvas</title>
			{visibleLambdas.map(({ key, x, y, rotation, color }) => (
				<Lambda key={key} x={x} y={y} rotation={rotation} color={color} />
			))}
		</svg>
	);
}
