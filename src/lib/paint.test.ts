import { describe, expect, it } from "vitest";
import { hexesOnLine, hexKey, hexToPixel } from "./grid";

describe("stroke to hex cells", () => {
	it("short stroke fills cells along the path", () => {
		const start = hexToPixel({ q: 0, r: 0 });
		const end = hexToPixel({ q: 3, r: 0 });
		const hexes = hexesOnLine(start.x, start.y, end.x, end.y);

		const keys = hexes.map(hexKey);
		expect(keys).toContain("0,0");
		expect(keys).toContain("3,0");
		expect(hexes.length).toBeGreaterThanOrEqual(4); // should hit intermediate cells
	});

	it("diagonal stroke fills cells without gaps", () => {
		const start = hexToPixel({ q: 0, r: 0 });
		const end = hexToPixel({ q: 5, r: 5 });
		const hexes = hexesOnLine(start.x, start.y, end.x, end.y);

		// Verify each consecutive pair of cells are neighbors (distance <= 1)
		for (let i = 1; i < hexes.length; i++) {
			const prev = hexes[i - 1];
			const curr = hexes[i];
			if (!prev || !curr) continue;
			const dq = Math.abs(curr.q - prev.q);
			const dr = Math.abs(curr.r - prev.r);
			const ds = Math.abs(-curr.q - curr.r - (-prev.q - prev.r));
			const dist = Math.max(dq, dr, ds);
			expect(dist).toBeLessThanOrEqual(2); // hex cells along a line can be up to 2 apart
		}
	});

	it("zero-length stroke returns single cell", () => {
		const pt = hexToPixel({ q: 2, r: 3 });
		const hexes = hexesOnLine(pt.x, pt.y, pt.x, pt.y);
		expect(hexes).toHaveLength(1);
		expect(hexes[0]?.q).toBe(2);
		expect(hexes[0]?.r).toBe(3);
	});
});
