/** @format */

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Upload, X, FileText } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { GenericForm } from "./GenericForm";
import { taskSchema, updateTaskSchema } from "../../schemas/TaskSchema";
import { Task } from "../../types/Task";

interface TaskFormProps {
	mode: "create" | "edit";
	onSubmit: (data: any) => void | Promise<void>;
	onCancel: () => void;
	defaultValues?: Partial<Task>;
	isSubmitting?: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({
	mode,
	onSubmit,
	onCancel,
	defaultValues,
	isSubmitting = false,
}) => {
	const { theme } = useTheme();
	const { user } = useAuth();
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || []);
		setSelectedFiles(files);
	};

	const handleRemoveFile = (index: number) => {
		setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
	};

	const handleFormSubmit = (data: any) => {
		const formData = {
			...data,
			files: selectedFiles.length > 0 ? selectedFiles : undefined,
			userId: user?.id, // Include user ID from auth context
		};
		onSubmit(formData);
	};

	const formatFileSize = (bytes: number): string => {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
	};

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.3 }}
			className={`w-full max-w-2xl mx-auto p-8 rounded-3xl backdrop-blur-xl shadow-2xl ${
				theme === "dark"
					? "bg-gradient-to-br from-gray-900/90 to-gray-800/90 border border-gray-700/50 shadow-black/30"
					: "bg-gradient-to-br from-white/90 to-gray-50/90 border border-gray-200/50 shadow-gray-900/10"
			}`}>
			{/* Header */}
			<div className='mb-6'>
				<h2
					className={`text-2xl font-bold mb-2 transition-colors duration-300 ${
						theme === "dark" ? "text-white" : "text-gray-900"
					}`}>
					{mode === "create" ? "Create New Task" : "Edit Task"}
				</h2>
				<p
					className={`text-sm transition-colors duration-300 ${
						theme === "dark" ? "text-gray-400" : "text-gray-600"
					}`}>
					{mode === "create"
						? "Add a new task with all necessary details and attachments"
						: "Update task information and attachments"}
				</p>
			</div>

			{/* File Upload Section */}
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3, delay: 0.1 }}
				className='mb-6'>
				<label
					className={`block text-sm font-medium mb-3 transition-colors duration-300 ${
						theme === "dark" ? "text-white" : "text-gray-700"
					}`}>
					Attach Files (Optional)
				</label>

				{/* File Upload Area */}
				<div
					className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 backdrop-blur-sm ${
						theme === "dark"
							? "border-gray-600/50 hover:border-blue-400/50 bg-gray-800/40 hover:bg-gray-700/50"
							: "border-gray-300/50 hover:border-blue-400/50 bg-white/40 hover:bg-blue-50/30"
					} hover:scale-[1.02] hover:shadow-lg`}>
					<input
						type='file'
						multiple
						onChange={handleFileChange}
						className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
						accept='*/*'
					/>
					<div className='space-y-3'>
						<Upload
							className={`w-8 h-8 mx-auto ${
								theme === "dark" ? "text-gray-400" : "text-gray-500"
							}`}
						/>
						<div>
							<p
								className={`font-medium transition-colors duration-300 ${
									theme === "dark" ? "text-white" : "text-gray-900"
								}`}>
								Drop files here or click to browse
							</p>
							<p
								className={`text-sm mt-1 transition-colors duration-300 ${
									theme === "dark" ? "text-gray-400" : "text-gray-600"
								}`}>
								Support for all file types, max 10MB per file
							</p>
						</div>
					</div>
				</div>

				{/* Selected Files List */}
				{selectedFiles.length > 0 && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						className='mt-4 space-y-2'>
						<h4
							className={`text-sm font-medium transition-colors duration-300 ${
								theme === "dark" ? "text-white" : "text-gray-700"
							}`}>
							Selected Files ({selectedFiles.length})
						</h4>
						{selectedFiles.map((file, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, x: -10 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.2, delay: index * 0.1 }}
								className={`flex items-center justify-between p-4 rounded-xl backdrop-blur-sm border transition-all duration-300 hover:scale-[1.02] ${
									theme === "dark"
										? "bg-gray-800/60 border-gray-700/50 hover:bg-gray-700/70"
										: "bg-white/60 border-gray-200/50 hover:bg-gray-50/80"
								}`}>
								<div className='flex items-center space-x-3 flex-1 min-w-0'>
									<FileText
										className={`w-5 h-5 flex-shrink-0 ${
											theme === "dark" ? "text-blue-400" : "text-blue-600"
										}`}
									/>
									<div className='flex-1 min-w-0'>
										<p
											className={`text-sm font-medium truncate transition-colors duration-300 ${
												theme === "dark" ? "text-white" : "text-gray-900"
											}`}>
											{file.name}
										</p>
										<p
											className={`text-xs transition-colors duration-300 ${
												theme === "dark" ? "text-gray-400" : "text-gray-600"
											}`}>
											{formatFileSize(file.size)}
										</p>
									</div>
								</div>
								<button
									onClick={() => handleRemoveFile(index)}
									className={`p-1 rounded-lg transition-colors duration-300 ${
										theme === "dark"
											? "text-red-400 hover:text-red-300 hover:bg-red-900/30"
											: "text-red-600 hover:text-red-700 hover:bg-red-50"
									}`}>
									<X size={16} />
								</button>
							</motion.div>
						))}
					</motion.div>
				)}
			</motion.div>

			{/* Task Form Fields */}
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3, delay: 0.2 }}>
				<GenericForm
					schema={mode === "create" ? taskSchema : updateTaskSchema}
					onSubmit={handleFormSubmit}
					submitButtonText={
						isSubmitting
							? mode === "create"
								? "Creating Task..."
								: "Updating Task..."
							: mode === "create"
							? "Create Task"
							: "Update Task"
					}
					defaultValues={
						mode === "edit" && defaultValues
							? {
									title: defaultValues.title,
									description: defaultValues.description,
									dueDate: defaultValues.dueDate?.split("T")[0] || "",
									whatAppGroup: defaultValues.whatAppGroup,
							  }
							: undefined
					}
					className='space-y-6'
				/>
			</motion.div>

			{/* Action Buttons */}
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3, delay: 0.3 }}
				className='flex space-x-3 mt-6'>
				<button
					onClick={onCancel}
					className={`flex-1 py-4 px-6 rounded-2xl font-semibold transition-all duration-300 backdrop-blur-sm border hover:scale-[1.02] hover:shadow-lg ${
						theme === "dark"
							? "bg-gray-800/70 hover:bg-gray-700/80 text-white border-gray-600/50 hover:border-gray-500/70"
							: "bg-gray-100/70 hover:bg-gray-200/80 text-gray-900 border-gray-300/50 hover:border-gray-400/70"
					}`}>
					Cancel
				</button>
			</motion.div>
		</motion.div>
	);
};
