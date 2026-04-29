import { create } from "zustand";
import {
	hexesInRadius,
	hexesOnLine,
	hexKey,
	hexRotateAround,
	hexRotation,
	hexToPixel,
	parseHexKey,
	pixelToHex,
	selectionCentroid,
} from "../lib/grid";
import { NIX_BLUE, type Palette } from "../lib/palettes";
import type {
	BackgroundColor,
	CellData,
	ColorMode,
	DragMove,
	Mode,
	PaintMode,
	RotationMode,
	SelectionRect,
	Viewport,
} from "../types";

interface CanvasState {
	cells: Map<string, CellData>;
	activeColor: string;
	activePalette: Palette;
	mode: Mode;
	colorMode: ColorMode;
	cycleIndex: number;
	viewport: Viewport;

	// Tool settings
	brushWidth: number;
	eraserWidth: number;
	paintMode: PaintMode;
	paintRotation: RotationMode;
	nodeRotation: RotationMode;

	// Node tool
	nodePoints: Array<{ x: number; y: number }>;

	// Background
	backgroundColor: BackgroundColor;
	exportBackground: boolean;

	// Selection
	selectedCells: Set<string>;
	selectionRect: SelectionRect | null;
	dragMove: DragMove | null;

	// History
	past: Map<string, CellData>[];
	future: Map<string, CellData>[];

	// Actions
	pushHistory: () => void;
	undo: () => void;
	redo: () => void;
	fillCell: (key: string) => void;
	eraseCell: (key: string) => void;
	paintAtPixel: (x: number, y: number) => void;
	paintLine: (x1: number, y1: number, x2: number, y2: number) => void;
	eraseLine: (x1: number, y1: number, x2: number, y2: number) => void;
	eraseAtPixel: (x: number, y: number) => void;
	nodeClick: (x: number, y: number) => void;
	clearNodePoints: () => void;
	setActiveColor: (color: string) => void;
	setActivePalette: (palette: Palette) => void;
	setMode: (mode: Mode) => void;
	setColorMode: (colorMode: ColorMode) => void;
	setBrushWidth: (width: number) => void;
	setEraserWidth: (width: number) => void;
	setPaintMode: (paintMode: PaintMode) => void;
	setPaintRotation: (rotation: RotationMode) => void;
	setNodeRotation: (rotation: RotationMode) => void;
	setBackgroundColor: (color: BackgroundColor) => void;
	setExportBackground: (enabled: boolean) => void;
	// Selection actions
	selectCell: (key: string) => void;
	toggleSelectCell: (key: string) => void;
	selectRegion: (rect: SelectionRect) => void;
	addRegion: (rect: SelectionRect) => void;
	clearSelection: () => void;
	setSelectionRect: (rect: SelectionRect | null) => void;
	setDragMove: (drag: DragMove | null) => void;

	// Transform actions
	rotateSelected: (delta: number) => void;
	orbitSelected: (delta: number) => void;
	moveSelected: (deltaQ: number, deltaR: number) => void;
	recolorSelected: (color: string) => void;
	deleteSelected: () => void;

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

function cycleColor(colors: readonly [string, ...string[]], idx: number): string {
	return colors[idx % colors.length] ?? colors[0];
}

function getColor(state: CanvasState): { color: string; cycleIndex: number } {
	if (state.colorMode === "stable") {
		return { color: state.activeColor, cycleIndex: state.cycleIndex };
	}
	const color = cycleColor(state.activePalette.colors, state.cycleIndex);
	return { color, cycleIndex: state.cycleIndex + 1 };
}

function getRotation(hex: { q: number; r: number }, rotationMode: RotationMode): number {
	return rotationMode === "auto" ? hexRotation(hex) : rotationMode;
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
	cells: new Map(),
	activeColor: NIX_BLUE.colors[0],
	activePalette: NIX_BLUE,
	mode: "paint",
	colorMode: "stable",
	cycleIndex: 0,
	viewport: DEFAULT_VIEWPORT,
	brushWidth: 1,
	eraserWidth: 1,
	paintMode: "paint",
	paintRotation: "auto",
	nodeRotation: "auto",
	nodePoints: [],
	selectedCells: new Set(),
	selectionRect: null,
	dragMove: null,
	backgroundColor: "#1a1a2e",
	exportBackground: false,
	past: [],
	future: [],

	pushHistory: () =>
		set((state) => {
			const MAX_HISTORY = 50;
			const newPast = [...state.past, new Map(state.cells)].slice(-MAX_HISTORY);
			return { past: newPast, future: [] };
		}),

	undo: () =>
		set((state) => {
			const prev = state.past[state.past.length - 1];
			if (!prev) return state;
			return {
				past: state.past.slice(0, -1),
				future: [new Map(state.cells), ...state.future],
				cells: new Map(prev),
			};
		}),

	redo: () =>
		set((state) => {
			const next = state.future[0];
			if (!next) return state;
			return {
				past: [...state.past, new Map(state.cells)],
				future: state.future.slice(1),
				cells: new Map(next),
			};
		}),

	fillCell: (key) =>
		set((state) => {
			if (state.cells.has(key)) return state;
			const hex = parseHexKey(key);
			const { color, cycleIndex } = getColor(state);
			const newCells = new Map(state.cells);
			newCells.set(key, { color, rotation: getRotation(hex, state.paintRotation) });
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
		const center = pixelToHex(x, y);
		const state = get();
		const hexes = hexesInRadius(center, state.brushWidth);
		set((s) => {
			const newCells = new Map(s.cells);
			let changed = false;
			let idx = s.cycleIndex;
			for (const hex of hexes) {
				const key = hexKey(hex);
				if (!newCells.has(key)) {
					let color: string;
					if (s.colorMode === "cycle") {
						color = cycleColor(s.activePalette.colors, idx);
						idx++;
					} else {
						color = s.activeColor;
					}
					newCells.set(key, { color, rotation: getRotation(hex, s.paintRotation) });
					changed = true;
				}
			}
			return changed ? { cells: newCells, cycleIndex: idx } : s;
		});
	},

	paintLine: (x1, y1, x2, y2) => {
		const lineHexes = hexesOnLine(x1, y1, x2, y2);
		const state = get();
		set((s) => {
			const newCells = new Map(s.cells);
			let changed = false;
			let idx = s.cycleIndex;
			for (const lineHex of lineHexes) {
				const area = hexesInRadius(lineHex, state.brushWidth);
				for (const hex of area) {
					const key = hexKey(hex);
					if (!newCells.has(key)) {
						let color: string;
						if (s.colorMode === "cycle") {
							color = cycleColor(s.activePalette.colors, idx);
							idx++;
						} else {
							color = s.activeColor;
						}
						newCells.set(key, { color, rotation: getRotation(hex, s.paintRotation) });
						changed = true;
					}
				}
			}
			return changed ? { cells: newCells, cycleIndex: idx } : s;
		});
	},

	eraseLine: (x1, y1, x2, y2) => {
		const lineHexes = hexesOnLine(x1, y1, x2, y2);
		const state = get();
		set((s) => {
			const newCells = new Map(s.cells);
			let changed = false;
			for (const lineHex of lineHexes) {
				const area = hexesInRadius(lineHex, state.eraserWidth);
				for (const hex of area) {
					const key = hexKey(hex);
					if (newCells.has(key)) {
						newCells.delete(key);
						changed = true;
					}
				}
			}
			return changed ? { cells: newCells } : s;
		});
	},

	eraseAtPixel: (x, y) => {
		const center = pixelToHex(x, y);
		const state = get();
		const hexes = hexesInRadius(center, state.eraserWidth);
		set((s) => {
			const newCells = new Map(s.cells);
			let changed = false;
			for (const hex of hexes) {
				const key = hexKey(hex);
				if (newCells.has(key)) {
					newCells.delete(key);
					changed = true;
				}
			}
			return changed ? { cells: newCells } : s;
		});
	},

	nodeClick: (x, y) => {
		const state = get();
		const prevPoints = state.nodePoints;
		const newPoint = { x, y };

		const last = prevPoints[prevPoints.length - 1];
		if (last) {
			const lineHexes = hexesOnLine(last.x, last.y, x, y);
			set((s) => {
				const newCells = new Map(s.cells);
				let changed = false;
				let idx = s.cycleIndex;
				for (const hex of lineHexes) {
					const key = hexKey(hex);
					if (!newCells.has(key)) {
						let color: string;
						if (s.colorMode === "cycle") {
							color = cycleColor(s.activePalette.colors, idx);
							idx++;
						} else {
							color = s.activeColor;
						}
						newCells.set(key, { color, rotation: getRotation(hex, s.nodeRotation) });
						changed = true;
					}
				}
				return {
					...(changed ? { cells: newCells, cycleIndex: idx } : {}),
					nodePoints: [...prevPoints, newPoint],
				};
			});
		} else {
			set({ nodePoints: [newPoint] });
		}
	},

	clearNodePoints: () => set({ nodePoints: [] }),

	setActiveColor: (color) => set({ activeColor: color }),

	setActivePalette: (palette) =>
		set({ activePalette: palette, activeColor: palette.colors[0], cycleIndex: 0 }),

	setMode: (mode) => {
		const prev = get().mode;
		const updates: Partial<CanvasState> = { mode };
		if (prev === "node" && mode !== "node") {
			updates.nodePoints = [];
		}
		if (prev === "select" && mode !== "select") {
			updates.selectedCells = new Set();
			updates.selectionRect = null;
			updates.dragMove = null;
		}
		set(updates);
	},

	// Selection actions
	selectCell: (key) =>
		set((state) => {
			if (!state.cells.has(key)) return state;
			return { selectedCells: new Set([key]) };
		}),

	toggleSelectCell: (key) =>
		set((state) => {
			if (!state.cells.has(key)) return state;
			const next = new Set(state.selectedCells);
			if (next.has(key)) {
				next.delete(key);
			} else {
				next.add(key);
			}
			return { selectedCells: next };
		}),

	selectRegion: (rect) =>
		set((state) => {
			const selected = new Set<string>();
			for (const [key] of state.cells) {
				const hex = parseHexKey(key);
				const { x, y } = hexToPixel(hex);
				const minX = Math.min(rect.x1, rect.x2);
				const maxX = Math.max(rect.x1, rect.x2);
				const minY = Math.min(rect.y1, rect.y2);
				const maxY = Math.max(rect.y1, rect.y2);
				if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
					selected.add(key);
				}
			}
			return { selectedCells: selected, selectionRect: null };
		}),

	addRegion: (rect) =>
		set((state) => {
			const selected = new Set(state.selectedCells);
			for (const [key] of state.cells) {
				const hex = parseHexKey(key);
				const { x, y } = hexToPixel(hex);
				const minX = Math.min(rect.x1, rect.x2);
				const maxX = Math.max(rect.x1, rect.x2);
				const minY = Math.min(rect.y1, rect.y2);
				const maxY = Math.max(rect.y1, rect.y2);
				if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
					selected.add(key);
				}
			}
			return { selectedCells: selected, selectionRect: null };
		}),

	clearSelection: () => set({ selectedCells: new Set(), selectionRect: null, dragMove: null }),

	setSelectionRect: (rect) => set({ selectionRect: rect }),

	setDragMove: (drag) => set({ dragMove: drag }),

	// Transform actions
	rotateSelected: (delta) => {
		get().pushHistory();
		set((state) => {
			const newCells = new Map(state.cells);
			for (const key of state.selectedCells) {
				const cell = newCells.get(key);
				if (cell) {
					newCells.set(key, {
						...cell,
						rotation: ((cell.rotation + delta) % 360 + 360) % 360,
					});
				}
			}
			return { cells: newCells };
		});
	},

	orbitSelected: (delta) => {
		get().pushHistory();
		set((state) => {
			const keys = [...state.selectedCells];
			if (keys.length === 0) return state;
			const center = selectionCentroid(keys);
			const newCells = new Map(state.cells);
			const newSelected = new Set<string>();
			const movedEntries: Array<{ key: string; cell: CellData }> = [];

			// Remove old positions
			for (const key of keys) {
				const cell = newCells.get(key);
				if (cell) {
					const hex = parseHexKey(key);
					const rotated = hexRotateAround(hex, center, delta);
					const newKey = hexKey(rotated);
					movedEntries.push({
						key: newKey,
						cell: {
							...cell,
							rotation: ((cell.rotation + delta) % 360 + 360) % 360,
						},
					});
					newCells.delete(key);
				}
			}

			// Place at new positions (overwrites)
			for (const entry of movedEntries) {
				newCells.set(entry.key, entry.cell);
				newSelected.add(entry.key);
			}

			return { cells: newCells, selectedCells: newSelected };
		});
	},

	moveSelected: (deltaQ, deltaR) => {
		get().pushHistory();
		set((state) => {
			const keys = [...state.selectedCells];
			if (keys.length === 0) return state;
			const newCells = new Map(state.cells);
			const newSelected = new Set<string>();
			const movedEntries: Array<{ key: string; cell: CellData }> = [];

			// Collect and remove old positions
			for (const key of keys) {
				const cell = newCells.get(key);
				if (cell) {
					const hex = parseHexKey(key);
					const newKey = hexKey({ q: hex.q + deltaQ, r: hex.r + deltaR });
					movedEntries.push({ key: newKey, cell });
					newCells.delete(key);
				}
			}

			// Place at new positions (overwrites)
			for (const entry of movedEntries) {
				newCells.set(entry.key, entry.cell);
				newSelected.add(entry.key);
			}

			return { cells: newCells, selectedCells: newSelected, dragMove: null };
		});
	},

	recolorSelected: (color) => {
		get().pushHistory();
		set((state) => {
			const newCells = new Map(state.cells);
			for (const key of state.selectedCells) {
				const cell = newCells.get(key);
				if (cell) {
					newCells.set(key, { ...cell, color });
				}
			}
			return { cells: newCells };
		});
	},

	deleteSelected: () => {
		get().pushHistory();
		set((state) => {
			const newCells = new Map(state.cells);
			for (const key of state.selectedCells) {
				newCells.delete(key);
			}
			return { cells: newCells, selectedCells: new Set() };
		});
	},

	setColorMode: (colorMode) => set({ colorMode }),
	setBrushWidth: (brushWidth) => set({ brushWidth }),
	setEraserWidth: (eraserWidth) => set({ eraserWidth }),
	setPaintMode: (paintMode) => set({ paintMode }),
	setPaintRotation: (paintRotation) => set({ paintRotation }),
	setNodeRotation: (nodeRotation) => set({ nodeRotation }),
	setBackgroundColor: (backgroundColor) => set({ backgroundColor }),
	setExportBackground: (exportBackground) => set({ exportBackground }),

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

	clearAll: () => {
		get().pushHistory();
		set({ cells: new Map() });
	},

	loadCells: (cells) => set({ cells }),
}));
