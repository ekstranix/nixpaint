import { useEffect, useRef } from "react";

export function AboutDialog({ onClose }: { onClose: () => void }) {
	const ref = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		const dialog = ref.current;
		if (!dialog) return;
		dialog.showModal();
		const handleClose = () => onClose();
		dialog.addEventListener("close", handleClose);
		return () => dialog.removeEventListener("close", handleClose);
	}, [onClose]);

	const handleBackdropClick = (e: React.MouseEvent) => {
		if (e.target === ref.current) ref.current?.close();
	};

	return (
		<dialog
			ref={ref}
			className="about-dialog"
			onClick={handleBackdropClick}
			onKeyDown={(e) => {
				if (e.key === "Escape") ref.current?.close();
			}}
		>
			<div className="about-content">
				<button type="button" className="about-close" onClick={onClose}>
					&times;
				</button>
				<h2>nixpaint</h2>
				<p>v{__APP_VERSION__}</p>
				<p>&copy; 2026 Pim Snel</p>
				<p>MIT License</p>
				<p>
					<a href="https://extranix.com" target="_blank" rel="noopener noreferrer">
						extranix.com
					</a>
				</p>
				<p>
					<a href="https://github.com/ekstranix/nixpaint" target="_blank" rel="noopener noreferrer">
						GitHub
					</a>
				</p>
				<p>
					<a
						href="https://github.com/ekstranix/nixpaint/releases"
						target="_blank"
						rel="noopener noreferrer"
					>
						Changelog
					</a>
				</p>
			</div>
		</dialog>
	);
}
