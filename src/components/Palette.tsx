import { PALETTES } from "../lib/palettes";
import { useCanvasStore } from "../store/canvas";

export function Palette() {
	const activePalette = useCanvasStore((s) => s.activePalette);
	const activeColor = useCanvasStore((s) => s.activeColor);
	const setActivePalette = useCanvasStore((s) => s.setActivePalette);
	const setActiveColor = useCanvasStore((s) => s.setActiveColor);

	return (
		<div className="palette">
			<div className="palette-selector">
				{PALETTES.map((p) => (
					<button
						key={p.name}
						type="button"
						className={p.name === activePalette.name ? "active" : ""}
						onClick={() => setActivePalette(p)}
					>
						{p.name}
					</button>
				))}
			</div>
			<div className="color-swatches">
				{activePalette.colors.map((color) => (
					<button
						key={color}
						type="button"
						className={`swatch ${color === activeColor ? "active" : ""}`}
						style={{ backgroundColor: color }}
						onClick={() => setActiveColor(color)}
						aria-label={`Select color ${color}`}
					/>
				))}
			</div>
		</div>
	);
}
