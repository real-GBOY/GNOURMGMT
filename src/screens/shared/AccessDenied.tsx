/** @format */

import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Shield, Home, ArrowLeft, Lock, AlertTriangle } from "lucide-react";
import { useTheme } from "../../shared/contexts/ThemeContext";

const AccessDenied: React.FC = () => {
	const { theme } = useTheme();

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.2,
				delayChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: { opacity: 1, y: 0 },
	};

	return (
		<div
			className={`min-h-screen flex items-center justify-center px-6 transition-colors duration-300 ${
				theme === "dark" ? "bg-gray-900" : "bg-gray-50"
			}`}>
			<motion.div
				className='text-center max-w-lg w-full'
				variants={containerVariants}
				initial='hidden'
				animate='visible'>
				{/* Access Denied Icon */}
				<motion.div
					className='flex justify-center mb-8'
					variants={itemVariants}>
					<div
						className={`w-28 h-28 rounded-full flex items-center justify-center transition-all duration-300 ${
							theme === "dark"
								? "bg-red-500/20 text-red-400 shadow-lg shadow-red-500/20"
								: "bg-red-100 text-red-600 shadow-lg shadow-red-200"
						}`}>
						<Shield size={56} />
					</div>
				</motion.div>

				{/* Error Message */}
				<motion.h1
					className={`text-5xl font-bold mb-6 transition-colors duration-300 ${
						theme === "dark" ? "text-white" : "text-gray-900"
					}`}
					variants={itemVariants}>
					Access Denied
				</motion.h1>

				<motion.p
					className={`text-xl mb-8 leading-relaxed transition-colors duration-300 ${
						theme === "dark" ? "text-gray-300" : "text-gray-600"
					}`}
					variants={itemVariants}>
					You don't have permission to access this page. Please contact your
					administrator if you believe this is an error.
				</motion.p>

				{/* Additional Info Card */}
				<motion.div
					className={`mb-10 p-6 rounded-xl border-2 transition-all duration-300 ${
						theme === "dark"
							? "border-red-500/30 bg-red-500/5 shadow-lg shadow-red-500/10"
							: "border-red-200 bg-red-50 shadow-lg shadow-red-100"
					}`}
					variants={itemVariants}
					whileHover={{ scale: 1.02 }}
					transition={{ duration: 0.2 }}>
					<div className='flex items-center justify-center space-x-3 mb-3'>
						<AlertTriangle
							size={20}
							className={theme === "dark" ? "text-red-400" : "text-red-600"}
						/>
						<span
							className={`text-lg font-semibold transition-colors duration-300 ${
								theme === "dark" ? "text-red-300" : "text-red-700"
							}`}>
							Required Permissions
						</span>
					</div>
					<p
						className={`text-base transition-colors duration-300 ${
							theme === "dark" ? "text-gray-300" : "text-gray-700"
						}`}>
						This page requires specific permissions that your account doesn't
						have. Contact your administrator to request access.
					</p>
				</motion.div>

				{/* Action Buttons */}
				<motion.div
					className='flex flex-col sm:flex-row gap-4 justify-center mb-8'
					variants={itemVariants}>
					<Link
						to='/'
						className={`flex items-center justify-center space-x-3 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg ${
							theme === "dark"
								? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-500/25"
								: "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-500/25"
						}`}>
						<Home size={22} />
						<span>Go Home</span>
					</Link>

					<button
						onClick={() => window.history.back()}
						className={`flex items-center justify-center space-x-3 px-8 py-4 rounded-xl border-2 font-semibold text-lg transition-all duration-300 ${
							theme === "dark"
								? "border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500"
								: "border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400"
						}`}>
						<ArrowLeft size={22} />
						<span>Go Back</span>
					</button>
				</motion.div>

				{/* Decorative Elements */}
				<motion.div
					className='flex justify-center space-x-2'
					variants={itemVariants}>
					<div
						className={`w-3 h-3 rounded-full transition-all duration-300 ${
							theme === "dark" ? "bg-red-500" : "bg-red-500"
						}`}
					/>
					<div
						className={`w-3 h-3 rounded-full transition-all duration-300 ${
							theme === "dark" ? "bg-gray-600" : "bg-gray-400"
						}`}
					/>
					<div
						className={`w-3 h-3 rounded-full transition-all duration-300 ${
							theme === "dark" ? "bg-blue-500" : "bg-blue-500"
						}`}
					/>
				</motion.div>

				{/* Footer Text */}
				<motion.p
					className={`mt-8 text-sm transition-colors duration-300 ${
						theme === "dark" ? "text-gray-500" : "text-gray-400"
					}`}
					variants={itemVariants}>
					If you need assistance, please contact support
				</motion.p>
			</motion.div>
		</div>
	);
};

export default AccessDenied;
