import { useCanvasStore } from "../store/canvas";
import type { Mode } from "../types";

const tools: Array<{ mode: Mode; icon: string; label: string }> = [
	{ mode: "paint", icon: "\u{1F58C}\uFE0F", label: "Paint" },
	{ mode: "erase", icon: "\u{1F9F9}", label: "Erase" },
	{ mode: "pan", icon: "\u{270B}", label: "Pan" },
	{ mode: "node", icon: "\u{1F517}", label: "Node" },
	{ mode: "foreground", icon: "\u{1F3A8}", label: "Foreground Color" },
	{ mode: "background", icon: "\u{1F5BC}\uFE0F", label: "Background Color" },
];

export function SideToolbar() {
	const mode = useCanvasStore((s) => s.mode);
	const setMode = useCanvasStore((s) => s.setMode);

	return (
		<div className="side-toolbar">
			{tools.map((tool) => (
				<button
					key={tool.mode}
					type="button"
					className={mode === tool.mode ? "active" : ""}
					title={tool.label}
					onClick={() => setMode(tool.mode)}
				>
					{tool.icon}
				</button>
			))}
		</div>
	);
}
