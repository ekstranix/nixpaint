import { LAMBDA_HEIGHT, LAMBDA_WIDTH } from "./lambda-path";

/**
 * Hex grid using axial coordinates (q, r).
 * Flat-top hexagons with the lambda shape fitting inside each cell.
 */

export interface HexCoord {
	q: number;
	r: number;
}

// Hex cell size derived from lambda dimensions.
// For flat-top hexagons: width = sqrt(3) * size, height = 2 * size
// We size cells so lambdas tile with a small gap.
const HEX_SIZE = Math.max(LAMBDA_WIDTH, LAMBDA_HEIGHT) * 0.55;

const SQRT3 = Math.sqrt(3);

/** Convert hex axial coordinates to pixel (x, y) center position. */
export function hexToPixel(hex: HexCoord): { x: number; y: number } {
	const x = HEX_SIZE * (SQRT3 * hex.q + (SQRT3 / 2) * hex.r);
	const y = HEX_SIZE * ((3 / 2) * hex.r);
	return { x, y };
}

/** Convert pixel position to the nearest hex axial coordinate. */
export function pixelToHex(x: number, y: number): HexCoord {
	const q = ((SQRT3 / 3) * x - (1 / 3) * y) / HEX_SIZE;
	const r = ((2 / 3) * y) / HEX_SIZE;
	return hexRound(q, r);
}

/** Round fractional hex coordinates to the nearest hex cell. */
function hexRound(q: number, r: number): HexCoord {
	const s = -q - r;
	let rq = Math.round(q);
	let rr = Math.round(r);
	const rs = Math.round(s);

	const dq = Math.abs(rq - q);
	const dr = Math.abs(rr - r);
	const ds = Math.abs(rs - s);

	if (dq > dr && dq > ds) {
		rq = -rr - rs;
	} else if (dr > ds) {
		rr = -rq - rs;
	}

	// Avoid -0
	return { q: rq || 0, r: rr || 0 };
}

/** Get the rotation angle (in degrees) for a lambda at the given hex cell. */
export function hexRotation(hex: HexCoord): number {
	// Cycle through 6 rotations based on cell position.
	// Use a deterministic hash of (q, r) to assign rotation.
	const index = ((((hex.q % 6) + 6) % 6) + (((hex.r % 6) + 6) % 6)) % 6;
	return index * 60;
}

/** Get the 6 neighbor hex coordinates. */
export function hexNeighbors(hex: HexCoord): HexCoord[] {
	const directions: HexCoord[] = [
		{ q: 1, r: 0 },
		{ q: 1, r: -1 },
		{ q: 0, r: -1 },
		{ q: -1, r: 0 },
		{ q: -1, r: 1 },
		{ q: 0, r: 1 },
	];
	return directions.map((d) => ({ q: hex.q + d.q, r: hex.r + d.r }));
}

/** Get all hex cells within a given radius of a center hex. Radius 1 = center only, 2 = center + neighbors, etc. */
export function hexesInRadius(center: HexCoord, radius: number): HexCoord[] {
	const results: HexCoord[] = [];
	const r = radius - 1; // radius 1 = just center
	for (let dq = -r; dq <= r; dq++) {
		for (let dr = Math.max(-r, -dq - r); dr <= Math.min(r, -dq + r); dr++) {
			results.push({ q: center.q + dq, r: center.r + dr });
		}
	}
	return results;
}

/** Create a string key from hex coordinates (for use in Maps/Sets). */
export function hexKey(hex: HexCoord): string {
	return `${hex.q},${hex.r}`;
}

/** Parse a hex key back to coordinates. */
export function parseHexKey(key: string): HexCoord {
	const [q, r] = key.split(",").map(Number);
	return { q: q ?? 0, r: r ?? 0 };
}

/** Get all hex cells that a line segment from (x1,y1) to (x2,y2) crosses. */
export function hexesOnLine(x1: number, y1: number, x2: number, y2: number): HexCoord[] {
	const start = pixelToHex(x1, y1);
	const end = pixelToHex(x2, y2);

	const dist = Math.max(
		Math.abs(end.q - start.q),
		Math.abs(end.r - start.r),
		Math.abs(-end.q - end.r - (-start.q - start.r)),
	);

	if (dist === 0) return [start];

	const results: HexCoord[] = [];
	const seen = new Set<string>();

	for (let i = 0; i <= dist; i++) {
		const t = i / dist;
		const px = x1 + (x2 - x1) * t;
		const py = y1 + (y2 - y1) * t;
		const hex = pixelToHex(px, py);
		const key = hexKey(hex);
		if (!seen.has(key)) {
			seen.add(key);
			results.push(hex);
		}
	}

	return results;
}

export { HEX_SIZE };
