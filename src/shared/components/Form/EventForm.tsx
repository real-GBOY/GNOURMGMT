/** @format */

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { motion } from "framer-motion";
import {
	AlertCircle,
	Upload,
	X,
	FileText,
	Download,
	Trash2,
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { CreateEventData, UpdateEventData, Event } from "../../types/Event";
import {
	useUploadFileToEvent,
	useRemoveFileFromEvent,
} from "../../services/eventService";

interface EventFormProps {
	schema: any;
	defaultValues?: Partial<CreateEventData | UpdateEventData>;
	onSubmit: (data: any) => void | Promise<void>;
	submitButtonText?: string;
	className?: string;
	existingEvent?: Event; // Add this to show existing agenda
}

export const EventForm: React.FC<EventFormProps> = ({
	schema,
	defaultValues,
	onSubmit,
	submitButtonText = "Submit",
	className = "",
	existingEvent,
}) => {
	const { theme } = useTheme();
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);

	// File management mutations
	const uploadFileMutation = useUploadFileToEvent();
	const removeFileMutation = useRemoveFileFromEvent();

	const {
		register,
		handleSubmit,
		setValue,
		reset,
		watch,
		formState: { errors, isSubmitting, isSubmitSuccessful },
	} = useForm<CreateEventData | UpdateEventData>({
		resolver: yupResolver(schema),
		defaultValues,
	});

	// Watch start date to set minimum end date
	const startDate = watch("startDate");

	// Reset form after successful submission
	useEffect(() => {
		if (isSubmitSuccessful) {
			reset();
			setSelectedFile(null);
			setPreviewUrl(null);
		}
	}, [isSubmitSuccessful, reset]);

	// Set minimum end date based on start date
	useEffect(() => {
		if (startDate) {
			const startDateInput = document.querySelector(
				'input[name="endDate"]'
			) as HTMLInputElement;
			if (startDateInput) {
				startDateInput.min = startDate;
			}
		}
	}, [startDate]);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			// Validate file size (max 10MB)
			if (file.size > 10 * 1024 * 1024) {
				alert("File size must be less than 10MB");
				return;
			}

			setSelectedFile(file);
			setValue("file", file);

			// Create preview URL for images
			if (file.type.startsWith("image/")) {
				const url = URL.createObjectURL(file);
				setPreviewUrl(url);
			}
		}
	};

	const removeFile = () => {
		setSelectedFile(null);
		setPreviewUrl(null);
		setValue("file", undefined);
	};

	const handleUploadFile = async () => {
		if (!existingEvent || !selectedFile) return;

		try {
			await uploadFileMutation.mutateAsync({
				id: existingEvent._id,
				file: selectedFile,
			});
			setSelectedFile(null);
			setPreviewUrl(null);
		} catch (error) {
			// Error is handled by the mutation
		}
	};

	const handleRemoveExistingFile = async () => {
		if (!existingEvent || !existingEvent.agenda) return;

		if (window.confirm("Are you sure you want to remove this agenda file?")) {
			try {
				await removeFileMutation.mutateAsync(existingEvent._id);
			} catch (error) {
				// Error is handled by the mutation
			}
		}
	};

	const downloadFile = (url: string, filename: string) => {
		const link = document.createElement("a");
		link.href = url;
		link.download = filename;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const handleFormSubmit = async (data: CreateEventData | UpdateEventData) => {
		try {
			// Add the file to the data if it exists
			if (selectedFile) {
				data.file = selectedFile;
			}

			// Format dates for API if needed
			if (data.startDate) {
				data.startDate = new Date(data.startDate).toISOString();
			}
			if (data.endDate) {
				data.endDate = new Date(data.endDate).toISOString();
			}

			// Add createdBy field for create operations (when schema requires it)
			if (schema.fields?.createdBy && !(data as any).createdBy) {
				(data as any).createdBy = "64f1a51f238fa30123456789"; // This should come from auth context
			}

			await onSubmit(data);
		} catch (error) {
			// Don't reset form on error - let user fix the issues
		}
	};

	const eventTypeOptions = [
		{ value: "team-meeting", label: "Team Meeting" },
		{ value: "conference", label: "Conference" },
		{ value: "workshop", label: "Workshop" },
		{ value: "seminar", label: "Seminar" },
		{ value: "training", label: "Training" },
		{ value: "presentation", label: "Presentation" },
		{ value: "other", label: "Other" },
	];

	// Get minimum date for datetime inputs (current date and time)
	const getMinDateTime = () => {
		const now = new Date();
		return now.toISOString().slice(0, 16);
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6 }}
			className={`w-full ${className}`}>
			<form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-6'>
				{/* Title */}
				<div className='space-y-2'>
					<label
						className={`block text-sm font-medium transition-colors duration-300 ${
							theme === "dark" ? "text-slate-200" : "text-slate-700"
						}`}>
						Event Title
					</label>
					<input
						type='text'
						{...register("title")}
						className={`w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-sm font-medium backdrop-blur-sm ${
							theme === "dark"
								? "bg-slate-900/50 text-slate-100 border-slate-700 hover:border-slate-600 focus:ring-blue-400/20 placeholder-slate-400"
								: "bg-white/80 text-slate-900 border-slate-200 hover:border-slate-300 focus:ring-blue-500/20 placeholder-slate-500"
						} ${errors.title ? "border-red-400 focus:ring-red-400/20" : ""}`}
						placeholder='Enter event title'
					/>
					{errors.title && (
						<motion.div
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							className='flex items-center space-x-2 text-sm text-red-400'>
							<AlertCircle className='w-4 h-4 flex-shrink-0' />
							<span>{errors.title.message}</span>
						</motion.div>
					)}
				</div>

				{/* Description */}
				<div className='space-y-2'>
					<label
						className={`block text-sm font-medium transition-colors duration-300 ${
							theme === "dark" ? "text-slate-200" : "text-slate-700"
						}`}>
						Description
					</label>
					<textarea
						{...register("description")}
						rows={4}
						className={`w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-sm font-medium backdrop-blur-sm resize-none ${
							theme === "dark"
								? "bg-slate-900/50 text-slate-100 border-slate-700 hover:border-slate-600 focus:ring-blue-400/20 placeholder-slate-400"
								: "bg-white/80 text-slate-900 border-slate-200 hover:border-slate-300 focus:ring-blue-500/20 placeholder-slate-500"
						} ${
							errors.description ? "border-red-400 focus:ring-red-400/20" : ""
						}`}
						placeholder='Enter event description'
					/>
					{errors.description && (
						<motion.div
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							className='flex items-center space-x-2 text-sm text-red-400'>
							<AlertCircle className='w-4 h-4 flex-shrink-0' />
							<span>{errors.description.message}</span>
						</motion.div>
					)}
				</div>

				{/* Date and Time Row */}
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					{/* Start Date */}
					<div className='space-y-2'>
						<label
							className={`block text-sm font-medium transition-colors duration-300 ${
								theme === "dark" ? "text-slate-200" : "text-slate-700"
							}`}>
							Start Date & Time
						</label>
						<input
							type='datetime-local'
							{...register("startDate")}
							min={getMinDateTime()}
							className={`w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-sm font-medium backdrop-blur-sm ${
								theme === "dark"
									? "bg-slate-900/50 text-slate-100 border-slate-700 hover:border-slate-600 focus:ring-blue-400/20"
									: "bg-white/80 text-slate-900 border-slate-200 hover:border-slate-300 focus:ring-blue-500/20"
							} ${
								errors.startDate ? "border-red-400 focus:ring-red-400/20" : ""
							}`}
						/>
						{errors.startDate && (
							<motion.div
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								className='flex items-center space-x-2 text-sm text-red-400'>
								<AlertCircle className='w-4 h-4 flex-shrink-0' />
								<span>{errors.startDate.message}</span>
							</motion.div>
						)}
					</div>

					{/* End Date */}
					<div className='space-y-2'>
						<label
							className={`block text-sm font-medium transition-colors duration-300 ${
								theme === "dark" ? "text-slate-200" : "text-slate-700"
							}`}>
							End Date & Time
						</label>
						<input
							type='datetime-local'
							{...register("endDate")}
							min={startDate || getMinDateTime()}
							className={`w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-sm font-medium backdrop-blur-sm ${
								theme === "dark"
									? "bg-slate-900/50 text-slate-100 border-slate-700 hover:border-slate-600 focus:ring-blue-400/20"
									: "bg-white/80 text-slate-900 border-slate-200 hover:border-slate-300 focus:ring-blue-500/20"
							} ${
								errors.endDate ? "border-red-400 focus:ring-red-400/20" : ""
							}`}
						/>
						{errors.endDate && (
							<motion.div
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								className='flex items-center space-x-2 text-sm text-red-400'>
								<AlertCircle className='w-4 h-4 flex-shrink-0' />
								<span>{errors.endDate.message}</span>
							</motion.div>
						)}
					</div>
				</div>

				{/* Location and Event Type Row */}
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					{/* Location */}
					<div className='space-y-2'>
						<label
							className={`block text-sm font-medium transition-colors duration-300 ${
								theme === "dark" ? "text-slate-200" : "text-slate-700"
							}`}>
							Location
						</label>
						<input
							type='text'
							{...register("location")}
							className={`w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-sm font-medium backdrop-blur-sm ${
								theme === "dark"
									? "bg-slate-900/50 text-slate-100 border-slate-700 hover:border-slate-600 focus:ring-blue-400/20 placeholder-slate-400"
									: "bg-white/80 text-slate-900 border-slate-200 hover:border-slate-300 focus:ring-blue-500/20 placeholder-slate-500"
							} ${
								errors.location ? "border-red-400 focus:ring-red-400/20" : ""
							}`}
							placeholder='Enter event location'
						/>
						{errors.location && (
							<motion.div
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								className='flex items-center space-x-2 text-sm text-red-400'>
								<AlertCircle className='w-4 h-4 flex-shrink-0' />
								<span>{errors.location.message}</span>
							</motion.div>
						)}
					</div>

					{/* Event Type */}
					<div className='space-y-2'>
						<label
							className={`block text-sm font-medium transition-colors duration-300 ${
								theme === "dark" ? "text-slate-200" : "text-slate-700"
							}`}>
							Event Type
						</label>
						<select
							{...register("eventType")}
							className={`w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-sm font-medium backdrop-blur-sm ${
								theme === "dark"
									? "bg-slate-900/50 text-slate-100 border-slate-700 hover:border-slate-600 focus:ring-blue-400/20"
									: "bg-white/80 text-slate-900 border-slate-200 hover:border-slate-300 focus:ring-blue-500/20"
							} ${
								errors.eventType ? "border-red-400 focus:ring-red-400/20" : ""
							}`}>
							<option value=''>Select event type...</option>
							{eventTypeOptions.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</select>
						{errors.eventType && (
							<motion.div
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								className='flex items-center space-x-2 text-sm text-red-400'>
								<AlertCircle className='w-4 h-4 flex-shrink-0' />
								<span>{errors.eventType.message}</span>
							</motion.div>
						)}
					</div>
				</div>

				{/* File Upload */}
				<div className='space-y-2'>
					<label
						className={`block text-sm font-medium transition-colors duration-300 ${
							theme === "dark" ? "text-slate-200" : "text-slate-700"
						}`}>
						Event Agenda/File (Optional)
					</label>

					{!selectedFile ? (
						<div className='relative'>
							<input
								type='file'
								accept='image/*,.pdf,.doc,.docx'
								onChange={handleFileChange}
								className={`w-full px-4 py-3 border border-dashed rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium text-sm backdrop-blur-sm ${
									theme === "dark"
										? "bg-slate-900/50 text-slate-100 border-slate-700 hover:border-slate-600 focus:ring-blue-400/20 file:bg-slate-800/50 file:text-slate-200 hover:file:bg-slate-700/50"
										: "bg-white/80 text-slate-900 border-slate-200 hover:border-slate-300 focus:ring-blue-500/20 file:bg-slate-100/80 file:text-slate-700 hover:file:bg-slate-200/80"
								}`}
							/>
							<div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
								<Upload
									className={`w-6 h-6 ${
										theme === "dark" ? "text-slate-400" : "text-slate-500"
									}`}
								/>
							</div>
						</div>
					) : (
						<div
							className={`p-4 border rounded-2xl ${
								theme === "dark"
									? "bg-slate-800/50 border-slate-700"
									: "bg-slate-50/50 border-slate-200"
							}`}>
							<div className='flex items-center justify-between'>
								<div className='flex items-center space-x-3'>
									{previewUrl && (
										<img
											src={previewUrl}
											alt='Preview'
											className='w-12 h-12 object-cover rounded-lg'
										/>
									)}
									<div>
										<p
											className={`text-sm font-medium ${
												theme === "dark" ? "text-slate-200" : "text-slate-700"
											}`}>
											{selectedFile.name}
										</p>
										<p
											className={`text-xs ${
												theme === "dark" ? "text-slate-400" : "text-slate-500"
											}`}>
											{(selectedFile.size / 1024 / 1024).toFixed(2)} MB
										</p>
									</div>
								</div>
								<button
									type='button'
									onClick={removeFile}
									className={`p-1 rounded-lg transition-colors duration-200 ${
										theme === "dark"
											? "text-slate-400 hover:text-slate-300 hover:bg-slate-700/50"
											: "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
									}`}>
									<X className='w-4 h-4' />
								</button>
							</div>
						</div>
					)}

					{/* Upload Button for Existing Events */}
					{existingEvent && selectedFile && (
						<motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							type='button'
							onClick={handleUploadFile}
							disabled={uploadFileMutation.isPending}
							className={`w-full font-semibold py-3 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm backdrop-blur-sm ${
								theme === "dark"
									? "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 active:from-green-800 active:to-emerald-800"
									: "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 active:from-green-700 active:to-emerald-700"
							} ${uploadFileMutation.isPending ? "animate-pulse" : ""}`}>
							{uploadFileMutation.isPending ? (
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
									<span>Uploading...</span>
								</div>
							) : (
								"Upload File"
							)}
						</motion.button>
					)}
				</div>

				{/* Existing Agenda Files */}
				{existingEvent && existingEvent.agenda && (
					<div className='space-y-2'>
						<label
							className={`block text-sm font-medium transition-colors duration-300 ${
								theme === "dark" ? "text-slate-200" : "text-slate-700"
							}`}>
							Existing Agenda File
						</label>
						<div
							className={`p-4 border rounded-2xl ${
								theme === "dark"
									? "bg-slate-800/50 border-slate-700"
									: "bg-slate-50/50 border-slate-200"
							}`}>
							<div className='flex items-center justify-between'>
								<div className='flex items-center space-x-3'>
									<FileText
										className={`w-5 h-5 ${
											theme === "dark" ? "text-slate-400" : "text-slate-500"
										}`}
									/>
									<div>
										<p
											className={`text-sm font-medium ${
												theme === "dark" ? "text-slate-200" : "text-slate-700"
											}`}>
											Agenda File
										</p>
										<p
											className={`text-xs ${
												theme === "dark" ? "text-slate-400" : "text-slate-500"
											}`}>
											Uploaded with event
										</p>
									</div>
								</div>
								<div className='flex items-center space-x-2'>
									<button
										type='button'
										onClick={() =>
											downloadFile(existingEvent.agenda!, "agenda")
										}
										className={`p-2 rounded-lg transition-colors duration-200 ${
											theme === "dark"
												? "hover:bg-gray-700 text-gray-400 hover:text-white"
												: "hover:bg-gray-200 text-gray-600 hover:text-black"
										}`}
										title='Download Agenda'>
										<Download size={16} />
									</button>
									<button
										type='button'
										onClick={handleRemoveExistingFile}
										className={`p-2 rounded-lg transition-colors duration-200 ${
											theme === "dark"
												? "hover:bg-red-900/30 text-red-400 hover:text-red-300"
												: "hover:bg-red-50 text-red-600 hover:text-red-700"
										}`}
										title='Remove Agenda'>
										<Trash2 size={16} />
									</button>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Submit Button */}
				<motion.button
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					type='submit'
					disabled={isSubmitting}
					onClick={() => {
						// Submit button clicked
					}}
					className={`w-full font-semibold py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm backdrop-blur-sm ${
						theme === "dark"
							? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 active:from-blue-800 active:to-purple-800"
							: "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 active:from-blue-700 active:to-purple-700"
					} ${isSubmitting ? "animate-pulse" : ""}`}>
					{isSubmitting ? (
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
							<span>Processing...</span>
						</div>
					) : (
						submitButtonText
					)}
				</motion.button>
			</form>
		</motion.div>
	);
};
