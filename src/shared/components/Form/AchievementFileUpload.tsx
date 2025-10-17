/** @format */

import React, { useState, useRef } from "react";
import { Upload, X, FileText, Image, File } from "lucide-react";
import { Button } from "../Button";

interface FileUploadProps {
	fileType: "certificate";
	onFileSelect: (file: File, description?: string) => void;
	onFileRemove: () => void;
	selectedFile?: File | null;
	description?: string;
	maxSize?: number; // in MB
	acceptedTypes?: string[];
	className?: string;
}

export const AchievementFileUpload: React.FC<FileUploadProps> = ({
	fileType,
	onFileSelect,
	onFileRemove,
	selectedFile,
	description,
	maxSize = 10, // 10MB default
	acceptedTypes,
	className = "",
}) => {
	const [dragActive, setDragActive] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Default accepted types for certificate files
	const getDefaultAcceptedTypes = () => {
		return ".pdf,.doc,.docx,.jpg,.jpeg,.png";
	};

	const acceptedFileTypes = acceptedTypes || getDefaultAcceptedTypes();

	const validateFile = (file: File): boolean => {
		setError(null);

		// Check file size
		if (file.size > maxSize * 1024 * 1024) {
			setError(`File size must be less than ${maxSize}MB`);
			return false;
		}

		// Check file type
		const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
		if (!acceptedFileTypes.includes(fileExtension)) {
			setError(`File type not supported. Accepted: ${acceptedFileTypes}`);
			return false;
		}

		return true;
	};

	const handleFileSelect = (file: File) => {
		if (validateFile(file)) {
			onFileSelect(file, description);
		}
	};

	const handleDrag = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.type === "dragenter" || e.type === "dragover") {
			setDragActive(true);
		} else if (e.type === "dragleave") {
			setDragActive(false);
		}
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);

		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			handleFileSelect(e.dataTransfer.files[0]);
		}
	};

	const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			handleFileSelect(e.target.files[0]);
		}
	};

	const getFileIcon = () => {
		if (!selectedFile) return <Upload className='w-8 h-8' />;

		const fileName = selectedFile.name.toLowerCase();
		if (fileName.includes(".pdf") || fileName.includes(".doc")) {
			return <FileText className='w-8 h-8' />;
		} else if (
			fileName.includes(".jpg") ||
			fileName.includes(".png") ||
			fileName.includes(".gif")
		) {
			return <Image className='w-8 h-8' />;
		} else {
			return <File className='w-8 h-8' />;
		}
	};

	const getFileTypeLabel = () => {
		return "Certificate File";
	};

	return (
		<div className={`achievement-file-upload ${className}`}>
			<div className='mb-2'>
				<label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
					{getFileTypeLabel()}
				</label>
			</div>

			{!selectedFile ? (
				<div
					className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
						dragActive
							? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
							: "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
					}`}
					onDragEnter={handleDrag}
					onDragLeave={handleDrag}
					onDragOver={handleDrag}
					onDrop={handleDrop}>
					<div className='flex flex-col items-center space-y-2'>
						{getFileIcon()}
						<div className='text-sm text-gray-600 dark:text-gray-400'>
							<span className='font-medium'>Click to upload</span> or drag and
							drop
						</div>
						<div className='text-xs text-gray-500 dark:text-gray-500'>
							{acceptedFileTypes} (max {maxSize}MB)
						</div>
						<Button
							type='button'
							variant='outline'
							size='sm'
							onClick={() => fileInputRef.current?.click()}>
							Choose File
						</Button>
					</div>
				</div>
			) : (
				<div className='border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-800'>
					<div className='flex items-center justify-between'>
						<div className='flex items-center space-x-3'>
							{getFileIcon()}
							<div>
								<div className='font-medium text-sm text-gray-900 dark:text-white'>
									{selectedFile.name}
								</div>
								<div className='text-xs text-gray-500 dark:text-gray-400'>
									{(selectedFile.size / 1024 / 1024).toFixed(2)} MB
								</div>
							</div>
						</div>
						<Button
							type='button'
							variant='ghost'
							size='sm'
							onClick={onFileRemove}
							className='text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20'>
							<X className='w-4 h-4' />
						</Button>
					</div>
				</div>
			)}

			{error && (
				<div className='mt-2 text-sm text-red-600 dark:text-red-400'>
					{error}
				</div>
			)}

			<input
				ref={fileInputRef}
				type='file'
				accept={acceptedFileTypes as string}
				onChange={handleFileInput}
				className='hidden'
			/>
		</div>
	);
};
