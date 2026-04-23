export function AboutDialog({ onClose }: { onClose: () => void }) {
	return (
		<div className="about-backdrop" onClick={onClose}>
			<div className="about-dialog" onClick={(e) => e.stopPropagation()}>
				<button type="button" className="about-close" onClick={onClose}>
					&times;
				</button>
				<h2>nixpaint</h2>
				<p>&copy; 2026 Pim Snel</p>
				<p>MIT License</p>
				<p>
					<a href="https://extranix.com" target="_blank" rel="noopener noreferrer">
						extranix.com
					</a>
				</p>
				<p>
					<a
						href="https://github.com/ekstranix/nixpaint"
						target="_blank"
						rel="noopener noreferrer"
					>
						GitHub
					</a>
				</p>
			</div>
		</div>
	);
}
