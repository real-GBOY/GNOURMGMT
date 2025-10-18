/** @format */

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../shared/contexts/AuthContext";
import { useTheme } from "../../shared/contexts/ThemeContext";
import { GenericForm } from "../../shared/components/Form/GenericForm";
import { loginSchema } from "../../shared/schemas/LoginScheme";
import { toastService } from "../../shared/services/toastService";
import usePermission from "../../shared/hooks/usePermission";

interface LoginFormData {
	email: string;
	password: string;
}

interface ApiError {
	response?: {
		data?: {
			message?: string;
		};
	};
}

const Login: React.FC = () => {
	const { theme } = useTheme();
	const { login } = useAuth();
	const navigate = useNavigate();

	const [isLoading, setIsLoading] = useState(false);

	const handleLogin = async (data: LoginFormData) => {
		try {
			setIsLoading(true);
			console.log("Attempting login with:", { email: data.email });
			await login(data.email, data.password);
			console.log("Login successful, navigating to dashboard");
			toastService.success("Login successful! Welcome back.");
			navigate("/dashboard/applicants");
		} catch (error: unknown) {
			console.error("Login error in component:", error);
			const errorMessage =
				(error as ApiError)?.response?.data?.message ||
				"Login failed. Please try again.";
			toastService.error(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='w-full max-w-sm sm:max-w-md mx-auto mt-4 sm:mt-10 px-4 sm:px-0'>
			<motion.div
				initial={{ opacity: 0, y: 20, scale: 0.95 }}
				animate={{ opacity: 1, y: 0, scale: 1 }}
				transition={{ duration: 0.6, ease: "easeOut" }}
				className={`p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl backdrop-blur-xl transition-all duration-500 ${
					theme === "dark"
						? "bg-gray-900/80 border border-gray-700/50 shadow-gray-900/50"
						: "bg-white/80 border border-gray-200/50 shadow-gray-200/50"
				}`}>
				{/* Header */}
				<div className='text-center mb-6 sm:mb-8'>
					<motion.div
						initial={{ scale: 0, rotate: -180 }}
						animate={{ scale: 1, rotate: 0 }}
						transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
						className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-300 ${
							theme === "dark"
								? "bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25"
								: "bg-gradient-to-br from-gray-900 to-black shadow-lg shadow-gray-900/25"
						}`}>
						<span
							className={`text-xl sm:text-2xl font-bold ${
								theme === "dark" ? "text-white" : "text-white"
							}`}>
							▲
						</span>
					</motion.div>

					<motion.h1
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
						className={`text-2xl sm:text-3xl font-bold mb-2 transition-colors duration-300 ${
							theme === "dark" ? "text-white" : "text-gray-900"
						}`}>
						Welcome back
					</motion.h1>

					<motion.p
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4 }}
						className={`text-xs sm:text-sm transition-colors duration-300 ${
							theme === "dark" ? "text-gray-400" : "text-gray-600"
						}`}>
						Sign in to your account to continue
					</motion.p>
				</div>

				{/* Login Form */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.5 }}>
					<GenericForm
						schema={loginSchema}
						onSubmit={handleLogin}
						submitButtonText={isLoading ? "Signing in..." : "Sign in"}
						className='space-y-6'
					/>
				</motion.div>

				{/* Divider */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.7 }}
					className='relative my-4 sm:my-6'>
					<div
						className={`absolute inset-0 flex items-center transition-colors duration-300 ${
							theme === "dark" ? "border-gray-700" : "border-gray-200"
						}`}>
						<div
							className={`w-full border-t transition-colors duration-300 ${
								theme === "dark" ? "border-gray-700" : "border-gray-200"
							}`}
						/>
					</div>
					<div className='relative flex justify-center text-sm'>
						<span
							className={`px-2 transition-colors duration-300 ${
								theme === "dark"
									? "bg-gray-900/80 text-gray-400"
									: "bg-white/80 text-gray-500"
							}`}>
							Or continue with
						</span>
					</div>
				</motion.div>

				{/* Footer */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.9 }}
					className='text-center mt-4 sm:mt-6'>
					<p
						className={`text-xs sm:text-sm transition-colors duration-300 ${
							theme === "dark" ? "text-gray-400" : "text-gray-600"
						}`}>
						Don't have an account?{" "}
						<Link
							to='/signup'
							className={`font-medium hover:underline transition-colors duration-300 ${
								theme === "dark"
									? "text-blue-400 hover:text-blue-300"
									: "text-blue-600 hover:text-blue-700"
							}`}>
							Sign up
						</Link>
					</p>
				</motion.div>
			</motion.div>
		</div>
	);
};
// A7A
export default Login;
