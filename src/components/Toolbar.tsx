import { useState } from "react";
import { useCanvasStore } from "../store/canvas";
import { AboutDialog } from "./AboutDialog";
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
	const [showAbout, setShowAbout] = useState(false);

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
			<div className="toolbar-spacer" />
			<button type="button" onClick={() => setShowAbout(true)}>
				About
			</button>
			{showAbout && <AboutDialog onClose={() => setShowAbout(false)} />}
		</div>
	);
}
