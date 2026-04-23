import { useCanvasStore } from "../store/canvas";
import { Palette } from "./Palette";

export function Toolbar({
	onExportSvg,
	onExportPng,
}: {
	onExportSvg: () => void;
	onExportPng: () => void;
}) {
	const mode = useCanvasStore((s) => s.mode);
	const setMode = useCanvasStore((s) => s.setMode);
	const clearAll = useCanvasStore((s) => s.clearAll);

	return (
		<div className="toolbar">
			<div className="toolbar-group">
				<button
					type="button"
					className={mode === "paint" ? "active" : ""}
					onClick={() => setMode("paint")}
				>
					Paint
				</button>
				<button
					type="button"
					className={mode === "erase" ? "active" : ""}
					onClick={() => setMode("erase")}
				>
					Erase
				</button>
			</div>
			<Palette />
			<div className="toolbar-group">
				<button type="button" onClick={clearAll}>
					Clear
				</button>
				<button type="button" onClick={onExportSvg}>
					Export SVG
				</button>
				<button type="button" onClick={onExportPng}>
					Export PNG
				</button>
			</div>
		</div>
	);
}
