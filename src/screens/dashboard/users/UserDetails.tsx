/** @format */

import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
	ArrowLeft,
	User,
	Mail,
	Phone,
	CreditCard,
	Calendar,
	Shield,
	CheckCircle,
	XCircle,
	Clock,
	Edit,
	Trash2,
	FileText,
	Activity,
	Award,
	Download,
	Trophy,
} from "lucide-react";
import { useTheme } from "../../../shared/contexts/ThemeContext";
import {
	useUserWithFallback,
	getUserDisplayName,
	isUserVerified,
} from "../../../shared/services/userService";
import { useUserAchievements } from "../../../shared/services/achievementService";
import PermissionGate from "../../../shared/Secure/PermissionGate";
import Permissions from "../../../shared/config/Permissions";
import usePermission from "../../../shared/hooks/usePermission";
import Modal from "../../../shared/components/Modal";
import CertificateForm from "../../../shared/components/CertificateForm";

const UserDetails: React.FC = () => {
	const { userId } = useParams<{ userId: string }>();
	const navigate = useNavigate();
	const { theme } = useTheme();
	const { hasPermission } = usePermission();

	// Check if user has permission to view user details
	const canViewUserDetails =
		hasPermission(Permissions.ViewPerson) ||
		hasPermission(Permissions.ViewTeamMembers);

	// Certificate modal state
	const [showCertificateModal, setShowCertificateModal] = useState(false);

	const handleAddCertificate = () => {
		setShowCertificateModal(true);
	};

	const handleCertificateSubmit = (data: any) => {
		setShowCertificateModal(false);
	};

	const handleCloseCertificateModal = () => {
		setShowCertificateModal(false);
	};

	// React Query hook to fetch user data
	const {
		data: user,
		isLoading,
		error,
	} = useUserWithFallback(userId || "", canViewUserDetails);

	// Fetch user achievements
	const { data: achievements = [] } = useUserAchievements(
		userId || "",
		undefined,
		!!userId && canViewUserDetails
	);

	// If user doesn't have permission, show access denied
	if (!canViewUserDetails) {
		return (
			<div className='flex items-center justify-center h-64'>
				<div className='text-center'>
					<div className='text-red-500 mb-2'>Access Denied</div>
					<div className='text-sm text-gray-500'>
						You don't have permission to view user details.
					</div>
					<div className='text-xs text-gray-400 mt-2'>
						Required permission: {Permissions.ViewPerson} or{" "}
						{Permissions.ViewTeamMembers}
					</div>
				</div>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className='flex items-center justify-center h-64'>
				<div className='text-lg'>Loading user details...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='flex items-center justify-center h-64'>
				<div className='text-center'>
					<div className='text-red-500 mb-2'>
						Error loading user details:{" "}
						{(error as { message?: string })?.message || "Unknown error"}
					</div>
					<div className='text-sm text-gray-500'>
						{(error as { response?: { status?: number } })?.response?.status ===
						404
							? "User not found"
							: "Please try again later."}
					</div>
				</div>
			</div>
		);
	}

	if (!user) {
		return (
			<div className='flex items-center justify-center h-64'>
				<div className='text-center'>
					<div className='text-gray-500 mb-2'>User not found</div>
					<div className='text-sm text-gray-400'>
						The requested user could not be found.
					</div>
				</div>
			</div>
		);
	}

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const formatDateTime = (dateString: string) => {
		return new Date(dateString).toLocaleString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	return (
		<div className='space-y-6'>
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className='flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0'>
				<div className='flex items-center space-x-4'>
					<button
						onClick={() => navigate(-1)}
						className={`p-2 rounded-lg transition-colors duration-300 ${
							theme === "dark"
								? "hover:bg-gray-800 text-gray-400 hover:text-white"
								: "hover:bg-gray-100 text-gray-600 hover:text-black"
						}`}>
						<ArrowLeft size={20} />
					</button>
					<div>
						<h1
							className={`text-2xl sm:text-3xl font-bold transition-colors duration-300 ${
								theme === "dark" ? "text-white" : "text-black"
							}`}>
							User Details
						</h1>
						<p
							className={`mt-1 text-base transition-colors duration-300 ${
								theme === "dark" ? "text-gray-400" : "text-gray-600"
							}`}>
							{getUserDisplayName(user)}
						</p>
					</div>
				</div>

				<div className='flex items-center space-x-2'>
					{/* Status Badge */}
					<div
						className={`px-3 py-1 rounded-full text-xs font-medium ${
							isUserVerified(user)
								? theme === "dark"
									? "bg-green-900/30 text-green-400"
									: "bg-green-100 text-green-800"
								: theme === "dark"
								? "bg-red-900/30 text-red-400"
								: "bg-red-100 text-red-800"
						}`}>
						{isUserVerified(user) ? "Verified" : "Unverified"}
					</div>

					{/* Active Status Badge */}
					<div
						className={`px-3 py-1 rounded-full text-xs font-medium ${
							user.isActive
								? theme === "dark"
									? "bg-blue-900/30 text-blue-400"
									: "bg-blue-100 text-blue-800"
								: theme === "dark"
								? "bg-gray-900/30 text-gray-400"
								: "bg-gray-100 text-gray-800"
						}`}>
						{user.isActive ? "Active" : "Inactive"}
					</div>
				</div>
			</motion.div>

			{/* Main Content Grid */}
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				{/* Profile Section */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.1 }}
					className='lg:col-span-1'>
					<div
						className={`p-6 rounded-2xl backdrop-blur-xl ${
							theme === "dark"
								? "bg-gray-900/60 border border-gray-800/50 shadow-xl"
								: "bg-white/60 backdrop-blur-xl border border-gray-200/50 shadow-xl"
						}`}>
						{/* Profile Picture */}
						<div className='flex flex-col items-center space-y-4 mb-6'>
							<div className='relative'>
								<img
									src={
										user.profilePicture ||
										"https://via.placeholder.com/120x120?text=No+Image"
									}
									alt={`${user.firstName} ${user.lastName}`}
									className='w-24 h-24 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700'
								/>
								{user.isVerified && (
									<div className='absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1'>
										<CheckCircle size={16} className='text-white' />
									</div>
								)}
							</div>
							<div className='text-center'>
								<h2
									className={`text-xl font-semibold transition-colors duration-300 ${
										theme === "dark" ? "text-white" : "text-black"
									}`}>
									{user.firstName} {user.lastName}
								</h2>
								<p
									className={`text-sm transition-colors duration-300 ${
										theme === "dark" ? "text-gray-400" : "text-gray-600"
									}`}>
									{typeof user.role === "object" && user.role?.key
										? user.role.key
										: typeof user.role === "string"
										? user.role
										: "No Role Assigned"}
								</p>
							</div>
						</div>

						{/* Quick Actions */}
						<div className='space-y-2'>
							<PermissionGate permission={Permissions.AssignAchievement}>
								<button
									onClick={handleAddCertificate}
									className={`w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg transition-colors duration-300 ${
										theme === "dark"
											? "bg-green-900/30 text-green-400 hover:bg-green-800/30"
											: "bg-green-50 text-green-600 hover:bg-green-100"
									}`}>
									<Award size={16} />
									<span className='text-sm font-medium'>Add Certificate</span>
								</button>
							</PermissionGate>

							<PermissionGate permission={Permissions.ApprovePerson}>
								<button
									className={`w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg transition-colors duration-300 ${
										theme === "dark"
											? "bg-blue-900/30 text-blue-400 hover:bg-blue-800/30"
											: "bg-blue-50 text-blue-600 hover:bg-blue-100"
									}`}>
									<Edit size={16} />
									<span className='text-sm font-medium'>Edit User</span>
								</button>
							</PermissionGate>

							<PermissionGate permission={Permissions.RejectPerson}>
								<button
									className={`w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg transition-colors duration-300 ${
										theme === "dark"
											? "bg-red-900/30 text-red-400 hover:bg-red-800/30"
											: "bg-red-50 text-red-600 hover:bg-red-100"
									}`}>
									<Trash2 size={16} />
									<span className='text-sm font-medium'>Delete User</span>
								</button>
							</PermissionGate>
						</div>
					</div>
				</motion.div>

				{/* Details Section */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className='lg:col-span-2 space-y-6'>
					{/* Personal Information */}
					<div
						className={`p-6 rounded-2xl backdrop-blur-xl ${
							theme === "dark"
								? "bg-gray-900/60 border border-gray-800/50 shadow-xl"
								: "bg-white/60 backdrop-blur-xl border border-gray-200/50 shadow-xl"
						}`}>
						<h3
							className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
								theme === "dark" ? "text-white" : "text-black"
							}`}>
							Personal Information
						</h3>

						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<div className='flex items-center space-x-3'>
								<User
									className={`w-5 h-5 ${
										theme === "dark" ? "text-gray-400" : "text-gray-500"
									}`}
								/>
								<div>
									<p
										className={`text-xs font-medium transition-colors duration-300 ${
											theme === "dark" ? "text-gray-400" : "text-gray-500"
										}`}>
										Full Name
									</p>
									<p
										className={`font-medium transition-colors duration-300 ${
											theme === "dark" ? "text-white" : "text-black"
										}`}>
										{user.firstName} {user.lastName}
									</p>
								</div>
							</div>

							<div className='flex items-center space-x-3'>
								<Mail
									className={`w-5 h-5 ${
										theme === "dark" ? "text-gray-400" : "text-gray-500"
									}`}
								/>
								<div>
									<p
										className={`text-xs font-medium transition-colors duration-300 ${
											theme === "dark" ? "text-gray-400" : "text-gray-500"
										}`}>
										Email Address
									</p>
									<p
										className={`font-medium transition-colors duration-300 ${
											theme === "dark" ? "text-white" : "text-black"
										}`}>
										{user.email}
									</p>
								</div>
							</div>

							<div className='flex items-center space-x-3'>
								<Phone
									className={`w-5 h-5 ${
										theme === "dark" ? "text-gray-400" : "text-gray-500"
									}`}
								/>
								<div>
									<p
										className={`text-xs font-medium transition-colors duration-300 ${
											theme === "dark" ? "text-gray-400" : "text-gray-500"
										}`}>
										Phone Number
									</p>
									<p
										className={`font-medium transition-colors duration-300 ${
											theme === "dark" ? "text-white" : "text-black"
										}`}>
										{user.phoneNumber}
									</p>
								</div>
							</div>

							<div className='flex items-center space-x-3'>
								<CreditCard
									className={`w-5 h-5 ${
										theme === "dark" ? "text-gray-400" : "text-gray-500"
									}`}
								/>
								<div>
									<p
										className={`text-xs font-medium transition-colors duration-300 ${
											theme === "dark" ? "text-gray-400" : "text-gray-500"
										}`}>
										National ID
									</p>
									<p
										className={`font-medium transition-colors duration-300 ${
											theme === "dark" ? "text-white" : "text-black"
										}`}>
										{user.nationalID}
									</p>
								</div>
							</div>

							<div className='flex items-center space-x-3'>
								<Calendar
									className={`w-5 h-5 ${
										theme === "dark" ? "text-gray-400" : "text-gray-500"
									}`}
								/>
								<div>
									<p
										className={`text-xs font-medium transition-colors duration-300 ${
											theme === "dark" ? "text-gray-400" : "text-gray-500"
										}`}>
										Date of Birth
									</p>
									<p
										className={`font-medium transition-colors duration-300 ${
											theme === "dark" ? "text-white" : "text-black"
										}`}>
										{formatDate(user.dateOfBirth)}
									</p>
								</div>
							</div>

							<div className='flex items-center space-x-3'>
								<Shield
									className={`w-5 h-5 ${
										theme === "dark" ? "text-gray-400" : "text-gray-500"
									}`}
								/>
								<div>
									<p
										className={`text-xs font-medium transition-colors duration-300 ${
											theme === "dark" ? "text-gray-400" : "text-gray-500"
										}`}>
										Role
									</p>
									<p
										className={`font-medium transition-colors duration-300 ${
											theme === "dark" ? "text-white" : "text-black"
										}`}>
										{typeof user.role === "object" && user.role?.key
											? user.role.key
											: typeof user.role === "string"
											? user.role
											: "No Role Assigned"}
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Account Information */}
					<div
						className={`p-6 rounded-2xl backdrop-blur-xl ${
							theme === "dark"
								? "bg-gray-900/60 border border-gray-800/50 shadow-xl"
								: "bg-white/60 backdrop-blur-xl border border-gray-200/50 shadow-xl"
						}`}>
						<h3
							className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
								theme === "dark" ? "text-white" : "text-black"
							}`}>
							Account Information
						</h3>

						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<div className='flex items-center space-x-3'>
								<Activity
									className={`w-5 h-5 ${
										theme === "dark" ? "text-gray-400" : "text-gray-500"
									}`}
								/>
								<div>
									<p
										className={`text-xs font-medium transition-colors duration-300 ${
											theme === "dark" ? "text-gray-400" : "text-gray-500"
										}`}>
										Account Status
									</p>
									<div className='flex items-center space-x-2'>
										{user.isActive ? (
											<CheckCircle className='w-4 h-4 text-green-500' />
										) : (
											<XCircle className='w-4 h-4 text-red-500' />
										)}
										<p
											className={`font-medium transition-colors duration-300 ${
												theme === "dark" ? "text-white" : "text-black"
											}`}>
											{user.isActive ? "Active" : "Inactive"}
										</p>
									</div>
								</div>
							</div>

							<div className='flex items-center space-x-3'>
								{user.isVerified ? (
									<CheckCircle className={`w-5 h-5 text-green-500`} />
								) : (
									<XCircle className={`w-5 h-5 text-red-500`} />
								)}
								<div>
									<p
										className={`text-xs font-medium transition-colors duration-300 ${
											theme === "dark" ? "text-gray-400" : "text-gray-500"
										}`}>
										Verification Status
									</p>
									<p
										className={`font-medium transition-colors duration-300 ${
											theme === "dark" ? "text-white" : "text-black"
										}`}>
										{user.isVerified ? "Verified" : "Unverified"}
									</p>
								</div>
							</div>

							<div className='flex items-center space-x-3'>
								<FileText
									className={`w-5 h-5 ${
										theme === "dark" ? "text-gray-400" : "text-gray-500"
									}`}
								/>
								<div>
									<p
										className={`text-xs font-medium transition-colors duration-300 ${
											theme === "dark" ? "text-gray-400" : "text-gray-500"
										}`}>
										Authentication Type
									</p>
									<p
										className={`font-medium transition-colors duration-300 ${
											theme === "dark" ? "text-white" : "text-black"
										}`}>
										{user.authType || "Local"}
									</p>
								</div>
							</div>

							<div className='flex items-center space-x-3'>
								<Clock
									className={`w-5 h-5 ${
										theme === "dark" ? "text-gray-400" : "text-gray-500"
									}`}
								/>
								<div>
									<p
										className={`text-xs font-medium transition-colors duration-300 ${
											theme === "dark" ? "text-gray-400" : "text-gray-500"
										}`}>
										Member Since
									</p>
									<p
										className={`font-medium transition-colors duration-300 ${
											theme === "dark" ? "text-white" : "text-black"
										}`}>
										{formatDate(user.createdAt)}
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Timestamps */}
					<div
						className={`p-6 rounded-2xl backdrop-blur-xl ${
							theme === "dark"
								? "bg-gray-900/60 border border-gray-800/50 shadow-xl"
								: "bg-white/60 backdrop-blur-xl border border-gray-200/50 shadow-xl"
						}`}>
						<h3
							className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
								theme === "dark" ? "text-white" : "text-black"
							}`}>
							Account Timestamps
						</h3>

						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<div>
								<p
									className={`text-xs font-medium transition-colors duration-300 ${
										theme === "dark" ? "text-gray-400" : "text-gray-500"
									}`}>
									Created At
								</p>
								<p
									className={`text-sm transition-colors duration-300 ${
										theme === "dark" ? "text-gray-300" : "text-gray-700"
									}`}>
									{formatDateTime(user.createdAt)}
								</p>
							</div>

							<div>
								<p
									className={`text-xs font-medium transition-colors duration-300 ${
										theme === "dark" ? "text-gray-400" : "text-gray-500"
									}`}>
									Last Updated
								</p>
								<p
									className={`text-sm transition-colors duration-300 ${
										theme === "dark" ? "text-gray-300" : "text-gray-700"
									}`}>
									{formatDateTime(user.updatedAt)}
								</p>
							</div>
						</div>
					</div>
				</motion.div>

				{/* Achievements Section */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.3 }}
					className='lg:col-span-2 space-y-6'>
					<div
						className={`p-6 rounded-2xl backdrop-blur-xl ${
							theme === "dark"
								? "bg-gray-900/60 border border-gray-800/50 shadow-xl"
								: "bg-white/60 backdrop-blur-xl border border-gray-200/50 shadow-xl"
						}`}>
						<div className='flex items-center justify-between mb-4'>
							<h3
								className={`text-lg font-semibold transition-colors duration-300 ${
									theme === "dark" ? "text-white" : "text-black"
								}`}>
								Achievements & Certificates
							</h3>
							<div className='flex items-center space-x-2'>
								<Award
									className={`w-5 h-5 ${
										theme === "dark" ? "text-yellow-400" : "text-yellow-600"
									}`}
								/>
								<span
									className={`text-sm font-medium transition-colors duration-300 ${
										theme === "dark" ? "text-gray-300" : "text-gray-700"
									}`}>
									{achievements.length}{" "}
									{achievements.length === 1 ? "Achievement" : "Achievements"}
								</span>
							</div>
						</div>

						{achievements.length === 0 ? (
							<div className='text-center py-8'>
								<Award
									className={`mx-auto h-12 w-12 ${
										theme === "dark" ? "text-gray-600" : "text-gray-400"
									}`}
								/>
								<p
									className={`mt-2 text-sm transition-colors duration-300 ${
										theme === "dark" ? "text-gray-400" : "text-gray-500"
									}`}>
									No achievements or certificates yet
								</p>
							</div>
						) : (
							<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
								{achievements.map((achievement) => (
									<motion.div
										key={achievement._id}
										initial={{ opacity: 0, scale: 0.9 }}
										animate={{ opacity: 1, scale: 1 }}
										transition={{ duration: 0.3 }}
										className={`p-4 rounded-xl border transition-all duration-300 ${
											theme === "dark"
												? "bg-gray-800/40 border-gray-700/50 hover:bg-gray-800/60"
												: "bg-gray-50/60 border-gray-200/50 hover:bg-gray-100/60"
										}`}>
										<div className='flex items-start justify-between mb-3'>
											<div className='flex items-center space-x-2'>
												<div className='w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-yellow-400 to-orange-500 border border-white shadow-sm'>
													<Trophy className='w-4 h-4 text-white' />
												</div>
												<div>
													<h4
														className={`font-medium text-sm transition-colors duration-300 ${
															theme === "dark" ? "text-white" : "text-black"
														}`}>
														{achievement.title}
													</h4>
													<p
														className={`text-xs transition-colors duration-300 ${
															theme === "dark"
																? "text-gray-400"
																: "text-gray-600"
														}`}>
														{achievement.achievementType}
													</p>
												</div>
											</div>
											{achievement.isVerified && (
												<Shield
													className={`w-4 h-4 ${
														theme === "dark"
															? "text-green-400"
															: "text-green-600"
													}`}
												/>
											)}
										</div>

										<p
											className={`text-xs mb-3 transition-colors duration-300 ${
												theme === "dark" ? "text-gray-300" : "text-gray-700"
											}`}>
											{achievement.description}
										</p>

										<div className='flex items-center justify-between text-xs'>
											<span
												className={`transition-colors duration-300 ${
													theme === "dark" ? "text-gray-400" : "text-gray-500"
												}`}>
												{new Date(achievement.dateAwarded).toLocaleDateString()}
											</span>

											{achievement.certificateFile && (
												<button
													onClick={() => {
														// Handle certificate download/view
														if (achievement.certificateFile?.fileUrl) {
															window.open(
																achievement.certificateFile.fileUrl,
																"_blank"
															);
														}
													}}
													className={`flex items-center space-x-1 px-2 py-1 rounded-md transition-colors duration-300 ${
														theme === "dark"
															? "bg-blue-600/20 text-blue-400 hover:bg-blue-500/30"
															: "bg-blue-100 text-blue-600 hover:bg-blue-200"
													}`}
													title='View Certificate'>
													<Download className='w-3 h-3' />
													<span>View</span>
												</button>
											)}
										</div>
									</motion.div>
								))}
							</div>
						)}
					</div>
				</motion.div>
			</div>

			{/* Certificate Modal */}
			{showCertificateModal && user && (
				<Modal
					isOpen={showCertificateModal}
					onClose={handleCloseCertificateModal}
					title={`Add Certificate for ${user.firstName} ${user.lastName}`}>
					<CertificateForm
						userId={user._id}
						userName={`${user.firstName} ${user.lastName}`}
						onSubmit={handleCertificateSubmit}
						onCancel={handleCloseCertificateModal}
					/>
				</Modal>
			)}
		</div>
	);
};

export default UserDetails;
