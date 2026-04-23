export type Mode = "paint" | "erase";

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
