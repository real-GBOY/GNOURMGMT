/** @format */

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
	CheckSquare,
	Plus,
	Edit,
	Trash2,
	Search,
	Calendar,
	Eye,
	FileText,
	Upload,
	X,
	MessageCircle,
	Users,
} from "lucide-react";
import { useTheme } from "../../../shared/contexts/ThemeContext";
import { useAuth } from "../../../shared/contexts/AuthContext";

import {
	useTasks,
	useCreateTask,
	useUpdateTask,
	useDeleteTask,
	useUploadFileToTask,
} from "../../../shared/services/taskService";

import { TaskForm } from "../../../shared/components/Form/TaskForm";
import Modal from "../../../shared/components/Modal";
import { UpdateTaskData, Task } from "../../../shared/types/Task";
import PermissionGate from "../../../shared/Secure/PermissionGate";
import Permissions from "../../../shared/config/Permissions";
import { useNavigate } from "react-router-dom";

const Tasks: React.FC = () => {
	const { theme } = useTheme();
	const { user } = useAuth();
	const navigate = useNavigate();
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedTask, setSelectedTask] = useState<Task | null>(null);
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [showFileUploadModal, setShowFileUploadModal] = useState(false);
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

	// React Query hooks
	const { data: tasks, isLoading, error } = useTasks();
	const createTaskMutation = useCreateTask();
	const updateTaskMutation = useUpdateTask();
	const deleteTaskMutation = useDeleteTask();
	const uploadFileMutation = useUploadFileToTask();

	// Filter tasks based on search term
	const filteredTasks = (tasks || []).filter(
		(task) =>
			task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
			task.whatAppGroup.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const getStatusColor = (status: string) => {
		switch (status) {
			case "pending":
				return theme === "dark"
					? "bg-yellow-600/20 text-yellow-400"
					: "bg-yellow-100 text-yellow-800";
			case "in_progress":
				return theme === "dark"
					? "bg-blue-600/20 text-blue-400"
					: "bg-blue-100 text-blue-800";
			case "completed":
				return theme === "dark"
					? "bg-green-600/20 text-green-400"
					: "bg-green-100 text-green-800";
			case "cancelled":
				return theme === "dark"
					? "bg-red-600/20 text-red-400"
					: "bg-red-100 text-red-800";
			default:
				return theme === "dark"
					? "bg-gray-600/20 text-gray-400"
					: "bg-gray-100 text-gray-800";
		}
	};

	const handleCreateTask = async (data: {
		title: string;
		description: string;
		dueDate: string;
		whatAppGroup?: string;
		files?: File[];
		userId?: string;
	}) => {
		try {
			// Ensure userId is included in the data
			const taskData = {
				...data,
				userId: user?.id,
			};
			await createTaskMutation.mutateAsync(taskData);
			setShowCreateModal(false);
		} catch {
			// Error is handled by the mutation
		}
	};

	const handleUpdateTask = async (data: UpdateTaskData) => {
		if (!selectedTask) return;

		try {
			await updateTaskMutation.mutateAsync({ id: selectedTask._id, data });
			setShowEditModal(false);
			setSelectedTask(null);
		} catch {
			// Error is handled by the mutation
		}
	};

	const handleDeleteTask = async (taskId: string) => {
		if (window.confirm("Are you sure you want to delete this task?")) {
			try {
				await deleteTaskMutation.mutateAsync(taskId);
			} catch {
				// Error is handled by the mutation
			}
		}
	};

	const handleFileUpload = async () => {
		if (!selectedTask || selectedFiles.length === 0) return;

		try {
			// Upload each file
			for (const file of selectedFiles) {
				await uploadFileMutation.mutateAsync({
					id: selectedTask._id,
					file: file,
				});
			}
			setShowFileUploadModal(false);
			setSelectedFiles([]);
			setSelectedTask(null);
		} catch {
			// Error is handled by the mutation
		}
	};

	const openEditModal = (task: Task) => {
		setSelectedTask(task);
		setShowEditModal(true);
	};

	const openFileUploadModal = (task: Task) => {
		setSelectedTask(task);
		setShowFileUploadModal(true);
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || []);
		if (files.length > 0) {
			setSelectedFiles(files);
		}
	};

	if (isLoading) {
		return (
			<div className='flex items-center justify-center h-64'>
				<div className='text-lg'>Loading tasks...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='flex items-center justify-center h-64'>
				<div className='text-red-500'>
					Error loading tasks:{" "}
					{(error as { message?: string })?.message || "Unknown error"}
				</div>
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
				<div>
					<h1
						className={`text-2xl sm:text-3xl font-bold transition-colors duration-300 ${
							theme === "dark" ? "text-white" : "text-black"
						}`}>
						Tasks
					</h1>
					<p
						className={`mt-2 text-base sm:text-lg transition-colors duration-300 ${
							theme === "dark" ? "text-gray-400" : "text-gray-600"
						}`}>
						Manage your organization's tasks and assignments
					</p>
				</div>

				<PermissionGate permission={Permissions.CreateTask}>
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={() => setShowCreateModal(true)}
						className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 ${
							theme === "dark"
								? "bg-blue-600 hover:bg-blue-700 text-white"
								: "bg-blue-600 hover:bg-blue-700 text-white"
						}`}>
						<Plus size={20} className='mr-2' />
						<span className='hidden sm:inline'>Create Task</span>
						<span className='sm:hidden'>Add</span>
					</motion.button>
				</PermissionGate>
			</motion.div>

			{/* Search Bar */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.1 }}
				className={`relative ${
					theme === "dark" ? "text-white" : "text-black"
				}`}>
				<Search
					className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
					size={20}
				/>
				<input
					type='text'
					placeholder='Search tasks...'
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className={`w-full pl-10 pr-4 py-2 sm:py-3 rounded-lg border transition-colors duration-300 text-sm sm:text-base ${
						theme === "dark"
							? "bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
							: "bg-white border-gray-300 text-black placeholder-gray-500 focus:border-blue-500"
					}`}
				/>
			</motion.div>

			{/* Tasks Grid */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.2 }}
				className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-6'>
				{filteredTasks.map((task, index) => (
					<motion.div
						key={task._id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.1 * index }}
						className={`group relative flex flex-col h-full min-w-[320px] max-w-2xl w-full p-5 sm:p-6 rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${
							theme === "dark"
								? "bg-gray-900/60 backdrop-blur-xl border border-gray-800/50 shadow-xl hover:border-gray-700/50"
								: "bg-white/60 backdrop-blur-xl border border-gray-200/50 shadow-xl hover:border-gray-300/50"
						}`}>
						{/* Header Section */}
						<div className='flex items-start justify-between mb-4'>
							<div className='flex items-center space-x-3 flex-1 min-w-0'>
								<div
									className={`p-2.5 rounded-lg flex-shrink-0 ${
										theme === "dark" ? "bg-blue-600/20" : "bg-blue-100"
									}`}>
									<CheckSquare
										className={`w-5 h-5 ${
											theme === "dark" ? "text-blue-400" : "text-blue-600"
										}`}
									/>
								</div>
								<div className='min-w-0 flex-1'>
									<h3
										className={`font-semibold text-sm sm:text-base transition-colors duration-300 break-words line-clamp-2 ${
											theme === "dark" ? "text-white" : "text-black"
										}`}
										title={task.title}>
										{task.title}
									</h3>
									<div className='flex items-center space-x-2 mt-2'>
										<span
											className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
												task.status
											)}`}>
											{task.status.replace("_", " ")}
										</span>
									</div>
								</div>
							</div>

							{/* Action Buttons */}
							<div className='flex items-center space-x-1 flex-shrink-0'>
								<button
									onClick={() => navigate(`/dashboard/tasks/${task._id}`)}
									className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
										theme === "dark"
											? "hover:bg-gray-800 text-gray-400 hover:text-white"
											: "hover:bg-gray-100 text-gray-600 hover:text-black"
									}`}
									title='View Details'>
									<Eye size={16} />
								</button>
								<PermissionGate permission={Permissions.EditTask}>
									<button
										onClick={() => openEditModal(task)}
										className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
											theme === "dark"
												? "hover:bg-gray-800 text-gray-400 hover:text-white"
												: "hover:bg-gray-100 text-gray-600 hover:text-black"
										}`}
										title='Edit Task'>
										<Edit size={16} />
									</button>
								</PermissionGate>
								<PermissionGate permission={Permissions.UploadFile}>
									<button
										onClick={() => openFileUploadModal(task)}
										className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
											theme === "dark"
												? "hover:bg-gray-800 text-gray-400 hover:text-white"
												: "hover:bg-gray-100 text-gray-600 hover:text-black"
										}`}
										title='Upload Files'>
										<Upload size={16} />
									</button>
								</PermissionGate>
								<PermissionGate permission={Permissions.DeleteTask}>
									<button
										onClick={() => handleDeleteTask(task._id)}
										className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
											theme === "dark"
												? "hover:bg-red-900/30 text-red-400 hover:text-red-300"
												: "hover:bg-red-50 text-red-600 hover:text-red-700"
										}`}
										title='Delete Task'>
										<Trash2 size={16} />
									</button>
								</PermissionGate>
							</div>
						</div>

						{/* Description */}
						<div className='flex-1 mb-4'>
							<p
								className={`text-sm leading-relaxed transition-colors duration-300 line-clamp-3 break-words ${
									theme === "dark" ? "text-gray-300" : "text-gray-700"
								}`}>
								{task.description}
							</p>
						</div>

						{/* Task Details Grid */}
						<div className='grid grid-cols-2 gap-3 mb-4'>
							{/* Due Date */}
							<div className='flex items-center space-x-2 text-xs'>
								<Calendar
									size={14}
									className={`flex-shrink-0 ${
										theme === "dark" ? "text-gray-400" : "text-gray-500"
									}`}
								/>
								<div className='min-w-0'>
									<div
										className={`font-medium transition-colors duration-300 ${
											theme === "dark" ? "text-gray-300" : "text-gray-700"
										}`}>
										Due Date
									</div>
									<div
										className={`transition-colors duration-300 truncate ${
											theme === "dark" ? "text-gray-400" : "text-gray-500"
										}`}>
										{new Date(task.dueDate).toLocaleDateString()}
									</div>
								</div>
							</div>

							{/* Attachments */}
							<div className='flex items-center space-x-2 text-xs'>
								<FileText
									size={14}
									className={`flex-shrink-0 ${
										theme === "dark" ? "text-gray-400" : "text-gray-500"
									}`}
								/>
								<div className='min-w-0'>
									<div
										className={`font-medium transition-colors duration-300 ${
											theme === "dark" ? "text-gray-300" : "text-gray-700"
										}`}>
										Attachments
									</div>
									<div
										className={`transition-colors duration-300 ${
											theme === "dark" ? "text-gray-400" : "text-gray-500"
										}`}>
										{task.attachments.length} file
										{task.attachments.length !== 1 ? "s" : ""}
									</div>
								</div>
							</div>
						</div>

						{/* Assigned Users */}
						{task.assignedTo && task.assignedTo.length > 0 && (
							<div className='mb-4'>
								<div className='flex items-center space-x-2 mb-2'>
									<Users
										size={14}
										className={`flex-shrink-0 ${
											theme === "dark" ? "text-gray-400" : "text-gray-500"
										}`}
									/>
									<span
										className={`text-xs font-medium transition-colors duration-300 ${
											theme === "dark" ? "text-gray-300" : "text-gray-700"
										}`}>
										Assigned ({task.assignedTo.length})
									</span>
								</div>
								<div className='flex flex-wrap gap-1'>
									{task.assignedTo.slice(0, 3).map((user) => {
										if (
											user &&
											typeof user === "object" &&
											"firstName" in user &&
											"lastName" in user &&
											user.firstName &&
											user.lastName
										) {
											return (
												<div
													key={user._id}
													className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
														theme === "dark" ? "bg-gray-800" : "bg-gray-100"
													}`}>
													{user.profilePicture ? (
														<img
															src={user.profilePicture}
															alt={`${user.firstName} ${user.lastName}`}
															className='w-4 h-4 rounded-full object-cover'
														/>
													) : (
														<div
															className={`w-4 h-4 rounded-full flex items-center justify-center text-xs font-medium ${
																theme === "dark"
																	? "bg-gray-700 text-gray-300"
																	: "bg-gray-200 text-gray-700"
															}`}>
															{user.firstName.charAt(0)}
															{user.lastName.charAt(0)}
														</div>
													)}
													<span
														className={`transition-colors duration-300 ${
															theme === "dark"
																? "text-gray-300"
																: "text-gray-700"
														}`}>
														{user.firstName} {user.lastName}
													</span>
												</div>
											);
										} else {
											// fallback for missing user data or string id
											return (
												<div
													key={
														typeof user === "object" && user && "_id" in user
															? user._id
															: String(user)
													}
													className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
														theme === "dark" ? "bg-gray-800" : "bg-gray-100"
													}`}>
													<div
														className={`w-4 h-4 rounded-full flex items-center justify-center text-xs font-medium ${
															theme === "dark"
																? "bg-gray-700 text-gray-300"
																: "bg-gray-200 text-gray-700"
														}`}>
														??
													</div>
													<span
														className={`transition-colors duration-300 ${
															theme === "dark"
																? "text-gray-300"
																: "text-gray-700"
														}`}>
														Unknown
													</span>
												</div>
											);
										}
									})}
									{task.assignedTo.length > 3 && (
										<div
											className={`px-2 py-1 rounded-full text-xs ${
												theme === "dark"
													? "bg-gray-800 text-gray-400"
													: "bg-gray-100 text-gray-600"
											}`}>
											+{task.assignedTo.length - 3} more
										</div>
									)}
								</div>
							</div>
						)}

						{/* Footer with WhatsApp Group */}
						<div className='mt-auto pt-3 border-t border-gray-200 dark:border-gray-700'>
							<div className='flex items-center justify-between'>
								<div className='flex items-center space-x-2 text-xs'>
									<MessageCircle
										size={14}
										className={`flex-shrink-0 ${
											theme === "dark" ? "text-gray-400" : "text-gray-500"
										}`}
									/>
									<span
										className={`transition-colors duration-300 truncate ${
											theme === "dark" ? "text-gray-400" : "text-gray-500"
										}`}>
										{task.whatAppGroup}
									</span>
								</div>

								{/* Created Date */}
								<div className='text-xs'>
									<span
										className={`transition-colors duration-300 ${
											theme === "dark" ? "text-gray-400" : "text-gray-500"
										}`}>
										{new Date(task.createdAt).toLocaleDateString()}
									</span>
								</div>
							</div>
						</div>
					</motion.div>
				))}
			</motion.div>

			{/* Empty State */}
			{filteredTasks.length === 0 && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className='text-center py-12'>
					<CheckSquare
						className={`w-16 h-16 mx-auto mb-4 ${
							theme === "dark" ? "text-gray-600" : "text-gray-400"
						}`}
					/>
					<h3
						className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
							theme === "dark" ? "text-white" : "text-black"
						}`}>
						No tasks found
					</h3>
					<p
						className={`transition-colors duration-300 ${
							theme === "dark" ? "text-gray-400" : "text-gray-600"
						}`}>
						{searchTerm
							? "Try adjusting your search terms"
							: "Get started by creating your first task"}
					</p>
				</motion.div>
			)}

			{/* Create Task Modal */}
			<Modal
				isOpen={showCreateModal}
				onClose={() => setShowCreateModal(false)}
				title='Create New Task'
				size='full'>
				<TaskForm
					mode='create'
					onSubmit={handleCreateTask}
					onCancel={() => setShowCreateModal(false)}
					isSubmitting={createTaskMutation.isPending}
				/>
			</Modal>

			{/* Edit Task Modal */}
			<Modal
				isOpen={showEditModal}
				onClose={() => setShowEditModal(false)}
				title='Edit Task'
				size='full'>
				{selectedTask && (
					<TaskForm
						mode='edit'
						onSubmit={handleUpdateTask}
						onCancel={() => setShowEditModal(false)}
						defaultValues={selectedTask}
						isSubmitting={updateTaskMutation.isPending}
					/>
				)}
			</Modal>

			{/* File Upload Modal */}
			<Modal
				isOpen={showFileUploadModal}
				onClose={() => setShowFileUploadModal(false)}
				title='Upload File to Task'
				size='md'>
				{selectedTask && (
					<div className='space-y-4'>
						<div>
							<label
								className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
									theme === "dark" ? "text-white" : "text-black"
								}`}>
								Select File
							</label>
							<input
								type='file'
								onChange={handleFileChange}
								className={`w-full p-2 border rounded-lg transition-colors duration-300 ${
									theme === "dark"
										? "bg-gray-800 border-gray-700 text-white"
										: "bg-white border-gray-300 text-black"
								}`}
							/>
						</div>

						{selectedFiles.length > 0 && (
							<div className='space-y-2'>
								{selectedFiles.map((file, index) => (
									<div
										key={index}
										className={`p-3 rounded-lg ${
											theme === "dark" ? "bg-gray-800" : "bg-gray-100"
										}`}>
										<div className='flex items-center justify-between'>
											<span
												className={`text-sm transition-colors duration-300 ${
													theme === "dark" ? "text-white" : "text-black"
												}`}>
												{file.name}
											</span>
											<button
												onClick={() => {
													const newFiles = selectedFiles.filter(
														(_, i) => i !== index
													);
													setSelectedFiles(newFiles);
												}}
												className='text-red-500 hover:text-red-700'>
												<X size={16} />
											</button>
										</div>
									</div>
								))}
							</div>
						)}

						<div className='flex space-x-3 mt-6'>
							<button
								onClick={handleFileUpload}
								disabled={
									selectedFiles.length === 0 || uploadFileMutation.isPending
								}
								className={`flex-1 py-2 px-4 rounded-lg transition-colors duration-300 ${
									selectedFiles.length === 0 || uploadFileMutation.isPending
										? "bg-gray-400 cursor-not-allowed"
										: "bg-blue-600 hover:bg-blue-700 text-white"
								}`}>
								{uploadFileMutation.isPending ? "Uploading..." : "Upload Files"}
							</button>
							<button
								onClick={() => setShowFileUploadModal(false)}
								className={`flex-1 py-2 px-4 rounded-lg transition-colors duration-300 ${
									theme === "dark"
										? "bg-gray-800 hover:bg-gray-700 text-white"
										: "bg-gray-200 hover:bg-gray-300 text-black"
								}`}>
								Cancel
							</button>
						</div>
					</div>
				)}
			</Modal>
		</div>
	);
};

export default Tasks;
