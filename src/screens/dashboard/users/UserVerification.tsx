/** @format */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
	CheckCircle,
	XCircle,
	UserCheck,
	UserX,
	Calendar,
	Phone,
	CreditCard,
	Eye,
	User,
} from "lucide-react";
import { useTheme } from "../../../shared/contexts/ThemeContext";
import {
	useUnverifiedUsers,
	useRoles,
	useVerifyUserWithRole,
} from "../../../shared/services/userService";
import { User as UserType } from "../../../shared/types/User";
import PermissionGate from "../../../shared/Secure/PermissionGate";
import Permissions from "../../../shared/config/Permissions";
import usePermission from "../../../shared/hooks/usePermission";
import { useAuth } from "../../../shared/contexts/AuthContext";

const UserVerification: React.FC = () => {
	const navigate = useNavigate();
	const { theme } = useTheme();
	const { hasPermission } = usePermission();
	const { user: currentUser } = useAuth();
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
	const [showVerifyModal, setShowVerifyModal] = useState(false);
	const [selectedRoleId, setSelectedRoleId] = useState("");

	// Check if user has role-based access to view unverified users
	const userRole = currentUser?.role?.key;
	const canViewUnverifiedUsers =
		userRole === "President" || userRole === "Head" || userRole === "ViceHead";

	// React Query hooks - only fetch if user has permission
	const {
		data: users,
		isLoading,
		error,
	} = useUnverifiedUsers(canViewUnverifiedUsers);
	const {
		data: roles,
		isLoading: rolesLoading,
		error: rolesError,
	} = useRoles();
	const verifyUserWithRoleMutation = useVerifyUserWithRole();

	// Debug logging for troubleshooting
	console.log("Roles data:", roles);
	console.log("Roles loading:", rolesLoading);
	console.log("Roles error:", rolesError);
	console.log("Unverified users data:", users);
	console.log("Users array type:", Array.isArray(users));
	console.log("Users length:", users?.length);
	if (Array.isArray(users) && users.length > 0) {
		console.log("First user sample:", users[0]);
		console.log(
			"Users verification status:",
			users.map((u) => ({
				id: u._id,
				email: u.email,
				isVerified: u.isVerified,
				authType: u.authType,
			}))
		);
	}

	// If user doesn't have permission, show access denied
	if (!canViewUnverifiedUsers) {
		return (
			<div className='flex items-center justify-center h-64'>
				<div className='text-center'>
					<div className='text-red-500 mb-2'>Access Denied</div>
					<div className='text-sm text-gray-500'>
						You don't have permission to view unverified users.
					</div>
					<div className='text-xs text-gray-400 mt-2'>
						Required role: President, Head, or Vice Head
					</div>
				</div>
			</div>
		);
	}

	// Filter users based on search term and team (if applicable)
	const filteredUsers = Array.isArray(users)
		? users.filter((user) => {
				// First apply search filter
				const matchesSearch =
					user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
					user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
					user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
					user.nationalID.includes(searchTerm);

				// If President, show all users
				if (userRole === "President") {
					return matchesSearch;
				}

				// If Head or Vice Head, only show users from their team
				// Note: This assumes users have team information
				// You may need to modify the API or user type to include team data
				if (userRole === "Head" || userRole === "ViceHead") {
					// For now, we'll show all users but you can implement team filtering here
					// when the team information is available in the user data
					return matchesSearch;
				}

				return false;
		  })
		: [];

	const handleVerifyUserWithRole = async () => {
		if (!selectedUser || !selectedRoleId) return;

		try {
			await verifyUserWithRoleMutation.mutateAsync({
				userId: selectedUser._id,
				data: {
					isVerified: true,
					role: selectedRoleId,
				},
			});
			setShowVerifyModal(false);
			setSelectedUser(null);
			setSelectedRoleId("");
		} catch {
			// Error is handled by the mutation
		}
	};

	const openVerifyModal = (user: UserType) => {
		setSelectedUser(user);
		setShowVerifyModal(true);
		setSelectedRoleId("");
	};

	const viewUserDetails = (userId: string) => {
		navigate(`/dashboard/users/${userId}`);
	};

	if (isLoading) {
		return (
			<div className='flex items-center justify-center h-64'>
				<div className='text-lg'>Loading unverified users...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='flex items-center justify-center h-64'>
				<div className='text-center'>
					<div className='text-red-500 mb-2'>
						Error loading users:{" "}
						{(error as { message?: string })?.message || "Unknown error"}
					</div>
					<div className='text-sm text-gray-500'>
						{(error as { response?: { status?: number } })?.response?.status ===
						403
							? "You don't have permission to view unverified users. Please contact your administrator."
							: "Please try again later."}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className='space-y-4'>
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className='flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0'>
				<div>
					<h1
						className={`text-2xl sm:text-3xl font-bold transition-colors duration-300 ${
							theme === "dark" ? "text-white" : "text-black"
						}`}>
						User Verification
					</h1>
					<p
						className={`mt-2 text-base sm:text-lg transition-colors duration-300 ${
							theme === "dark" ? "text-gray-400" : "text-gray-600"
						}`}>
						Review and verify pending user registrations
					</p>
					{/* Access Level Information */}
					<div
						className={`mt-2 text-sm transition-colors duration-300 ${
							theme === "dark" ? "text-gray-500" : "text-gray-500"
						}`}>
						<span className='font-medium'>Access Level:</span>{" "}
						{userRole === "President" ? (
							<span className='text-green-600 dark:text-green-400'>
								All Users
							</span>
						) : userRole === "Head" || userRole === "ViceHead" ? (
							<span className='text-blue-600 dark:text-blue-400'>
								Team Members Only
							</span>
						) : (
							<span className='text-red-600 dark:text-red-400'>No Access</span>
						)}
					</div>
				</div>

				<div className='flex items-center space-x-2'>
					<div
						className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
							theme === "dark"
								? "bg-yellow-900/30 text-yellow-400"
								: "bg-yellow-100 text-yellow-800"
						}`}>
						{filteredUsers.length} Pending
					</div>
					{rolesLoading && (
						<div
							className={`px-2 py-1 rounded-full text-xs font-medium ${
								theme === "dark"
									? "bg-blue-900/30 text-blue-400"
									: "bg-blue-100 text-blue-800"
							}`}>
							Loading Roles...
						</div>
					)}
					{rolesError && (
						<div
							className={`px-2 py-1 rounded-full text-xs font-medium ${
								theme === "dark"
									? "bg-red-900/30 text-red-400"
									: "bg-red-100 text-red-800"
							}`}>
							Roles Error
						</div>
					)}
				</div>
			</motion.div>

			{/* Search Bar */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.1 }}
				className={`relative ${
					theme === "dark" ? "text-white" : "text-black"
				}`}>
				<Eye
					className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
					size={18}
				/>
				<input
					type='text'
					placeholder='Search users by name, email, or ID...'
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className={`w-full pl-9 pr-4 py-2 rounded-lg border transition-colors duration-300 text-sm ${
						theme === "dark"
							? "bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
							: "bg-white border-gray-300 text-black placeholder-gray-500 focus:border-blue-500"
					}`}
				/>
			</motion.div>

			{/* Users Grid */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.2 }}
				className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3'>
				{filteredUsers.map((user, index) => (
					<motion.div
						key={user._id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.1 * index }}
						className={`p-4 rounded-xl transition-all duration-300 hover:shadow-lg ${
							theme === "dark"
								? "bg-gray-900/60 backdrop-blur-xl border-gray-800/50 shadow-xl"
								: "bg-white/60 backdrop-blur-xl border-gray-200/50 shadow-xl"
						}`}>
						<div className='flex items-start justify-between mb-3 sm:mb-4'>
							<div className='flex items-center space-x-2 min-w-0 flex-1'>
								<div
									className={`p-1 rounded-lg flex-shrink-0 ${
										theme === "dark" ? "bg-yellow-600/20" : "bg-yellow-100"
									}`}>
									<UserX
										className={`w-5 h-5 ${
											theme === "dark" ? "text-yellow-400" : "text-yellow-600"
										}`}
									/>
								</div>
								<div className='min-w-0 flex-1'>
									<h3
										className={`font-semibold text-sm transition-colors duration-300 truncate ${
											theme === "dark" ? "text-white" : "text-black"
										}`}>
										{user.firstName} {user.lastName}
									</h3>
									<p
										className={`text-xs transition-colors duration-300 truncate ${
											theme === "dark" ? "text-gray-400" : "text-gray-600"
										}`}>
										{user.email}
									</p>
								</div>
							</div>

							<div className='flex items-center space-x-1 flex-shrink-0 ml-2'>
								{(hasPermission(Permissions.ViewPerson) ||
									hasPermission(Permissions.ViewTeamMembers)) && (
									<button
										onClick={() => viewUserDetails(user._id)}
										className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
											theme === "dark"
												? "hover:bg-gray-800 text-gray-400 hover:text-white"
												: "hover:bg-gray-100 text-gray-600 hover:text-black"
										}`}
										title='View User Details'>
										<Eye size={16} />
									</button>
								)}
								<PermissionGate permission={Permissions.ApprovePerson}>
									<button
										onClick={() => openVerifyModal(user)}
										className={`p-1 rounded-lg transition-colors duration-300 ${
											theme === "dark"
												? "hover:bg-green-900/30 text-green-400 hover:text-green-300"
												: "hover:bg-green-50 text-green-600 hover:text-green-700"
										}`}>
										<CheckCircle size={14} />
									</button>
								</PermissionGate>
								<PermissionGate permission={Permissions.RejectPerson}>
									<button
										className={`p-1 rounded-lg transition-colors duration-300 ${
											theme === "dark"
												? "hover:bg-red-900/30 text-red-400 hover:text-red-300"
												: "hover:bg-red-50 text-red-600 hover:text-red-700"
										}`}>
										<XCircle size={14} />
									</button>
								</PermissionGate>
							</div>
						</div>

						<div className='space-y-1.5 mb-3 sm:mb-4'>
							<div className='flex items-center space-x-2 text-xs'>
								<CreditCard size={12} className='text-gray-400 flex-shrink-0' />
								<span
									className={`transition-colors duration-300 truncate ${
										theme === "dark" ? "text-gray-300" : "text-gray-700"
									}`}>
									ID: {user.nationalID}
								</span>
							</div>
							<div className='flex items-center space-x-2 text-xs'>
								<Phone size={12} className='text-gray-400 flex-shrink-0' />
								<span
									className={`transition-colors duration-300 truncate ${
										theme === "dark" ? "text-gray-300" : "text-gray-700"
									}`}>
									{user.phoneNumber}
								</span>
							</div>
							<div className='flex items-center space-x-2 text-xs'>
								<Calendar size={12} className='text-gray-400 flex-shrink-0' />
								<span
									className={`transition-colors duration-300 truncate ${
										theme === "dark" ? "text-gray-300" : "text-gray-700"
									}`}>
									{new Date(user.dateOfBirth).toLocaleDateString()}
								</span>
							</div>
						</div>

						<div className='flex items-center justify-between text-xs'>
							<div
								className={`flex items-center space-x-1 transition-colors duration-300 ${
									theme === "dark" ? "text-gray-400" : "text-gray-500"
								}`}>
								<Calendar size={12} />
								<span className='truncate'>
									Registered {new Date(user.createdAt).toLocaleDateString()}
								</span>
							</div>
							<div
								className={`px-1.5 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${
									theme === "dark"
										? "bg-red-900/30 text-red-400"
										: "bg-red-100 text-red-800"
								}`}>
								Unverified
							</div>
						</div>
					</motion.div>
				))}
			</motion.div>

			{/* Empty State */}
			{filteredUsers.length === 0 && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className='text-center py-12'>
					<UserCheck
						className={`w-16 h-16 mx-auto mb-4 ${
							theme === "dark" ? "text-gray-600" : "text-gray-400"
						}`}
					/>
					<h3
						className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
							theme === "dark" ? "text-white" : "text-black"
						}`}>
						No unverified users found
					</h3>
					<p
						className={`transition-colors duration-300 ${
							theme === "dark" ? "text-gray-400" : "text-gray-600"
						}`}>
						{searchTerm
							? "Try adjusting your search terms"
							: "All users have been verified"}
					</p>
				</motion.div>
			)}

			{/* Combined Verify User Modal */}
			{showVerifyModal && selectedUser && (
				<div className='fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4 sm:p-6'>
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						className={`w-full max-w-lg p-6 sm:p-8 rounded-2xl backdrop-blur-xl ${
							theme === "dark"
								? "bg-slate-900/80 border border-slate-700/50 shadow-2xl"
								: "bg-white/90 border border-slate-200/50 shadow-2xl"
						}`}>
						<h2
							className={`text-xl sm:text-2xl font-semibold mb-4 transition-colors duration-300 ${
								theme === "dark" ? "text-slate-200" : "text-slate-800"
							}`}>
							Verify User & Assign Role
						</h2>
						<p
							className={`text-sm sm:text-base mb-6 transition-colors duration-300 ${
								theme === "dark" ? "text-slate-400" : "text-slate-600"
							}`}>
							Verify {selectedUser.firstName} {selectedUser.lastName} (
							{selectedUser.email}) and assign a role
						</p>

						<div className='space-y-6'>
							{/* Role Selection */}
							<div className='space-y-3'>
								<label
									className={`block text-sm font-medium tracking-wide transition-colors duration-300 ${
										theme === "dark" ? "text-slate-200" : "text-slate-700"
									}`}>
									Select Role *
								</label>
								{rolesLoading ? (
									<div
										className={`w-full px-4 py-3 border border-slate-200 rounded-2xl transition-all duration-300 text-sm font-medium backdrop-blur-sm ${
											theme === "dark"
												? "bg-slate-900/50 text-slate-400 border-slate-700"
												: "bg-white/80 text-slate-500 border-slate-200"
										}`}>
										Loading roles...
									</div>
								) : rolesError ? (
									<div
										className={`w-full px-4 py-3 border border-red-400 rounded-2xl transition-all duration-300 text-sm font-medium backdrop-blur-sm ${
											theme === "dark"
												? "bg-slate-900/50 text-red-400 border-red-400"
												: "bg-red-50/80 text-red-600 border-red-400"
										}`}>
										Error loading roles
									</div>
								) : (
									<div className='relative'>
										<select
											value={selectedRoleId}
											onChange={(e) => setSelectedRoleId(e.target.value)}
											className={`w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 appearance-none text-sm font-medium backdrop-blur-sm ${
												theme === "dark"
													? "bg-slate-900/50 text-slate-100 border-slate-700 hover:border-slate-600 focus:ring-blue-400/20"
													: "bg-white/80 text-slate-900 border-slate-200 hover:border-slate-300 focus:ring-blue-500/20"
											}`}>
											<option value=''>Select a role...</option>
											{Array.isArray(roles) && roles.length > 0 ? (
												roles.map((role) => (
													<option key={role._id} value={role._id}>
														{role.key}
													</option>
												))
											) : (
												<option value='' disabled>
													No roles available
												</option>
											)}
										</select>
										<div
											className={`absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none ${
												theme === "dark" ? "text-slate-400" : "text-slate-500"
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
													d='M19 9l-7 7-7-7'
												/>
											</svg>
										</div>
									</div>
								)}
							</div>

							{/* Verify Button */}
							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								onClick={handleVerifyUserWithRole}
								disabled={
									verifyUserWithRoleMutation.isPending || !selectedRoleId
								}
								className={`w-full font-semibold py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm backdrop-blur-sm ${
									verifyUserWithRoleMutation.isPending || !selectedRoleId
										? "bg-slate-400 cursor-not-allowed"
										: theme === "dark"
										? "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 active:from-green-800 active:to-emerald-800"
										: "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 active:from-green-700 active:to-emerald-700"
								} ${
									verifyUserWithRoleMutation.isPending ? "animate-pulse" : ""
								}`}>
								{verifyUserWithRoleMutation.isPending ? (
									<div className='flex items-center justify-center space-x-2'>
										<svg
											className='animate-spin h-5 w-5'
											xmlns='http://www.w3.org/2000/svg'
											fill='none'
											viewBox='0 0 24 24'>
											<circle
												className='opacity-25'
												cx='12'
												cy='12'
												r='10'
												stroke='currentColor'
												strokeWidth='4'></circle>
											<path
												className='opacity-75'
												fill='currentColor'
												d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
										</svg>
										<span>Verifying...</span>
									</div>
								) : (
									"Verify & Assign Role"
								)}
							</motion.button>
						</div>

						<button
							onClick={() => {
								setShowVerifyModal(false);
								setSelectedUser(null);
								setSelectedRoleId("");
							}}
							className={`mt-6 w-full py-3 px-6 rounded-2xl transition-all duration-300 text-sm font-medium backdrop-blur-sm ${
								theme === "dark"
									? "bg-slate-800/50 hover:bg-slate-700/50 text-slate-200 border border-slate-700/50"
									: "bg-slate-100/80 hover:bg-slate-200/80 text-slate-700 border border-slate-200/50"
							}`}>
							Cancel
						</button>
					</motion.div>
				</div>
			)}
		</div>
	);
};

export default UserVerification;
