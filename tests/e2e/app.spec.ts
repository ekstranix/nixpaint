import { expect, test } from "@playwright/test";

test("app loads and shows canvas", async ({ page }) => {
	await page.goto("/");
	await expect(page.locator("svg")).toBeVisible();
});

test("can paint lambdas on canvas", async ({ page }) => {
	await page.goto("/");

	// Click on canvas to paint
	const svg = page.locator("svg");
	await svg.click({ position: { x: 400, y: 300 } });

	// Should have at least one path element (a lambda)
	const paths = svg.locator("path");
	await expect(paths.first()).toBeVisible();
});

test("can switch palette", async ({ page }) => {
	await page.goto("/");

	// Click the Rainbow palette button
	await page.getByText("NixOS Rainbow").click();

	// Should show 6 color swatches
	const swatches = page.locator("button.swatch");
	await expect(swatches).toHaveCount(6);
});

test("can export SVG", async ({ page }) => {
	await page.goto("/");

	// Paint something first
	const svg = page.locator("svg");
	await svg.click({ position: { x: 400, y: 300 } });

	// Click export SVG
	const downloadPromise = page.waitForEvent("download");
	await page.getByText("Export SVG").click();
	const download = await downloadPromise;
	expect(download.suggestedFilename()).toBe("drawnix.svg");
});
