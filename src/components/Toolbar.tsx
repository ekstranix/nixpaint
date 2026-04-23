import { useState } from "react";
import { useCanvasStore } from "../store/canvas";
import { AboutDialog } from "./AboutDialog";

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
	const undo = useCanvasStore((s) => s.undo);
	const redo = useCanvasStore((s) => s.redo);
	const canUndo = useCanvasStore((s) => s.past.length > 0);
	const canRedo = useCanvasStore((s) => s.future.length > 0);
	const [showAbout, setShowAbout] = useState(false);

	return (
		<div className="toolbar">
			<div className="toolbar-group">
				<button type="button" onClick={undo} disabled={!canUndo} title="Undo (Ctrl+Z)">
					Undo
				</button>
				<button type="button" onClick={redo} disabled={!canRedo} title="Redo (Ctrl+Shift+Z)">
					Redo
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
