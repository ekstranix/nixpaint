import { memo } from "react";
import { LAMBDA_PATH } from "../lib/lambda-path";

interface LambdaProps {
	x: number;
	y: number;
	rotation: number;
	color: string;
}

export const Lambda = memo(function Lambda({ x, y, rotation, color }: LambdaProps) {
	return (
		<path d={LAMBDA_PATH} fill={color} transform={`translate(${x},${y}) rotate(${rotation})`} />
	);
});
