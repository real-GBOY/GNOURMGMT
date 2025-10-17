/** @format */

import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import { useTheme } from "../../shared/contexts/ThemeContext";

const NotFound: React.FC = () => {
	const { theme } = useTheme();

	return (
		<div className='min-h-screen flex items-center justify-center px-6'>
			<motion.div
				className='text-center'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}>
				{/* 404 Number */}
				<motion.h1
					className={`text-9xl font-bold mb-4 transition-colors duration-300 ${
						theme === "dark" ? "text-gray-800" : "text-gray-100"
					}`}
					initial={{ scale: 0.5 }}
					animate={{ scale: 1 }}
					transition={{ duration: 0.8, type: "spring" }}>
					404
				</motion.h1>

				{/* Error Message */}
				<motion.h2
					className={`text-3xl font-bold mb-4 transition-colors duration-300 ${
						theme === "dark" ? "text-white" : "text-black"
					}`}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.2 }}>
					Page Not Found
				</motion.h2>

				<motion.p
					className={`text-lg mb-8 max-w-md mx-auto transition-colors duration-300 ${
						theme === "dark" ? "text-gray-400" : "text-gray-600"
					}`}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.4 }}>
					The page you're looking for doesn't exist or has been moved. Let's get
					you back on track.
				</motion.p>

				{/* Action Buttons */}
				<motion.div
					className='flex flex-col sm:flex-row gap-4 justify-center'
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.6 }}>
					<Link
						to='/'
						className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors duration-300 ${
							theme === "dark"
								? "bg-blue-500 text-white hover:bg-blue-600"
								: "bg-black text-white hover:bg-gray-800"
						}`}>
						<Home size={20} />
						<span>Go Home</span>
					</Link>

					<button
						onClick={() => window.history.back()}
						className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-lg border font-medium transition-colors duration-300 ${
							theme === "dark"
								? "border-gray-600 text-gray-300 hover:bg-gray-700"
								: "border-gray-300 text-gray-700 hover:bg-gray-50"
						}`}>
						<ArrowLeft size={20} />
						<span>Go Back</span>
					</button>
				</motion.div>

				{/* Decorative Elements */}
				<motion.div
					className='mt-12'
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.8 }}>
					<div
						className={`w-24 h-1 mx-auto rounded-full transition-colors duration-300 ${
							theme === "dark" ? "bg-gray-700" : "bg-gray-300"
						}`}
					/>
				</motion.div>
			</motion.div>
		</div>
	);
};

export default NotFound; 