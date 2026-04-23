import { PALETTES } from "../lib/palettes";
import { useCanvasStore } from "../store/canvas";
import type { BackgroundColor, PaintMode, RotationMode } from "../types";

const ROTATIONS: RotationMode[] = ["auto", 0, 60, 120, 180, 240, 300];
const BG_COLORS: Array<{ color: BackgroundColor; label: string }> = [
	{ color: "#1a1a2e", label: "Dark Blue" },
	{ color: "#808080", label: "Gray" },
	{ color: "#ffffff", label: "White" },
];

function RotationSelector({
	value,
	onChange,
}: { value: RotationMode; onChange: (r: RotationMode) => void }) {
	return (
		<label className="option-label">
			Rotation
			<select
				value={String(value)}
				onChange={(e) => {
					const v = e.target.value;
					onChange(v === "auto" ? "auto" : (Number(v) as RotationMode));
				}}
			>
				{ROTATIONS.map((r) => (
					<option key={String(r)} value={String(r)}>
						{r === "auto" ? "Auto" : `${r}°`}
					</option>
				))}
			</select>
		</label>
	);
}

function WidthSelector({
	label,
	value,
	onChange,
}: { label: string; value: number; onChange: (w: number) => void }) {
	return (
		<label className="option-label">
			{label}
			<input
				type="range"
				min={1}
				max={5}
				value={value}
				onChange={(e) => onChange(Number(e.target.value))}
			/>
			<span>{value}</span>
		</label>
	);
}

function PaintOptions() {
	const brushWidth = useCanvasStore((s) => s.brushWidth);
	const setBrushWidth = useCanvasStore((s) => s.setBrushWidth);
	const paintMode = useCanvasStore((s) => s.paintMode);
	const setPaintMode = useCanvasStore((s) => s.setPaintMode);
	const paintRotation = useCanvasStore((s) => s.paintRotation);
	const setPaintRotation = useCanvasStore((s) => s.setPaintRotation);

	return (
		<>
			<WidthSelector label="Brush" value={brushWidth} onChange={setBrushWidth} />
			<div className="toolbar-group">
				<button
					type="button"
					className={paintMode === "paint" ? "active" : ""}
					onClick={() => setPaintMode("paint" as PaintMode)}
				>
					Paint
				</button>
				<button
					type="button"
					className={paintMode === "stamp" ? "active" : ""}
					onClick={() => setPaintMode("stamp" as PaintMode)}
				>
					Stamp
				</button>
			</div>
			<RotationSelector value={paintRotation} onChange={setPaintRotation} />
		</>
	);
}

function EraseOptions() {
	const eraserWidth = useCanvasStore((s) => s.eraserWidth);
	const setEraserWidth = useCanvasStore((s) => s.setEraserWidth);

	return <WidthSelector label="Eraser" value={eraserWidth} onChange={setEraserWidth} />;
}

function NodeOptions() {
	const nodeRotation = useCanvasStore((s) => s.nodeRotation);
	const setNodeRotation = useCanvasStore((s) => s.setNodeRotation);

	return <RotationSelector value={nodeRotation} onChange={setNodeRotation} />;
}

function ForegroundOptions() {
	const activePalette = useCanvasStore((s) => s.activePalette);
	const activeColor = useCanvasStore((s) => s.activeColor);
	const setActiveColor = useCanvasStore((s) => s.setActiveColor);
	const setActivePalette = useCanvasStore((s) => s.setActivePalette);
	const colorMode = useCanvasStore((s) => s.colorMode);
	const setColorMode = useCanvasStore((s) => s.setColorMode);

	return (
		<>
			<div className="toolbar-group">
				{PALETTES.map((p) => (
					<button
						key={p.name}
						type="button"
						className={activePalette.name === p.name ? "active" : ""}
						onClick={() => setActivePalette(p as typeof activePalette)}
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
						className={`swatch ${activeColor === color ? "active" : ""}`}
						style={{ background: color }}
						onClick={() => setActiveColor(color)}
					/>
				))}
			</div>
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
		</>
	);
}

function BackgroundOptions() {
	const backgroundColor = useCanvasStore((s) => s.backgroundColor);
	const setBackgroundColor = useCanvasStore((s) => s.setBackgroundColor);
	const exportBackground = useCanvasStore((s) => s.exportBackground);
	const setExportBackground = useCanvasStore((s) => s.setExportBackground);

	return (
		<>
			<div className="toolbar-group">
				{BG_COLORS.map(({ color, label }) => (
					<button
						key={color}
						type="button"
						className={backgroundColor === color ? "active" : ""}
						onClick={() => setBackgroundColor(color)}
					>
						{label}
					</button>
				))}
			</div>
			<label className="option-label">
				<input
					type="checkbox"
					checked={exportBackground}
					onChange={(e) => setExportBackground(e.target.checked)}
				/>
				Export background
			</label>
		</>
	);
}

export function ToolOptionsBar() {
	const mode = useCanvasStore((s) => s.mode);

	return (
		<div className="tool-options-bar">
			{mode === "paint" && <PaintOptions />}
			{mode === "erase" && <EraseOptions />}
			{mode === "pan" && <span className="option-hint">Drag to pan the canvas</span>}
			{mode === "node" && <NodeOptions />}
			{mode === "foreground" && <ForegroundOptions />}
			{mode === "background" && <BackgroundOptions />}
		</div>
	);
}
