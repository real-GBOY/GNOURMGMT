/** @format */

import React from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "../../shared/contexts/AuthContext";
import { useTheme } from "../../shared/contexts/ThemeContext";
import { GenericForm } from "../../shared/components/Form/GenericForm";
import { signupPhase1Schema } from "../../shared/schemas/SignupPhase1Scheme";
import { signupPhase2Schema } from "../../shared/schemas/SignupPhase2Scheme";
import apiRepo from "../../shared/config/apiRepo";
import endPoints from "../../shared/config/endPoints";
import { reactQueryKeys } from "../../shared/config/reactQueryKeys";
import { toastService } from "../../shared/services/toastService";
import Cookies from "js-cookie";

interface SignupFormData {
	firstName: string;
	lastName: string;
	nationalID: string;
	dateOfBirth: string;
	email: string;
	password: string;
	phoneNumber: string;
	file: File;
	team: string;
}

interface Team {
	_id: string;
	name: string;
	description: string;
}

const Signup: React.FC = () => {
	const { theme } = useTheme();
	const { setAuthData } = useAuth();
	const navigate = useNavigate();
	const [currentPhase, setCurrentPhase] = React.useState(1);
	const [phase1Data, setPhase1Data] = React.useState<any>(null);

	// Fetch teams for the dropdown
	const {
		data: teams = [],
		isLoading: teamsLoading,
		error: teamsError,
	} = useQuery({
		queryKey: reactQueryKeys.teams.lists(),
		queryFn: async () => {
			const response = await apiRepo.GET(endPoints.teams);
			return response || [];
		},
	});

	const signupMutation = useMutation({
		mutationFn: async (data: SignupFormData) => {
			// Create FormData for file upload
			const formData = new FormData();
			formData.append("firstName", data.firstName);
			formData.append("lastName", data.lastName);
			formData.append("nationalID", data.nationalID);

			// Ensure dateOfBirth is a string
			const dateOfBirth = String(data.dateOfBirth);
			formData.append("dateOfBirth", dateOfBirth);

			formData.append("email", data.email);
			formData.append("password", data.password);
			formData.append("phoneNumber", data.phoneNumber);
			formData.append("file", data.file);
			formData.append("team", data.team);

			// Additional validation
			if (!data.file) {
				throw new Error("No file uploaded");
			}

			const response = await apiRepo.POST(endPoints.register, formData);
			return response;
		},
		onSuccess: (data) => {
			const { token, data: userData } = data;

			// Store token in cookies
			Cookies.set("token", token, { expires: 7 }); // 7 days

			// Update auth context with the response data
			setAuthData(token, userData);

			toastService.success("Account created successfully! Welcome aboard.");

			// Redirect to dashboard or home page
			navigate("/dashboard");
		},
		onError: (error: any) => {
			const errorMessage =
				error?.response?.data?.message || "Signup failed. Please try again.";
			toastService.error(errorMessage);
		},
	});

	const handlePhase1Submit = (data: any) => {
		setPhase1Data(data);
		setCurrentPhase(2);
	};

	const handlePhase2Submit = (data: any) => {
		// Combine phase 1 and phase 2 data
		const completeData = {
			...phase1Data,
			...data,
		};
		signupMutation.mutate(completeData);
	};

	// Convert teams to select options format
	const teamOptions =
		teams?.map((team: Team) => ({
			value: team._id,
			label: team.name,
		})) || [];

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
								? "bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/25"
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
						{currentPhase === 1
							? "Create your account"
							: "Complete your profile"}
					</motion.h1>

					<motion.p
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4 }}
						className={`text-xs sm:text-sm transition-colors duration-300 ${
							theme === "dark" ? "text-gray-400" : "text-gray-600"
						}`}>
						{currentPhase === 1
							? "Add your personal info and profile picture"
							: "Add your contact info and select your team"}
					</motion.p>
				</div>

				{/* Phase Indicator */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.5 }}
					className='mb-6'>
					<div className='flex items-center justify-center space-x-4'>
						<div
							className={`flex items-center space-x-2 ${
								currentPhase >= 1 ? "text-blue-500" : "text-gray-400"
							}`}>
							<div
								className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
									currentPhase >= 1
										? "bg-blue-500 text-white"
										: "bg-gray-200 text-gray-500"
								}`}>
								1
							</div>
							<span className='text-sm font-medium'>Personal Info & Photo</span>
						</div>
						<div
							className={`w-8 h-1 rounded ${
								currentPhase >= 2 ? "bg-blue-500" : "bg-gray-200"
							}`}></div>
						<div
							className={`flex items-center space-x-2 ${
								currentPhase >= 2 ? "text-blue-500" : "text-gray-400"
							}`}>
							<div
								className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
									currentPhase >= 2
										? "bg-blue-500 text-white"
										: "bg-gray-200 text-gray-500"
								}`}>
								2
							</div>
							<span className='text-sm font-medium'>Contact & Team</span>
						</div>
					</div>
				</motion.div>

				{/* Signup Form */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.6 }}>
					{currentPhase === 1 ? (
						<GenericForm
							schema={signupPhase1Schema}
							onSubmit={handlePhase1Submit}
							submitButtonText='Continue to Next Step'
							className='space-y-4 sm:space-y-6'
							context={{ theme }}
						/>
					) : (
						<div className='space-y-4'>
							{/* Back Button */}
							<motion.button
								type='button'
								onClick={() => setCurrentPhase(1)}
								className={`flex items-center space-x-2 text-sm font-medium transition-colors duration-300 ${
									theme === "dark"
										? "text-gray-400 hover:text-gray-300"
										: "text-gray-600 hover:text-gray-700"
								}`}>
								<svg
									className='w-4 h-4'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M15 19l-7-7 7-7'
									/>
								</svg>
								<span>Back to Personal Info</span>
							</motion.button>

							{teamsError && (
								<motion.div
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									className='p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm'>
									Failed to load teams. Please refresh the page and try again.
								</motion.div>
							)}

							{!teamsLoading && !teamsError && teams.length === 0 && (
								<motion.div
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									className='p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-600 text-sm'>
									No teams available. Please contact an administrator to create
									teams.
								</motion.div>
							)}

							<GenericForm
								schema={signupPhase2Schema}
								onSubmit={handlePhase2Submit}
								submitButtonText={
									signupMutation.isPending
										? "Creating account..."
										: "Create account"
								}
								className='space-y-4 sm:space-y-6'
								selectOptions={{
									team: teamsLoading ? [] : teamOptions,
								}}
								context={{ theme, teamsLoading }}
							/>
						</div>
					)}
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
						Already have an account?{" "}
						<Link
							to='/login'
							className={`font-medium hover:underline transition-colors duration-300 ${
								theme === "dark"
									? "text-green-400 hover:text-green-300"
									: "text-green-600 hover:text-green-700"
							}`}>
							Sign in
						</Link>
					</p>
				</motion.div>
			</motion.div>
		</div>
	);
};

export default Signup;
