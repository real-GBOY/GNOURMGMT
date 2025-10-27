/** @format */

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Role } from "../types/User";
import { useUpdateUser } from "../services/userService";
import { useRoles } from "../services/userService";
import { useTheme } from "../contexts/ThemeContext";
import Modal from "./Modal";
import { Camera, Loader2 } from "lucide-react";

interface UserEditModalProps {
	isOpen: boolean;
	onClose: () => void;
	user: User | null;
}

const UserEditModal: React.FC<UserEditModalProps> = ({
	isOpen,
	onClose,
	user,
}) => {
	const { theme } = useTheme();
	const updateUserMutation = useUpdateUser();
	const { data: roles = [] } = useRoles();

	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		phoneNumber: "",
		nationalID: "",
		dateOfBirth: "",
		role: "",
		isActive: true,
		isVerified: false,
	});

	const [profilePicturePreview, setProfilePicturePreview] = useState<
		string | null
	>(null);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const fileInputRef = React.useRef<HTMLInputElement>(null);

	// Update form data when user changes
	useEffect(() => {
		if (user) {
			setFormData({
				firstName: user.firstName || "",
				lastName: user.lastName || "",
				email: user.email || "",
				phoneNumber: user.phoneNumber || "",
				nationalID: user.nationalID || "",
				dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split("T")[0] : "",
				role: typeof user.role === "string" ? user.role : user.role._id,
				isActive: user.isActive,
				isVerified: user.isVerified,
			});
			setProfilePicturePreview(user.profilePicture || null);
		}
	}, [user]);

	const handleInputChange = (field: string, value: string | boolean) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setSelectedFile(file);
			const reader = new FileReader();
			reader.onload = (e) => {
				setProfilePicturePreview(e.target?.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!user) return;

		try {
			const updateData = selectedFile
				? { ...formData, file: selectedFile }
				: formData;

			await updateUserMutation.mutateAsync({
				userId: user._id,
				data: updateData,
			});

			// Reset file-related state on success
			setProfilePicturePreview(user.profilePicture || null);
			setSelectedFile(null);
			onClose();
		} catch (error) {
			console.error("Failed to update user:", error);
		}
	};

	const handleCancel = () => {
		// Reset form data to original values
		if (user) {
			setFormData({
				firstName: user.firstName || "",
				lastName: user.lastName || "",
				email: user.email || "",
				phoneNumber: user.phoneNumber || "",
				nationalID: user.nationalID || "",
				dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split("T")[0] : "",
				role: typeof user.role === "string" ? user.role : user.role._id,
				isActive: user.isActive,
				isVerified: user.isVerified,
			});
			setProfilePicturePreview(user.profilePicture || null);
			setSelectedFile(null);
		}
		onClose();
	};

	return (
		<Modal isOpen={isOpen} onClose={handleCancel} title='Edit User' size='lg'>
			<form onSubmit={handleSubmit} className='space-y-6'>
				{/* Profile Picture */}
				<div className='flex flex-col items-center space-y-4'>
					<div className='relative'>
						<img
							src={
								profilePicturePreview ||
								"https://res.cloudinary.com/your-cloud-name/image/upload/v1/profiles/default-avatar.png"
							}
							alt='Profile'
							className='w-24 h-24 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700'
						/>
						<button
							type='button'
							onClick={() => fileInputRef.current?.click()}
							className={`absolute -bottom-2 -right-2 p-2 rounded-full transition-colors duration-300 ${
								theme === "dark"
									? "bg-blue-600 hover:bg-blue-700 text-white"
									: "bg-blue-600 hover:bg-blue-700 text-white"
							}`}>
							<Camera size={16} />
						</button>
					</div>
					<input
						ref={fileInputRef}
						type='file'
						accept='image/*'
						onChange={handleFileChange}
						className='hidden'
					/>
				</div>

				{/* Form Fields */}
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					{/* First Name */}
					<div>
						<label
							className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
								theme === "dark" ? "text-gray-300" : "text-gray-700"
							}`}>
							First Name
						</label>
						<input
							type='text'
							value={formData.firstName}
							onChange={(e) => handleInputChange("firstName", e.target.value)}
							className={`w-full px-3 py-2 rounded-lg border transition-colors duration-300 ${
								theme === "dark"
									? "bg-gray-800 border-gray-700 text-white focus:border-blue-500"
									: "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
							}`}
							required
						/>
					</div>

					{/* Last Name */}
					<div>
						<label
							className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
								theme === "dark" ? "text-gray-300" : "text-gray-700"
							}`}>
							Last Name
						</label>
						<input
							type='text'
							value={formData.lastName}
							onChange={(e) => handleInputChange("lastName", e.target.value)}
							className={`w-full px-3 py-2 rounded-lg border transition-colors duration-300 ${
								theme === "dark"
									? "bg-gray-800 border-gray-700 text-white focus:border-blue-500"
									: "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
							}`}
							required
						/>
					</div>

					{/* Email */}
					<div>
						<label
							className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
								theme === "dark" ? "text-gray-300" : "text-gray-700"
							}`}>
							Email
						</label>
						<input
							type='email'
							value={formData.email}
							onChange={(e) => handleInputChange("email", e.target.value)}
							className={`w-full px-3 py-2 rounded-lg border transition-colors duration-300 ${
								theme === "dark"
									? "bg-gray-800 border-gray-700 text-white focus:border-blue-500"
									: "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
							}`}
							required
						/>
					</div>

					{/* Phone Number */}
					<div>
						<label
							className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
								theme === "dark" ? "text-gray-300" : "text-gray-700"
							}`}>
							Phone Number
						</label>
						<input
							type='tel'
							value={formData.phoneNumber}
							onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
							className={`w-full px-3 py-2 rounded-lg border transition-colors duration-300 ${
								theme === "dark"
									? "bg-gray-800 border-gray-700 text-white focus:border-blue-500"
									: "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
							}`}
							required
						/>
					</div>

					{/* National ID */}
					<div>
						<label
							className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
								theme === "dark" ? "text-gray-300" : "text-gray-700"
							}`}>
							National ID
						</label>
						<input
							type='text'
							value={formData.nationalID}
							onChange={(e) => handleInputChange("nationalID", e.target.value)}
							className={`w-full px-3 py-2 rounded-lg border transition-colors duration-300 ${
								theme === "dark"
									? "bg-gray-800 border-gray-700 text-white focus:border-blue-500"
									: "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
							}`}
							required
						/>
					</div>

					{/* Date of Birth */}
					<div>
						<label
							className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
								theme === "dark" ? "text-gray-300" : "text-gray-700"
							}`}>
							Date of Birth
						</label>
						<input
							type='date'
							value={formData.dateOfBirth}
							onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
							className={`w-full px-3 py-2 rounded-lg border transition-colors duration-300 ${
								theme === "dark"
									? "bg-gray-800 border-gray-700 text-white focus:border-blue-500"
									: "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
							}`}
							required
						/>
					</div>

					{/* Role */}
					<div>
						<label
							className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
								theme === "dark" ? "text-gray-300" : "text-gray-700"
							}`}>
							Role
						</label>
						<select
							value={formData.role}
							onChange={(e) => handleInputChange("role", e.target.value)}
							className={`w-full px-3 py-2 rounded-lg border transition-colors duration-300 ${
								theme === "dark"
									? "bg-gray-800 border-gray-700 text-white focus:border-blue-500"
									: "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
							}`}
							required>
							<option value=''>Select a role</option>
							{roles.map((role: Role) => (
								<option key={role._id} value={role._id}>
									{role.key}
								</option>
							))}
						</select>
					</div>
				</div>

				{/* Status Checkboxes */}
				<div className='flex space-x-6'>
					<label className='flex items-center space-x-2'>
						<input
							type='checkbox'
							checked={formData.isActive}
							onChange={(e) => handleInputChange("isActive", e.target.checked)}
							className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
						/>
						<span
							className={`text-sm transition-colors duration-300 ${
								theme === "dark" ? "text-gray-300" : "text-gray-700"
							}`}>
							Active
						</span>
					</label>

					<label className='flex items-center space-x-2'>
						<input
							type='checkbox'
							checked={formData.isVerified}
							onChange={(e) =>
								handleInputChange("isVerified", e.target.checked)
							}
							className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
						/>
						<span
							className={`text-sm transition-colors duration-300 ${
								theme === "dark" ? "text-gray-300" : "text-gray-700"
							}`}>
							Verified
						</span>
					</label>
				</div>

				{/* Action Buttons */}
				<div className='flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700'>
					<button
						type='button'
						onClick={handleCancel}
						className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
							theme === "dark"
								? "bg-gray-700 hover:bg-gray-600 text-white"
								: "bg-gray-200 hover:bg-gray-300 text-gray-800"
						}`}>
						Cancel
					</button>
					<button
						type='submit'
						disabled={updateUserMutation.isPending}
						className={`px-4 py-2 rounded-lg transition-colors duration-300 flex items-center space-x-2 ${
							theme === "dark"
								? "bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-800"
								: "bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-400"
						}`}>
						{updateUserMutation.isPending && (
							<Loader2 size={16} className='animate-spin' />
						)}
						<span>Update User</span>
					</button>
				</div>
			</form>
		</Modal>
	);
};

export default UserEditModal;


