import { create } from "zustand";
import { hexesOnLine, hexKey, hexRotation, parseHexKey, pixelToHex } from "../lib/grid";
import { NIX_BLUE, type Palette } from "../lib/palettes";
import type { CellData, Mode, Viewport } from "../types";

interface CanvasState {
	cells: Map<string, CellData>;
	activeColor: string;
	activePalette: Palette;
	mode: Mode;
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
	setViewport: (viewport: Viewport) => void;
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

export const useCanvasStore = create<CanvasState>((set, get) => ({
	cells: new Map(),
	activeColor: NIX_BLUE.colors[0],
	activePalette: NIX_BLUE,
	mode: "paint",
	viewport: DEFAULT_VIEWPORT,

	fillCell: (key) =>
		set((state) => {
			if (state.cells.has(key)) return state;
			const hex = parseHexKey(key);
			const newCells = new Map(state.cells);
			newCells.set(key, { color: state.activeColor, rotation: hexRotation(hex) });
			return { cells: newCells };
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
			for (const hex of hexes) {
				const key = hexKey(hex);
				if (!newCells.has(key)) {
					newCells.set(key, { color: state.activeColor, rotation: hexRotation(hex) });
					changed = true;
				}
			}
			return changed ? { cells: newCells } : state;
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

	setActivePalette: (palette) => set({ activePalette: palette, activeColor: palette.colors[0] }),

	setMode: (mode) => set({ mode }),

	setViewport: (viewport) => set({ viewport }),

	clearAll: () => set({ cells: new Map() }),

	loadCells: (cells) => set({ cells }),
}));
