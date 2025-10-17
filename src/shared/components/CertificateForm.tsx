/** @format */

import React, { useState } from "react";
import { useForm } from "react-hook-form";

import { Award, Upload, X } from "lucide-react";
import { Button } from "./Button";
import { useAssignAchievementWithFile } from "../services/achievementService";
import { achievementTypes } from "../schemas/AchievementSchema";
import { toastService } from "../services/toastService";

interface CertificateFormProps {
	userId: string;
	userName: string;
	onSubmit: (data: any) => void;
	onCancel: () => void;
}

interface CertificateFormData {
	title: string;
	description: string;
	achievementType: string;
}

const CertificateForm: React.FC<CertificateFormProps> = ({
	userId,
	userName,
	onSubmit,
	onCancel,
}) => {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const assignAchievement = useAssignAchievementWithFile();

	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
		reset,
	} = useForm<CertificateFormData>({
		mode: "onChange",
		defaultValues: {
			title: "",
			description: "",
			achievementType: "excellence",
		},
	});

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			// Check file size (max 10MB)
			if (file.size > 10 * 1024 * 1024) {
				toastService.error("File size must be less than 10MB");
				return;
			}
			// Check file type (PDF, DOC, DOCX, PNG, JPG, JPEG)
			const allowedTypes = [
				"application/pdf",
				"application/msword",
				"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
				"image/png",
				"image/jpeg",
				"image/jpg",
			];
			if (!allowedTypes.includes(file.type)) {
				toastService.error(
					"Please select a valid file type (PDF, DOC, DOCX, PNG, JPG, JPEG)"
				);
				return;
			}
			setSelectedFile(file);
		}
	};

	const removeFile = () => {
		setSelectedFile(null);
	};

	const handleFormSubmit = async (data: CertificateFormData) => {
		if (!selectedFile) {
			toastService.error("Please select a certificate file");
			return;
		}

		setIsSubmitting(true);

		try {
			const formData = new FormData();
			formData.append("title", data.title);
			formData.append("description", data.description);
			formData.append("achievementType", data.achievementType);
			formData.append("userId", userId);

			formData.append("file", selectedFile);

			await assignAchievement.mutateAsync(formData);

			toastService.success(`Certificate added successfully for ${userName}!`);
			reset();
			setSelectedFile(null);
			onSubmit(data);
		} catch (error) {
			console.error("Error adding certificate:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-6'>
			{/* User Info */}
			<div className='p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800'>
				<div className='flex items-center space-x-3'>
					<Award className='w-5 h-5 text-blue-600 dark:text-blue-400' />
					<div>
						<p className='text-sm font-medium text-blue-800 dark:text-blue-200'>
							Adding Certificate for
						</p>
						<p className='text-lg font-semibold text-blue-900 dark:text-blue-100'>
							{userName}
						</p>
					</div>
				</div>
			</div>

			{/* Title */}
			<div>
				<label
					htmlFor='title'
					className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
					Certificate Title *
				</label>
				<input
					{...register("title", { required: "Title is required" })}
					type='text'
					id='title'
					className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm'
					placeholder='Enter certificate title'
				/>
				{errors.title && (
					<p className='mt-1 text-sm text-red-600 dark:text-red-400'>
						{errors.title.message}
					</p>
				)}
			</div>

			{/* Description */}
			<div>
				<label
					htmlFor='description'
					className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
					Description *
				</label>
				<textarea
					{...register("description", { required: "Description is required" })}
					id='description'
					rows={3}
					className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm'
					placeholder='Describe the achievement or certificate'
				/>
				{errors.description && (
					<p className='mt-1 text-sm text-red-600 dark:text-red-400'>
						{errors.description.message}
					</p>
				)}
			</div>

			{/* Achievement Type */}
			<div>
				<label
					htmlFor='achievementType'
					className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
					Achievement Type *
				</label>
				<select
					{...register("achievementType", {
						required: "Achievement type is required",
					})}
					id='achievementType'
					className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm'>
					{achievementTypes.map((type) => (
						<option key={type} value={type}>
							{type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
						</option>
					))}
				</select>
				{errors.achievementType && (
					<p className='mt-1 text-sm text-red-600 dark:text-red-400'>
						{errors.achievementType.message}
					</p>
				)}
			</div>

			{/* File Upload */}
			<div>
				<label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
					Certificate File *
				</label>
				<div className='mt-1'>
					{!selectedFile ? (
						<div className='flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md dark:border-gray-600'>
							<div className='space-y-1 text-center'>
								<Upload className='mx-auto h-12 w-12 text-gray-400' />
								<div className='flex text-sm text-gray-600 dark:text-gray-400'>
									<label
										htmlFor='file-upload'
										className='relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500'>
										<span>Upload a file</span>
										<input
											id='file-upload'
											name='file-upload'
											type='file'
											className='sr-only'
											accept='.pdf,.doc,.docx,.png,.jpg,.jpeg'
											onChange={handleFileChange}
										/>
									</label>
									<p className='pl-1'>or drag and drop</p>
								</div>
								<p className='text-xs text-gray-500 dark:text-gray-400'>
									PDF, DOC, DOCX, PNG, JPG, JPEG up to 10MB
								</p>
							</div>
						</div>
					) : (
						<div className='flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md'>
							<div className='flex items-center space-x-3'>
								<Upload className='w-5 h-5 text-green-600 dark:text-green-400' />
								<div>
									<p className='text-sm font-medium text-green-800 dark:text-green-200'>
										{selectedFile.name}
									</p>
									<p className='text-xs text-green-600 dark:text-green-400'>
										{(selectedFile.size / 1024 / 1024).toFixed(2)} MB
									</p>
								</div>
							</div>
							<button
								type='button'
								onClick={removeFile}
								className='p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200'>
								<X className='w-4 h-4' />
							</button>
						</div>
					)}
				</div>
			</div>

			{/* Action Buttons */}
			<div className='flex items-center justify-end space-x-3 pt-4'>
				<Button
					type='button'
					variant='outline'
					onClick={onCancel}
					disabled={isSubmitting}>
					Cancel
				</Button>
				<Button
					type='submit'
					disabled={!isValid || !selectedFile || isSubmitting}>
					{isSubmitting ? "Adding Certificate..." : "Add Certificate"}
				</Button>
			</div>
		</form>
	);
};

export default CertificateForm;
