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
	const clearAll = useCanvasStore((s) => s.clearAll);
	const zoomIn = useCanvasStore((s) => s.zoomIn);
	const zoomOut = useCanvasStore((s) => s.zoomOut);
	const colorMode = useCanvasStore((s) => s.colorMode);
	const setColorMode = useCanvasStore((s) => s.setColorMode);
	const [showAbout, setShowAbout] = useState(false);

	return (
		<div className="toolbar">
			<Palette />
			<div className="toolbar-group">
				<button
					type="button"
					className={colorMode === "stable" ? "active" : ""}
					onClick={() => setColorMode("stable")}
				>
					Stable
				</button>
				<button
					type="button"
					className={colorMode === "cycle" ? "active" : ""}
					onClick={() => setColorMode("cycle")}
				>
					Cycle
				</button>
			</div>
			<div className="toolbar-group">
				<button type="button" onClick={zoomIn} title="Zoom In">
					+
				</button>
				<button type="button" onClick={zoomOut} title="Zoom Out">
					&minus;
				</button>
			</div>
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
