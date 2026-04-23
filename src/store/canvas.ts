import { create } from "zustand";
import { hexesOnLine, hexKey, hexRotation, parseHexKey, pixelToHex } from "../lib/grid";
import { NIX_BLUE, type Palette } from "../lib/palettes";
import type { CellData, ColorMode, Mode, Viewport } from "../types";

interface CanvasState {
	cells: Map<string, CellData>;
	activeColor: string;
	activePalette: Palette;
	mode: Mode;
	colorMode: ColorMode;
	cycleIndex: number;
	viewport: Viewport;

	// Actions
	fillCell: (key: string) => void;
	eraseCell: (key: string) => void;
	paintAtPixel: (x: number, y: number) => void;
	paintLine: (x1: number, y1: number, x2: number, y2: number) => void;
	eraseLine: (x1: number, y1: number, x2: number, y2: number) => void;
	setActiveColor: (color: string) => void;
	setActivePalette: (palette: Palette) => void;
	setMode: (mode: Mode) => void;
	setColorMode: (colorMode: ColorMode) => void;
	setViewport: (viewport: Viewport) => void;
	zoomIn: () => void;
	zoomOut: () => void;
	clearAll: () => void;
	loadCells: (cells: Map<string, CellData>) => void;
}

const DEFAULT_VIEWPORT: Viewport = {
	x: -400,
	y: -300,
	width: 800,
	height: 600,
	zoom: 1,
};

const ZOOM_FACTOR = 1.25;

function getColor(state: CanvasState): { color: string; cycleIndex: number } {
	if (state.colorMode === "stable") {
		return { color: state.activeColor, cycleIndex: state.cycleIndex };
	}
	const colors = state.activePalette.colors;
	const color = colors[state.cycleIndex % colors.length]!;
	return { color, cycleIndex: state.cycleIndex + 1 };
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
	cells: new Map(),
	activeColor: NIX_BLUE.colors[0],
	activePalette: NIX_BLUE,
	mode: "paint",
	colorMode: "stable",
	cycleIndex: 0,
	viewport: DEFAULT_VIEWPORT,

	fillCell: (key) =>
		set((state) => {
			if (state.cells.has(key)) return state;
			const hex = parseHexKey(key);
			const { color, cycleIndex } = getColor(state);
			const newCells = new Map(state.cells);
			newCells.set(key, { color, rotation: hexRotation(hex) });
			return { cells: newCells, cycleIndex };
		}),

	eraseCell: (key) =>
		set((state) => {
			if (!state.cells.has(key)) return state;
			const newCells = new Map(state.cells);
			newCells.delete(key);
			return { cells: newCells };
		}),

	paintAtPixel: (x, y) => {
		const hex = pixelToHex(x, y);
		get().fillCell(hexKey(hex));
	},

	paintLine: (x1, y1, x2, y2) => {
		const hexes = hexesOnLine(x1, y1, x2, y2);
		set((state) => {
			const newCells = new Map(state.cells);
			let changed = false;
			let idx = state.cycleIndex;
			for (const hex of hexes) {
				const key = hexKey(hex);
				if (!newCells.has(key)) {
					let color: string;
					if (state.colorMode === "cycle") {
						color = state.activePalette.colors[idx % state.activePalette.colors.length]!;
						idx++;
					} else {
						color = state.activeColor;
					}
					newCells.set(key, { color, rotation: hexRotation(hex) });
					changed = true;
				}
			}
			return changed ? { cells: newCells, cycleIndex: idx } : state;
		});
	},

	eraseLine: (x1, y1, x2, y2) => {
		const hexes = hexesOnLine(x1, y1, x2, y2);
		set((state) => {
			const newCells = new Map(state.cells);
			let changed = false;
			for (const hex of hexes) {
				const key = hexKey(hex);
				if (newCells.has(key)) {
					newCells.delete(key);
					changed = true;
				}
			}
			return changed ? { cells: newCells } : state;
		});
	},

	setActiveColor: (color) => set({ activeColor: color }),

	setActivePalette: (palette) =>
		set({ activePalette: palette, activeColor: palette.colors[0], cycleIndex: 0 }),

	setMode: (mode) => set({ mode }),

	setColorMode: (colorMode) => set({ colorMode }),

	setViewport: (viewport) => set({ viewport }),

	zoomIn: () =>
		set((state) => {
			const vp = state.viewport;
			const factor = 1 / ZOOM_FACTOR;
			const cx = vp.x + vp.width / 2;
			const cy = vp.y + vp.height / 2;
			const newWidth = vp.width * factor;
			const newHeight = vp.height * factor;
			return {
				viewport: {
					x: cx - newWidth / 2,
					y: cy - newHeight / 2,
					width: newWidth,
					height: newHeight,
					zoom: vp.zoom * ZOOM_FACTOR,
				},
			};
		}),

	zoomOut: () =>
		set((state) => {
			const vp = state.viewport;
			const factor = ZOOM_FACTOR;
			const cx = vp.x + vp.width / 2;
			const cy = vp.y + vp.height / 2;
			const newWidth = vp.width * factor;
			const newHeight = vp.height * factor;
			return {
				viewport: {
					x: cx - newWidth / 2,
					y: cy - newHeight / 2,
					width: newWidth,
					height: newHeight,
					zoom: vp.zoom / ZOOM_FACTOR,
				},
			};
		}),

	clearAll: () => set({ cells: new Map() }),

	loadCells: (cells) => set({ cells }),
}));
