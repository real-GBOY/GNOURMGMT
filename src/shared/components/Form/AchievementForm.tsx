/** @format */

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../Button";
import {
	achievementTypes,
	CreateAchievementSchema,
	UpdateAchievementSchema,
} from "../../schemas/AchievementSchema";
import {
	CreateAchievementFormData,
	UpdateAchievementFormData,
} from "../../schemas/AchievementSchema";

interface AchievementFormProps {
	initialData?: Partial<UpdateAchievementFormData>;
	onSubmit: (
		data: CreateAchievementFormData | UpdateAchievementFormData
	) => void;
	onCancel: () => void;
	isLoading?: boolean;
	mode: "create" | "edit";
	users?: Array<{
		_id: string;
		firstName: string;
		lastName: string;
		email: string;
	}>;
}

const AchievementForm: React.FC<AchievementFormProps> = ({
	initialData,
	onSubmit,
	onCancel,
	isLoading = false,
	mode,
	users = [],
}) => {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [fileDescription, setFileDescription] = useState("");

	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
		watch,
	} = useForm<CreateAchievementFormData | UpdateAchievementFormData>({
		resolver: zodResolver(
			mode === "create" ? CreateAchievementSchema : UpdateAchievementSchema
		),
		defaultValues: initialData,
		mode: "onChange",
	});

	const watchedType = watch("achievementType");

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setSelectedFile(file);
		}
	};

	const handleFormSubmit = (
		data: CreateAchievementFormData | UpdateAchievementFormData
	) => {
		onSubmit(data);
	};

	return (
		<div className='w-full max-w-4xl mx-auto'>
			{/* Form Header */}
			<div className='mb-8 text-center'>
				<h2 className='text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent'>
					{mode === "create" ? "Create New Achievement" : "Edit Achievement"}
				</h2>
				<p className='mt-2 text-muted-foreground text-lg'>
					{mode === "create"
						? "Recognize excellence and celebrate success"
						: "Update achievement details and information"}
				</p>
			</div>

			<form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-8'>
				{/* Main Form Grid */}
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
					{/* Left Column */}
					<div className='space-y-6'>
						{/* Title */}
						<div className='space-y-2'>
							<label
								htmlFor='title'
								className='text-sm font-semibold text-foreground flex items-center gap-2'>
								<span className='w-2 h-2 bg-primary rounded-full'></span>
								Title *
							</label>
							<input
								{...register("title")}
								type='text'
								id='title'
								className='w-full px-4 py-3 rounded-xl border border-input bg-background/50 backdrop-blur-sm 
									text-foreground placeholder:text-muted-foreground/60
									focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 
									focus:ring-offset-background transition-all duration-200
									hover:bg-background/80 hover:border-ring/50
									shadow-sm hover:shadow-md'
								placeholder='Enter achievement title'
							/>
							{errors.title && (
								<p className='text-sm text-destructive flex items-center gap-2'>
									<span className='w-1.5 h-1.5 bg-destructive rounded-full'></span>
									{errors.title.message}
								</p>
							)}
						</div>

						{/* Description */}
						<div className='space-y-2'>
							<label
								htmlFor='description'
								className='text-sm font-semibold text-foreground flex items-center gap-2'>
								<span className='w-2 h-2 bg-primary rounded-full'></span>
								Description *
							</label>
							<textarea
								{...register("description")}
								id='description'
								rows={4}
								className='w-full px-4 py-3 rounded-xl border border-input bg-background/50 backdrop-blur-sm 
									text-foreground placeholder:text-muted-foreground/60 resize-none
									focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 
									focus:ring-offset-background transition-all duration-200
									hover:bg-background/80 hover:border-ring/50
									shadow-sm hover:shadow-md'
								placeholder='Describe the achievement in detail...'
							/>
							{errors.description && (
								<p className='text-sm text-destructive flex items-center gap-2'>
									<span className='w-1.5 h-1.5 bg-destructive rounded-full'></span>
									{errors.description.message}
								</p>
							)}
						</div>

						{/* Achievement Type */}
						<div className='space-y-2'>
							<label
								htmlFor='achievementType'
								className='text-sm font-semibold text-foreground flex items-center gap-2'>
								<span className='w-2 h-2 bg-primary rounded-full'></span>
								Achievement Type *
							</label>
							<select
								{...register("achievementType")}
								id='achievementType'
								className='w-full px-4 py-3 rounded-xl border border-input bg-background/50 backdrop-blur-sm 
									text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 
									focus:ring-offset-background transition-all duration-200
									hover:bg-background/80 hover:border-ring/50
									shadow-sm hover:shadow-md cursor-pointer'>
								<option value=''>Select achievement type</option>
								{achievementTypes.map((type) => (
									<option key={type} value={type}>
										{type.charAt(0).toUpperCase() +
											type.slice(1).replace("_", " ")}
									</option>
								))}
							</select>
							{errors.achievementType && (
								<p className='text-sm text-destructive flex items-center gap-2'>
									<span className='w-1.5 h-1.5 bg-destructive rounded-full'></span>
									{errors.achievementType.message}
								</p>
							)}
						</div>
					</div>

					{/* Right Column */}
					<div className='space-y-6'>
						{/* User Selection (only for create mode) */}
						{mode === "create" && (
							<div className='space-y-2'>
								<label
									htmlFor='user'
									className='text-sm font-semibold text-foreground flex items-center gap-2'>
									<span className='w-2 h-2 bg-primary rounded-full'></span>
									User *
								</label>
								<select
									{...register("user")}
									id='user'
									className='w-full px-4 py-3 rounded-xl border border-input bg-background/50 backdrop-blur-sm 
										text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 
										focus:ring-offset-background transition-all duration-200
										hover:bg-background/80 hover:border-ring/50
										shadow-sm hover:shadow-md cursor-pointer'>
									<option value=''>Select user</option>
									{users.map((user) => (
										<option key={user._id} value={user._id}>
											{user.firstName} {user.lastName} ({user.email})
										</option>
									))}
								</select>
								{mode === "create" && (errors as any).user && (
									<p className='text-sm text-destructive flex items-center gap-2'>
										<span className='w-1.5 h-1.5 bg-destructive rounded-full'></span>
										{(errors as any).user?.message}
									</p>
								)}
							</div>
						)}


					</div>
				</div>

				{/* File Upload Section */}
				{mode === "create" && (
					<div
						className='space-y-6 p-6 rounded-2xl bg-gradient-to-br from-muted/30 to-muted/10 
						border border-muted/20 backdrop-blur-sm'>
						<div className='text-center mb-6'>
							<h4 className='text-lg font-semibold text-foreground mb-2'>
								Certificate File (Optional)
							</h4>
							<p className='text-muted-foreground text-sm'>
								Upload supporting documents or certificates for this achievement
							</p>
						</div>

						<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
							{/* File Input */}
							<div className='space-y-3'>
								<label
									htmlFor='file'
									className='text-sm font-semibold text-foreground flex items-center gap-2'>
									<span className='w-2 h-2 bg-primary rounded-full'></span>
									Upload Certificate
								</label>
								<div className='relative'>
									<input
										type='file'
										id='file'
										accept='.pdf,.doc,.docx,.jpg,.jpeg,.png'
										onChange={handleFileChange}
										className='w-full px-4 py-3 rounded-xl border border-input bg-background/50 backdrop-blur-sm 
											text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 
											file:text-sm file:font-medium file:bg-primary file:text-primary-foreground 
											hover:file:bg-primary/90 transition-all duration-200 cursor-pointer
											focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 
											focus:ring-offset-background hover:bg-background/80 hover:border-ring/50
											shadow-sm hover:shadow-md'
									/>
								</div>
							</div>

							{/* File Description */}
							{selectedFile && (
								<div className='space-y-3'>
									<label
										htmlFor='fileDescription'
										className='text-sm font-semibold text-foreground flex items-center gap-2'>
										<span className='w-2 h-2 bg-primary rounded-full'></span>
										File Description
									</label>
									<input
										type='text'
										id='fileDescription'
										value={fileDescription}
										onChange={(e) => setFileDescription(e.target.value)}
										className='w-full px-4 py-3 rounded-xl border border-input bg-background/50 backdrop-blur-sm 
											text-foreground placeholder:text-muted-foreground/60
											focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 
											focus:ring-offset-background transition-all duration-200
											hover:bg-background/80 hover:border-ring/50
											shadow-sm hover:shadow-md'
										placeholder='Describe the uploaded file'
									/>
								</div>
							)}
						</div>

						{/* File Preview */}
						{selectedFile && (
							<div className='p-4 rounded-xl bg-background/50 backdrop-blur-sm border border-muted/20'>
								<div className='flex items-center gap-3 mb-3'>
									<svg
										className='w-5 h-5 text-primary'
										fill='none'
										stroke='currentColor'
										viewBox='0 0 24 24'>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
										/>
									</svg>
									<h5 className='font-medium text-foreground'>File Details</h5>
								</div>
								<div className='grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm'>
									<div className='space-y-1'>
										<p className='text-muted-foreground'>File Name</p>
										<p className='font-medium text-foreground truncate'>
											{selectedFile.name}
										</p>
									</div>
									<div className='space-y-1'>
										<p className='text-muted-foreground'>Size</p>
										<p className='font-medium text-foreground'>
											{(selectedFile.size / 1024 / 1024).toFixed(2)} MB
										</p>
									</div>
									<div className='space-y-1'>
										<p className='text-muted-foreground'>Type</p>
										<p className='font-medium text-foreground'>
											{selectedFile.type}
										</p>
									</div>
								</div>
							</div>
						)}
					</div>
				)}

				{/* Form Actions */}
				<div className='flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-muted/20'>
					<Button
						type='button'
						variant='outline'
						onClick={onCancel}
						disabled={isLoading}
						size='lg'
						className='w-full sm:w-auto px-8 py-3 rounded-xl border-2 hover:bg-muted/50 
							transition-all duration-200 hover:shadow-md'>
						Cancel
					</Button>
					<Button
						type='submit'
						disabled={!isValid || isLoading}
						size='lg'
						className='w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-primary to-primary/80 
							hover:from-primary/90 hover:to-primary/70 transition-all duration-200 
							hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50'>
						{isLoading ? (
							<div className='flex items-center gap-2'>
								<div className='w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin'></div>
								Saving...
							</div>
						) : mode === "create" ? (
							"Create Achievement"
						) : (
							"Update Achievement"
						)}
					</Button>
				</div>
			</form>
		</div>
	);
};

export default AchievementForm;
