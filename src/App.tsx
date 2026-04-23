import { useCallback, useEffect, useRef } from "react";
import { Canvas } from "./components/Canvas";
import { SideToolbar } from "./components/SideToolbar";
import { Toolbar } from "./components/Toolbar";
import { ToolOptionsBar } from "./components/ToolOptionsBar";
import { hexToPixel, parseHexKey } from "./lib/grid";
import { LAMBDA_PATH } from "./lib/lambda-path";
import { useCanvasStore } from "./store/canvas";
import type { CellData } from "./types";

const STORAGE_KEY = "nixpaint-cells";

function serializeCells(cells: Map<string, CellData>): string {
	return JSON.stringify(Array.from(cells.entries()));
}

function deserializeCells(json: string): Map<string, CellData> {
	const entries: Array<[string, CellData]> = JSON.parse(json);
	return new Map(entries);
}

function computeBounds(cells: Map<string, CellData>) {
	let minX = Infinity;
	let minY = Infinity;
	let maxX = -Infinity;
	let maxY = -Infinity;

	for (const key of cells.keys()) {
		const hex = parseHexKey(key);
		const { x, y } = hexToPixel(hex);
		if (x < minX) minX = x;
		if (x > maxX) maxX = x;
		if (y < minY) minY = y;
		if (y > maxY) maxY = y;
	}

	const padding = 40;
	return {
		x: minX - padding,
		y: minY - padding,
		width: maxX - minX + padding * 2,
		height: maxY - minY + padding * 2,
	};
}

function buildExportSvg(cells: Map<string, CellData>, bgColor?: string): string {
	if (cells.size === 0) return "<svg xmlns='http://www.w3.org/2000/svg'/>";

	const bounds = computeBounds(cells);
	const parts: string[] = [
		`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${bounds.x} ${bounds.y} ${bounds.width} ${bounds.height}">`,
	];

	if (bgColor) {
		parts.push(
			`<rect x="${bounds.x}" y="${bounds.y}" width="${bounds.width}" height="${bounds.height}" fill="${bgColor}"/>`,
		);
	}

	for (const [key, cell] of cells) {
		const hex = parseHexKey(key);
		const { x, y } = hexToPixel(hex);
		parts.push(
			`<path d="${LAMBDA_PATH}" fill="${cell.color}" transform="translate(${x},${y}) rotate(${cell.rotation})"/>`,
		);
	}

	parts.push("</svg>");
	return parts.join("\n");
}

function downloadBlob(blob: Blob, filename: string) {
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
}

export function App() {
	const saveTimeout = useRef<ReturnType<typeof setTimeout>>(null);

	// Load from LocalStorage on mount
	useEffect(() => {
		const saved = localStorage.getItem(STORAGE_KEY);
		if (saved) {
			try {
				const cells = deserializeCells(saved);
				useCanvasStore.getState().loadCells(cells);
			} catch {
				// Ignore corrupt data
			}
		}
	}, []);

	// Auto-save on cell changes (debounced)
	useEffect(() => {
		const unsub = useCanvasStore.subscribe((state, prev) => {
			if (state.cells === prev.cells) return;

			if (saveTimeout.current) clearTimeout(saveTimeout.current);
			saveTimeout.current = setTimeout(() => {
				if (state.cells.size === 0) {
					localStorage.removeItem(STORAGE_KEY);
				} else {
					localStorage.setItem(STORAGE_KEY, serializeCells(state.cells));
				}
			}, 500);
		});
		return unsub;
	}, []);

	const handleExportSvg = useCallback(() => {
		const state = useCanvasStore.getState();
		if (state.cells.size === 0) return;
		const bgColor = state.exportBackground ? state.backgroundColor : undefined;
		const svgString = buildExportSvg(state.cells, bgColor);
		const blob = new Blob([svgString], { type: "image/svg+xml" });
		downloadBlob(blob, "nixpaint.svg");
	}, []);

	const handleExportPng = useCallback(() => {
		const state = useCanvasStore.getState();
		if (state.cells.size === 0) return;
		const bgColor = state.exportBackground ? state.backgroundColor : undefined;
		const svgString = buildExportSvg(state.cells, bgColor);
		const bounds = computeBounds(state.cells);
		const scale = 2;
		const canvas = document.createElement("canvas");
		canvas.width = bounds.width * scale;
		canvas.height = bounds.height * scale;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const img = new Image();
		const blob = new Blob([svgString], { type: "image/svg+xml" });
		const url = URL.createObjectURL(blob);

		img.onload = () => {
			ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
			URL.revokeObjectURL(url);
			canvas.toBlob((pngBlob) => {
				if (pngBlob) downloadBlob(pngBlob, "nixpaint.png");
			}, "image/png");
		};
		img.src = url;
	}, []);

	return (
		<div className="app">
			<Toolbar onExportSvg={handleExportSvg} onExportPng={handleExportPng} />
			<ToolOptionsBar />
			<SideToolbar />
			<Canvas />
		</div>
	);
}
