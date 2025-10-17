/** @format */

import React from "react";
import { useTheme } from "../contexts/ThemeContext";

interface CornerLightsProps {
	className?: string;
}

const CornerLights: React.FC<CornerLightsProps> = ({ className = "" }) => {
	const { theme } = useTheme();

	return (
		<div className={`fixed inset-0 pointer-events-none z-0 ${className}`}>
			{/* Top Right Corner Light - Cyan */}
			<div className='absolute top-0 right-0 w-64 h-64'>
				<div
					className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-15 ${
						theme === "dark"
							? "bg-gradient-to-bl from-cyan-400 via-teal-500 to-blue-500"
							: "bg-gradient-to-bl from-cyan-300 via-teal-400 to-blue-400"
					}`}
				/>
				<div
					className={`absolute top-8 right-8 w-32 h-32 rounded-full blur-2xl opacity-20 ${
						theme === "dark"
							? "bg-gradient-to-bl from-teal-400 to-cyan-500"
							: "bg-gradient-to-bl from-teal-300 to-cyan-400"
					}`}
				/>
			</div>

			{/* Bottom Left Corner Light - Teal */}
			<div className='absolute bottom-0 left-0 w-64 h-64'>
				<div
					className={`absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl opacity-15 ${
						theme === "dark"
							? "bg-gradient-to-tr from-teal-400 via-cyan-500 to-blue-500"
							: "bg-gradient-to-tr from-teal-300 via-cyan-400 to-blue-400"
					}`}
				/>
				<div
					className={`absolute bottom-8 left-8 w-32 h-32 rounded-full blur-2xl opacity-20 ${
						theme === "dark"
							? "bg-gradient-to-tr from-cyan-400 to-teal-500"
							: "bg-gradient-to-tr from-cyan-300 to-teal-400"
					}`}
				/>
			</div>
		</div>
	);
};

export default CornerLights;
