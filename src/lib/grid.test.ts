import { describe, expect, it } from "vitest";
import {
	hexesOnLine,
	hexKey,
	hexNeighbors,
	hexRotation,
	hexToPixel,
	parseHexKey,
	pixelToHex,
} from "./grid";

describe("hexToPixel / pixelToHex roundtrip", () => {
	const cases = [
		{ q: 0, r: 0 },
		{ q: 1, r: 0 },
		{ q: 0, r: 1 },
		{ q: -1, r: 1 },
		{ q: 3, r: -2 },
		{ q: -5, r: 7 },
	];

	for (const hex of cases) {
		it(`roundtrips (${hex.q}, ${hex.r})`, () => {
			const { x, y } = hexToPixel(hex);
			const back = pixelToHex(x, y);
			expect(back.q).toBe(hex.q);
			expect(back.r).toBe(hex.r);
		});
	}
});

describe("pixelToHex", () => {
	it("origin maps to (0,0)", () => {
		const hex = pixelToHex(0, 0);
		expect(hex.q).toBe(0);
		expect(hex.r).toBe(0);
	});
});

describe("hexRotation", () => {
	it("returns multiples of 60", () => {
		for (let q = -5; q <= 5; q++) {
			for (let r = -5; r <= 5; r++) {
				const rot = hexRotation({ q, r });
				expect(rot % 60).toBe(0);
				expect(rot).toBeGreaterThanOrEqual(0);
				expect(rot).toBeLessThan(360);
			}
		}
	});

	it("is deterministic", () => {
		const a = hexRotation({ q: 3, r: -1 });
		const b = hexRotation({ q: 3, r: -1 });
		expect(a).toBe(b);
	});
});

describe("hexNeighbors", () => {
	it("returns 6 neighbors", () => {
		const neighbors = hexNeighbors({ q: 0, r: 0 });
		expect(neighbors).toHaveLength(6);
	});

	it("neighbors are all distance 1 away", () => {
		const center = { q: 2, r: 3 };
		const neighbors = hexNeighbors(center);
		for (const n of neighbors) {
			const dq = Math.abs(n.q - center.q);
			const dr = Math.abs(n.r - center.r);
			const ds = Math.abs(-n.q - n.r - (-center.q - center.r));
			const dist = Math.max(dq, dr, ds);
			expect(dist).toBe(1);
		}
	});
});

describe("hexKey / parseHexKey", () => {
	it("roundtrips", () => {
		const hex = { q: -3, r: 7 };
		const key = hexKey(hex);
		const back = parseHexKey(key);
		expect(back.q).toBe(hex.q);
		expect(back.r).toBe(hex.r);
	});
});

describe("hexesOnLine", () => {
	it("returns at least start and end cells", () => {
		const { x: x1, y: y1 } = { x: 0, y: 0 };
		const { x: x2, y: y2 } = { x: 200, y: 100 };
		const hexes = hexesOnLine(x1, y1, x2, y2);
		expect(hexes.length).toBeGreaterThanOrEqual(2);
	});

	it("returns single cell for zero-length line", () => {
		const hexes = hexesOnLine(0, 0, 0, 0);
		expect(hexes).toHaveLength(1);
	});

	it("returns no duplicate cells", () => {
		const hexes = hexesOnLine(0, 0, 300, 150);
		const keys = hexes.map(hexKey);
		expect(new Set(keys).size).toBe(keys.length);
	});
});
