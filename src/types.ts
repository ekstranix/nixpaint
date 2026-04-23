export type Mode = "paint" | "erase" | "pan" | "node" | "foreground" | "background";

export type ColorMode = "stable" | "cycle";

export type RotationMode = "auto" | 0 | 60 | 120 | 180 | 240 | 300;

export type PaintMode = "paint" | "stamp";

export type BackgroundColor = "#ffffff" | "#808080" | "#1a1a2e";

export interface CellData {
	color: string;
	rotation: number;
}

export interface Viewport {
	x: number;
	y: number;
	width: number;
	height: number;
	zoom: number;
}
