/** @format */

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
	Mail,
	Phone,
	MapPin,
	Edit,
	Save,
	X,
	Loader2,
	Lock,
	Eye,
	EyeOff,
	Camera,
	Users,
	Award,
	FileText,
	Calendar,
	Trophy,
} from "lucide-react";
import { useTheme } from "../../shared/contexts/ThemeContext";
import {
	useCurrentUserProfile,
	useUpdateUserProfile,
	useChangePassword,
} from "../../shared/services/userService";
import { useUserAchievements } from "../../shared/services/achievementService";
import { toastService } from "../../shared/services/toastService";

const Profile: React.FC = () => {
	const { theme } = useTheme();
	const navigate = useNavigate();
	const [isEditing, setIsEditing] = useState(false);
	const [showPasswordForm, setShowPasswordForm] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);

	// Fetch user profile from backend
	const { data: userProfile, isLoading, error } = useCurrentUserProfile();
	const updateProfileMutation = useUpdateUserProfile();
	const changePasswordMutation = useChangePassword();

	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		phoneNumber: "",
		nationalID: "",
		dateOfBirth: "",
	});

	const [passwordData, setPasswordData] = useState({
		currentPassword: "",
		newPassword: "",
	});

	const [profilePicturePreview, setProfilePicturePreview] = useState<
		string | null
	>(null);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const fileInputRef = React.useRef<HTMLInputElement>(null);

	// Update form data when profile is loaded
	useEffect(() => {
		if (userProfile) {
			setFormData({
				firstName: userProfile.firstName || "",
				lastName: userProfile.lastName || "",
				email: userProfile.email || "",
				phoneNumber: userProfile.phoneNumber || "",
				nationalID: userProfile.nationalID || "",
				dateOfBirth: userProfile.dateOfBirth
					? userProfile.dateOfBirth.split("T")[0]
					: "",
			});
		}
	}, [userProfile]);

	const handleInputChange = (field: string, value: string) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handlePasswordInputChange = (field: string, value: string) => {
		setPasswordData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleSave = async () => {
		try {
			// Include file in the profile update if there's a new one
			const updateData = selectedFile
				? { ...formData, file: selectedFile }
				: formData;

			await updateProfileMutation.mutateAsync(updateData);

			// Reset file-related state on success
			setProfilePicturePreview(null);
			setSelectedFile(null);
			setIsEditing(false);
		} catch (error) {
			console.error("Failed to update profile:", error);
		}
	};

	const handlePasswordSubmit = async () => {
		try {
			await changePasswordMutation.mutateAsync(passwordData);
			setPasswordData({ currentPassword: "", newPassword: "" });
			setShowPasswordForm(false);
		} catch (error) {
			console.error("Failed to change password:", error);
		}
	};

	const handleCancel = () => {
		// Reset form data to original values
		if (userProfile) {
			setFormData({
				firstName: userProfile.firstName || "",
				lastName: userProfile.lastName || "",
				email: userProfile.email || "",
				phoneNumber: userProfile.phoneNumber || "",
				nationalID: userProfile.nationalID || "",
				dateOfBirth: userProfile.dateOfBirth
					? userProfile.dateOfBirth.split("T")[0]
					: "",
			});
		}
		// Reset profile picture preview
		setProfilePicturePreview(null);
		setSelectedFile(null);
		setIsEditing(false);
	};

	const handleProfilePictureClick = () => {
		if (isEditing && fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			// Validate file type
			if (!file.type.startsWith("image/")) {
				toastService.error("Please select an image file");
				return;
			}

			// Validate file size (5MB limit)
			if (file.size > 5 * 1024 * 1024) {
				toastService.error("File size must be less than 5MB");
				return;
			}

			setSelectedFile(file);

			// Create preview URL
			const reader = new FileReader();
			reader.onload = (e) => {
				setProfilePicturePreview(e.target?.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	// Loading state
	if (isLoading) {
		return (
			<div className='flex items-center justify-center min-h-[400px]'>
				<div className='flex items-center space-x-2'>
					<Loader2 className='animate-spin' size={24} />
					<span className='text-lg'>Loading profile...</span>
				</div>
			</div>
		);
	}

	// Error state
	if (error) {
		return (
			<div className='flex items-center justify-center min-h-[400px]'>
				<div className='text-center'>
					<div className='text-red-500 text-lg mb-2'>
						Failed to load profile
					</div>
					<div className='text-gray-500'>Please try again later</div>
				</div>
			</div>
		);
	}

	// If no user profile data
	if (!userProfile) {
		return (
			<div className='flex items-center justify-center min-h-[400px]'>
				<div className='text-center'>
					<div className='text-gray-500 text-lg mb-2'>
						No profile data available
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className='space-y-6 p-4 sm:p-6'>
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 ${
					theme === "dark" ? "text-white" : "text-gray-900"
				}`}>
				<div>
					<h1 className='text-2xl sm:text-3xl font-bold'>Profile</h1>
					<p
						className={`mt-2 text-sm sm:text-base ${
							theme === "dark" ? "text-gray-400" : "text-gray-600"
						}`}>
						Manage your account settings and preferences
					</p>
				</div>
				<div className='flex flex-col sm:flex-row gap-3 w-full sm:w-auto'>
					<button
						onClick={() => setShowPasswordForm(!showPasswordForm)}
						disabled={updateProfileMutation.isPending}
						className={`flex items-center justify-center px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 w-full sm:w-auto ${
							theme === "dark"
								? "bg-gray-700 text-white hover:bg-gray-600"
								: "bg-gray-200 text-gray-700 hover:bg-gray-300"
						} ${
							updateProfileMutation.isPending
								? "opacity-50 cursor-not-allowed"
								: ""
						}`}>
						<Lock size={16} className='mr-2' />
						<span className='whitespace-nowrap'>Change Password</span>
					</button>
					<button
						onClick={() => setIsEditing(!isEditing)}
						disabled={updateProfileMutation.isPending}
						className={`flex items-center justify-center px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 w-full sm:w-auto ${
							isEditing
								? theme === "dark"
									? "bg-gray-700 text-white hover:bg-gray-600"
									: "bg-gray-200 text-gray-700 hover:bg-gray-300"
								: theme === "dark"
								? "bg-blue-600 text-white hover:bg-blue-700"
								: "bg-blue-600 text-white hover:bg-blue-700"
						} ${
							updateProfileMutation.isPending
								? "opacity-50 cursor-not-allowed"
								: ""
						}`}>
						{isEditing ? (
							<X size={16} className='mr-2' />
						) : (
							<Edit size={16} className='mr-2' />
						)}
						<span className='whitespace-nowrap'>
							{isEditing ? "Cancel" : "Edit Profile"}
						</span>
					</button>
				</div>
			</motion.div>

			{/* Password Change Form */}
			{showPasswordForm && (
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className={`p-6 rounded-2xl transition-all duration-300 ${
						theme === "dark"
							? "bg-gray-900/30 backdrop-blur-xl border border-gray-700/50 shadow-2xl"
							: "bg-white/60 backdrop-blur-xl border border-gray-200/60 shadow-2xl"
					}`}>
					<h3 className='text-xl font-semibold mb-6'>Change Password</h3>
					<div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6'>
						<div className='w-full'>
							<label
								className={`block text-sm font-medium mb-2 ${
									theme === "dark" ? "text-gray-300" : "text-gray-700"
								}`}>
								Current Password
							</label>
							<div className='relative'>
								<input
									type={showPassword ? "text" : "password"}
									value={passwordData.currentPassword}
									onChange={(e) =>
										handlePasswordInputChange("currentPassword", e.target.value)
									}
									className={`w-full px-3 py-2 pr-10 rounded-xl border transition-all duration-300 ${
										theme === "dark"
											? "bg-gray-800/50 border-gray-600 text-white focus:border-blue-500"
											: "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
									}`}
								/>
								<button
									type='button'
									onClick={() => setShowPassword(!showPassword)}
									className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'>
									{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
								</button>
							</div>
						</div>
						<div className='w-full'>
							<label
								className={`block text-sm font-medium mb-2 ${
									theme === "dark" ? "text-gray-300" : "text-gray-700"
								}`}>
								New Password
							</label>
							<div className='relative'>
								<input
									type={showNewPassword ? "text" : "password"}
									value={passwordData.newPassword}
									onChange={(e) =>
										handlePasswordInputChange("newPassword", e.target.value)
									}
									className={`w-full px-3 py-2 pr-10 rounded-xl border transition-all duration-300 ${
										theme === "dark"
											? "bg-gray-800/50 border-gray-600 text-white focus:border-blue-500"
											: "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
									}`}
								/>
								<button
									type='button'
									onClick={() => setShowNewPassword(!showNewPassword)}
									className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'>
									{showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
								</button>
							</div>
						</div>
					</div>
					<div className='mt-6 flex flex-col sm:flex-row gap-3'>
						<button
							onClick={handlePasswordSubmit}
							disabled={changePasswordMutation.isPending}
							className='flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto'>
							{changePasswordMutation.isPending ? (
								<Loader2 size={16} className='mr-2 animate-spin' />
							) : (
								<Lock size={16} className='mr-2' />
							)}
							<span className='whitespace-nowrap'>
								{changePasswordMutation.isPending
									? "Changing..."
									: "Change Password"}
							</span>
						</button>
						<button
							onClick={() => {
								setShowPasswordForm(false);
								setPasswordData({ currentPassword: "", newPassword: "" });
							}}
							disabled={changePasswordMutation.isPending}
							className={`flex items-center justify-center px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto ${
								theme === "dark"
									? "bg-gray-700 text-white hover:bg-gray-600"
									: "bg-gray-200 text-gray-700 hover:bg-gray-300"
							}`}>
							<X size={16} className='mr-2' />
							<span className='whitespace-nowrap'>Cancel</span>
						</button>
					</div>
				</motion.div>
			)}

			{/* Profile Content */}
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				{/* Profile Card */}
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					className='lg:col-span-1'>
					<div
						className={`p-6 rounded-2xl transition-all duration-300 ${
							theme === "dark"
								? "bg-gray-900/30 backdrop-blur-xl border border-gray-700/50 shadow-2xl"
								: "bg-white/60 backdrop-blur-xl border border-gray-200/60 shadow-2xl"
						}`}>
						{/* Avatar */}
						<div className='flex flex-col items-center'>
							<div className='relative group'>
								{/* Hidden file input */}
								<input
									ref={fileInputRef}
									type='file'
									accept='image/*'
									onChange={handleFileChange}
									className='hidden'
								/>

								{/* Profile Picture */}
								{profilePicturePreview || userProfile.profilePicture ? (
									<img
										src={profilePicturePreview || userProfile.profilePicture}
										alt={`${formData.firstName} ${formData.lastName}`}
										className={`w-24 h-24 rounded-full object-cover mb-4 transition-all duration-300 ${
											isEditing ? "cursor-pointer hover:brightness-75" : ""
										}`}
										onClick={handleProfilePictureClick}
									/>
								) : (
									<div
										className={`w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold mb-4 transition-all duration-300 ${
											theme === "dark"
												? "bg-blue-600 text-white"
												: "bg-blue-100 text-blue-700"
										} ${isEditing ? "cursor-pointer hover:brightness-90" : ""}`}
										onClick={handleProfilePictureClick}>
										{formData.firstName.charAt(0)}
										{formData.lastName.charAt(0)}
									</div>
								)}

								{/* Camera overlay when editing */}
								{isEditing && (
									<div
										className={`absolute inset-0 w-24 h-24 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer ${
											theme === "dark"
												? "bg-black/50 text-white"
												: "bg-white/50 text-gray-700"
										}`}
										onClick={handleProfilePictureClick}>
										<Camera size={20} />
									</div>
								)}
							</div>
							<h2 className='text-xl font-semibold mb-1'>
								{formData.firstName} {formData.lastName}
							</h2>
							<p
								className={`text-sm ${
									theme === "dark" ? "text-gray-400" : "text-gray-600"
								}`}>
								{typeof userProfile.role === "object"
									? userProfile.role.key
									: userProfile.role}
							</p>
						</div>

						{/* Contact Info */}
						<div className='mt-6 space-y-3'>
							<div className='flex items-center'>
								<Mail
									size={16}
									className={`mr-3 ${
										theme === "dark" ? "text-gray-400" : "text-gray-500"
									}`}
								/>
								<span className='text-sm'>{formData.email}</span>
							</div>
							<div className='flex items-center'>
								<Phone
									size={16}
									className={`mr-3 ${
										theme === "dark" ? "text-gray-400" : "text-gray-500"
									}`}
								/>
								<span className='text-sm'>{formData.phoneNumber}</span>
							</div>
							<div className='flex items-center'>
								<MapPin
									size={16}
									className={`mr-3 ${
										theme === "dark" ? "text-gray-400" : "text-gray-500"
									}`}
								/>
								<span className='text-sm'>ID: {formData.nationalID}</span>
							</div>
						</div>

						{/* Stats */}
						<div className='mt-6 pt-6 border-t border-gray-200 dark:border-gray-700'>
							<div className='grid grid-cols-2 gap-4 text-center'>
								<div>
									<div className='text-2xl font-bold text-blue-600'>
										{userProfile.isVerified ? "✓" : "✗"}
									</div>
									<div
										className={`text-xs ${
											theme === "dark" ? "text-gray-400" : "text-gray-600"
										}`}>
										Verified
									</div>
								</div>
								<div>
									<div className='text-2xl font-bold text-green-600'>
										{userProfile.isActive ? "✓" : "✗"}
									</div>
									<div
										className={`text-xs ${
											theme === "dark" ? "text-gray-400" : "text-gray-600"
										}`}>
										Active
									</div>
								</div>
							</div>
						</div>
					</div>
				</motion.div>

				{/* Profile Details */}
				<motion.div
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					className='lg:col-span-2'>
					<div
						className={`p-6 rounded-2xl transition-all duration-300 ${
							theme === "dark"
								? "bg-gray-900/30 backdrop-blur-xl border border-gray-700/50 shadow-2xl"
								: "bg-white/60 backdrop-blur-xl border border-gray-200/60 shadow-2xl"
						}`}>
						<h3 className='text-xl font-semibold mb-6'>Personal Information</h3>

						<div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6'>
							<div className='w-full'>
								<label
									className={`block text-sm font-medium mb-2 ${
										theme === "dark" ? "text-gray-300" : "text-gray-700"
									}`}>
									First Name
								</label>
								{isEditing ? (
									<input
										type='text'
										value={formData.firstName}
										onChange={(e) =>
											handleInputChange("firstName", e.target.value)
										}
										className={`w-full px-3 py-2 rounded-xl border transition-all duration-300 ${
											theme === "dark"
												? "bg-gray-800/50 border-gray-600 text-white focus:border-blue-500"
												: "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
										}`}
									/>
								) : (
									<div
										className={`px-3 py-2 rounded-xl ${
											theme === "dark" ? "bg-gray-800/30" : "bg-gray-50"
										}`}>
										{formData.firstName}
									</div>
								)}
							</div>

							<div className='w-full'>
								<label
									className={`block text-sm font-medium mb-2 ${
										theme === "dark" ? "text-gray-300" : "text-gray-700"
									}`}>
									Last Name
								</label>
								{isEditing ? (
									<input
										type='text'
										value={formData.lastName}
										onChange={(e) =>
											handleInputChange("lastName", e.target.value)
										}
										className={`w-full px-3 py-2 rounded-xl border transition-all duration-300 ${
											theme === "dark"
												? "bg-gray-800/50 border-gray-600 text-white focus:border-blue-500"
												: "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
										}`}
									/>
								) : (
									<div
										className={`px-3 py-2 rounded-xl ${
											theme === "dark" ? "bg-gray-800/30" : "bg-gray-50"
										}`}>
										{formData.lastName}
									</div>
								)}
							</div>

							<div className='w-full'>
								<label
									className={`block text-sm font-medium mb-2 ${
										theme === "dark" ? "text-gray-300" : "text-gray-700"
									}`}>
									Email
								</label>
								<div
									className={`px-3 py-2 rounded-xl ${
										theme === "dark" ? "bg-gray-800/30" : "bg-gray-50"
									}`}>
									{formData.email}
								</div>
							</div>

							<div className='w-full'>
								<label
									className={`block text-sm font-medium mb-2 ${
										theme === "dark" ? "text-gray-300" : "text-gray-700"
									}`}>
									Phone Number
								</label>
								{isEditing ? (
									<input
										type='tel'
										value={formData.phoneNumber}
										onChange={(e) =>
											handleInputChange("phoneNumber", e.target.value)
										}
										className={`w-full px-3 py-2 rounded-xl border transition-all duration-300 ${
											theme === "dark"
												? "bg-gray-800/50 border-gray-600 text-white focus:border-blue-500"
												: "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
										}`}
									/>
								) : (
									<div
										className={`px-3 py-2 rounded-xl ${
											theme === "dark" ? "bg-gray-800/30" : "bg-gray-50"
										}`}>
										{formData.phoneNumber}
									</div>
								)}
							</div>

							<div className='w-full'>
								<label
									className={`block text-sm font-medium mb-2 ${
										theme === "dark" ? "text-gray-300" : "text-gray-700"
									}`}>
									National ID
								</label>
								<div
									className={`px-3 py-2 rounded-xl ${
										theme === "dark" ? "bg-gray-800/30" : "bg-gray-50"
									}`}>
									{formData.nationalID}
								</div>
							</div>
							<div className='w-full'>
								<label
									className={`block text-sm font-medium mb-2 ${
										theme === "dark" ? "text-gray-300" : "text-gray-700"
									}`}>
									Date of Birth
								</label>
								{isEditing ? (
									<input
										type='date'
										value={formData.dateOfBirth}
										onChange={(e) =>
											handleInputChange("dateOfBirth", e.target.value)
										}
										className={`w-full px-3 py-2 rounded-xl border transition-all duration-300 ${
											theme === "dark"
												? "bg-gray-800/50 border-gray-600 text-white focus:border-blue-500"
												: "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
										}`}
									/>
								) : (
									<div
										className={`px-3 py-2 rounded-xl ${
											theme === "dark" ? "bg-gray-800/30" : "bg-gray-50"
										}`}>
										{formData.dateOfBirth}
									</div>
								)}
							</div>
						</div>

						{/* Profile Picture Upload Status */}
						{selectedFile && (
							<div className='mt-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700'>
								<div className='flex items-center justify-between'>
									<div className='flex items-center'>
										<Camera size={16} className='mr-2 text-blue-600' />
										<span className='text-sm text-blue-700 dark:text-blue-300'>
											New profile picture selected: {selectedFile.name}
										</span>
									</div>
									{!isEditing && (
										<div className='text-sm text-blue-600'>
											Will be saved with profile changes
										</div>
									)}
								</div>
							</div>
						)}

						{/* Action Buttons */}
						{isEditing && (
							<div className='mt-6 flex flex-col sm:flex-row gap-3'>
								<button
									onClick={handleSave}
									disabled={updateProfileMutation.isPending}
									className='flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto'>
									{updateProfileMutation.isPending ? (
										<Loader2 size={16} className='mr-2 animate-spin' />
									) : (
										<Save size={16} className='mr-2' />
									)}
									<span className='whitespace-nowrap'>
										{updateProfileMutation.isPending
											? "Saving..."
											: "Save Changes"}
									</span>
								</button>
								<button
									onClick={handleCancel}
									disabled={updateProfileMutation.isPending}
									className={`flex items-center justify-center px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto ${
										theme === "dark"
											? "bg-gray-700 text-white hover:bg-gray-600"
											: "bg-gray-200 text-gray-700 hover:bg-gray-300"
									}`}>
									<X size={16} className='mr-2' />
									<span className='whitespace-nowrap'>Cancel</span>
								</button>
							</div>
						)}
					</div>
				</motion.div>
			</div>

			{/* Achievements Section */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3 }}
				className='mt-6'>
				<div
					className={`p-6 rounded-2xl transition-all duration-300 ${
						theme === "dark"
							? "bg-gray-900/30 backdrop-blur-xl border border-gray-700/50 shadow-2xl"
							: "bg-white/60 backdrop-blur-xl border border-gray-200/60 shadow-2xl"
					}`}>
					<div className='flex items-center space-x-3 mb-6'>
						<Award size={24} className='text-blue-500' />
						<h3 className='text-xl font-semibold'>
							Achievements & Certificates
						</h3>
					</div>
					<ProfileAchievements userId={userProfile._id} />
				</div>
			</motion.div>
		</div>
	);
};

// Component to display user achievements
const ProfileAchievements: React.FC<{ userId: string }> = ({ userId }) => {
	const { theme } = useTheme();
	const navigate = useNavigate();
	const { data: achievements, isLoading, error } = useUserAchievements(userId);

	if (isLoading) {
		return (
			<div className='flex items-center justify-center py-8'>
				<Loader2 size={20} className='animate-spin text-blue-500 mr-2' />
				<span className='text-gray-500'>Loading achievements...</span>
			</div>
		);
	}

	if (error) {
		return (
			<div className='text-center py-8'>
				<div className='text-red-500 mb-2'>Error loading achievements</div>
				<div className='text-sm text-gray-500'>Please try again later</div>
			</div>
		);
	}

	if (!achievements || achievements.length === 0) {
		return (
			<div className='text-center py-8'>
				<Award size={48} className='mx-auto text-gray-400 mb-4' />
				<h4
					className={`text-lg font-medium mb-2 ${
						theme === "dark" ? "text-white" : "text-gray-900"
					}`}>
					No Achievements Yet
				</h4>
				<p
					className={`text-sm ${
						theme === "dark" ? "text-gray-400" : "text-gray-600"
					}`}>
					Your achievements and certificates will appear here once they are
					awarded.
				</p>
			</div>
		);
	}

	return (
		<div className='space-y-4'>
			{/* Achievements Summary */}
			<div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6'>
				<div
					className={`p-4 rounded-xl text-center ${
						theme === "dark" ? "bg-gray-800/50" : "bg-blue-50"
					}`}>
					<div className='text-2xl font-bold text-blue-600 mb-1'>
						{achievements.length}
					</div>
					<div
						className={`text-sm ${
							theme === "dark" ? "text-gray-300" : "text-blue-700"
						}`}>
						Total Achievements
					</div>
				</div>
				<div
					className={`p-4 rounded-xl text-center ${
						theme === "dark" ? "bg-gray-800/50" : "bg-green-50"
					}`}>
					<div className='text-2xl font-bold text-green-600 mb-1'>
						{achievements.filter((a) => a.isVerified).length}
					</div>
					<div
						className={`text-sm ${
							theme === "dark" ? "text-gray-300" : "text-green-700"
						}`}>
						Verified
					</div>
				</div>
				<div
					className={`p-4 rounded-xl text-center ${
						theme === "dark" ? "bg-gray-800/50" : "bg-purple-50"
					}`}>
					<div className='text-2xl font-bold text-purple-600 mb-1'>
						{new Set(achievements.map((a) => a.achievementType)).size}
					</div>
					<div
						className={`text-sm ${
							theme === "dark" ? "text-gray-300" : "text-purple-700"
						}`}>
						Categories
					</div>
				</div>
			</div>

			{/* Achievements List */}
			<div className='space-y-3'>
				{achievements.map((achievement) => (
					<div
						key={achievement._id}
						onClick={() =>
							navigate(`/dashboard/achievements/${achievement._id}`)
						}
						className={`p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
							theme === "dark"
								? "bg-gray-800/50 border-gray-700/50 hover:bg-gray-800/70 hover:border-blue-500/50"
								: "bg-white/60 border-gray-200/50 hover:bg-white/80 hover:border-blue-300/50"
						}`}>
						<div className='flex items-start justify-between'>
							<div className='flex-1'>
								<div className='flex items-center space-x-3 mb-2'>
									<h4
										className={`text-lg font-medium ${
											theme === "dark" ? "text-white" : "text-gray-900"
										}`}>
										{achievement.title}
									</h4>
									<span
										className={`px-3 py-1 text-xs rounded-full font-medium ${
											theme === "dark"
												? "bg-blue-600/20 text-blue-300"
												: "bg-blue-100 text-blue-700"
										}`}>
										{achievement.achievementType
											.replace("_", " ")
											.replace(/\b\w/g, (l) => l.toUpperCase())}
									</span>
									{achievement.isVerified && (
										<span
											className={`px-2 py-1 text-xs rounded-full font-medium ${
												theme === "dark"
													? "bg-green-600/20 text-green-300"
													: "bg-green-100 text-green-700"
											}`}>
											✓ Verified
										</span>
									)}
								</div>

								<p
									className={`text-sm mb-3 ${
										theme === "dark" ? "text-gray-300" : "text-gray-600"
									}`}>
									{achievement.description}
								</p>

								<div className='flex items-center space-x-4 text-xs'>
									<div className='flex items-center space-x-1'>
										<Calendar size={12} className='text-gray-400' />
										<span
											className={`${
												theme === "dark" ? "text-gray-400" : "text-gray-500"
											}`}>
											Awarded:{" "}
											{new Date(achievement.dateAwarded).toLocaleDateString()}
										</span>
									</div>
									{achievement.certificateFile && (
										<div className='flex items-center space-x-1'>
											<FileText size={12} className='text-green-500' />
											<span className='text-green-600 dark:text-green-400'>
												Certificate attached
											</span>
										</div>
									)}
								</div>

								{achievement.awardedBy && (
									<div className='mt-2 text-xs text-gray-500'>
										Awarded by:{" "}
										{typeof achievement.awardedBy === "string"
											? achievement.awardedBy
											: achievement.awardedBy.firstName +
											  " " +
											  achievement.awardedBy.lastName}
									</div>
								)}

								{/* Click hint */}
								<div
									className={`mt-2 text-xs ${
										theme === "dark" ? "text-blue-400" : "text-blue-600"
									}`}>
									Click to view details →
								</div>
							</div>


						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default Profile;
