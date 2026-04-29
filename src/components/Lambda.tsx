import { memo } from "react";
import { LAMBDA_PATH } from "../lib/lambda-path";

interface LambdaProps {
	x: number;
	y: number;
	rotation: number;
	color: string;
	selected?: boolean;
	opacity?: number;
}

export const Lambda = memo(function Lambda({ x, y, rotation, color, selected, opacity }: LambdaProps) {
	return (
		<g transform={`translate(${x},${y}) rotate(${rotation})`} opacity={opacity}>
			<path d={LAMBDA_PATH} fill={color} />
			{selected && (
				<>
					<path
						d={LAMBDA_PATH}
						fill="none"
						stroke="white"
						strokeWidth={2.5}
						strokeLinejoin="round"
					/>
					<path
						d={LAMBDA_PATH}
						fill="none"
						stroke="black"
						strokeWidth={2.5}
						strokeLinejoin="round"
						strokeDasharray="4 4"
						className="marching-ants"
					/>
				</>
			)}
		</g>
	);
});
