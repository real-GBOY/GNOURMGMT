/** @format */

import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
	Edit,
	Trash2,
	Calendar,
	Users,
	FileText,
	Download,
	X,
	Upload,
	ArrowLeft,
	Clock,
	MessageCircle,
	MessageSquare,
	UserPlus,
	Check,
	Search,
	CheckSquare,
} from "lucide-react";
import { useTheme } from "../../../shared/contexts/ThemeContext";
import {
	useTask,
	useUpdateTask,
	useDeleteTask,
	useUploadFileToTask,
	useRemoveFileFromTask,
} from "../../../shared/services/taskService";
import {
	useUsers,
	useUpdateTaskAssignment,
} from "../../../shared/services/userService";
import { GenericForm } from "../../../shared/components/Form/GenericForm";
import Modal from "../../../shared/components/Modal";
import { updateTaskSchema } from "../../../shared/schemas/TaskSchema";
import { UpdateTaskData } from "../../../shared/types/Task";
import PermissionGate from "../../../shared/Secure/PermissionGate";
import Permissions from "../../../shared/config/Permissions";
import FeedbackSection from "../../../shared/components/Feedback/FeedbackSection";

const TaskDetail: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const { theme } = useTheme();
	const [showEditModal, setShowEditModal] = useState(false);
	const [showFileUploadModal, setShowFileUploadModal] = useState(false);
	const [showAssignmentModal, setShowAssignmentModal] = useState(false);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
	const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
	const [showFeedbackModal, setShowFeedbackModal] = useState(false);

	// React Query hooks
	const { data: task, isLoading, error } = useTask(id!);
	const { data: users, isLoading: usersLoading } = useUsers();
	const updateTaskMutation = useUpdateTask();
	const deleteTaskMutation = useDeleteTask();
	const uploadFileMutation = useUploadFileToTask();
	const removeFileMutation = useRemoveFileFromTask();
	const updateAssignmentMutation = useUpdateTaskAssignment();

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

	const handleUpdateTask = async (data: UpdateTaskData) => {
		if (!task) return;

		try {
			await updateTaskMutation.mutateAsync({ id: task._id, data });
			setShowEditModal(false);
		} catch {
			// Error is handled by the mutation
		}
	};

	const handleDeleteTask = async () => {
		if (!task) return;

		if (window.confirm("Are you sure you want to delete this task?")) {
			try {
				await deleteTaskMutation.mutateAsync(task._id);
				navigate("/dashboard/tasks");
			} catch {
				// Error is handled by the mutation
			}
		}
	};

	const handleFileUpload = async () => {
		if (!task || !selectedFile) return;

		try {
			await uploadFileMutation.mutateAsync({
				id: task._id,
				file: selectedFile,
			});
			setShowFileUploadModal(false);
			setSelectedFile(null);
		} catch {
			// Error is handled by the mutation
		}
	};

	const handleRemoveFile = async (fileId: string) => {
		if (!task) return;

		if (window.confirm("Are you sure you want to remove this file?")) {
			try {
				await removeFileMutation.mutateAsync({ id: task._id, fileId });
			} catch {
				// Error is handled by the mutation
			}
		}
	};

	const handleAssignmentUpdate = async () => {
		if (!task) return;

		try {
			await updateAssignmentMutation.mutateAsync({
				taskId: task._id,
				userIds: selectedUsers,
			});
			setShowAssignmentModal(false);
			setSelectedUsers([]);
		} catch {
			// Error is handled by the mutation
		}
	};

	const handleUserToggle = (userId: string) => {
		setSelectedUsers((prev) =>
			prev.includes(userId)
				? prev.filter((id) => id !== userId)
				: [...prev, userId]
		);
	};

	const filteredUsers =
		users?.filter(
			(user) =>
				user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
				user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
				user.email.toLowerCase().includes(searchTerm.toLowerCase())
		) || [];

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setSelectedFile(file);
		}
	};

	const downloadFile = (fileUrl: string, fileName: string) => {
		const link = document.createElement("a");
		link.href = fileUrl;
		link.download = fileName;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	if (isLoading) {
		return (
			<div className='flex items-center justify-center min-h-[50vh] px-4'>
				<div className='text-lg'>Loading task...</div>
			</div>
		);
	}

	if (error || !task) {
		return (
			<div className='flex items-center justify-center min-h-[50vh] px-4'>
				<div className='text-red-500 text-center'>
					Error loading task:{" "}
					{(error as { message?: string })?.message || "Task not found"}
				</div>
			</div>
		);
	}

	return (
		<div className='space-y-4 sm:space-y-6 px-4 sm:px-6 lg:px-8'>
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6'>
				<div className='flex items-start space-x-3 sm:space-x-4'>
					<button
						onClick={() => navigate("/dashboard/tasks")}
						className={`p-2 rounded-lg transition-colors duration-300 flex-shrink-0 ${
							theme === "dark"
								? "hover:bg-gray-800 text-gray-400 hover:text-white"
								: "hover:bg-gray-100 text-gray-600 hover:text-black"
						}`}>
						<ArrowLeft size={20} />
					</button>
					<div className='flex-1 min-w-0'>
						<h1
							className={`text-xl sm:text-2xl lg:text-3xl font-bold transition-colors duration-300 break-words ${
								theme === "dark" ? "text-white" : "text-black"
							}`}>
							{task.title}
						</h1>
						<div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2'>
							<span
								className={`px-3 py-1 rounded-full text-sm font-medium w-fit ${getStatusColor(
									task.status
								)}`}>
								{task.status.replace("_", " ")}
							</span>

							{/* Status Selection */}
							<PermissionGate permission={Permissions.EditTask}>
								<div className='flex flex-col sm:flex-row sm:items-center gap-2'>
									<label
										className={`text-sm font-medium transition-colors duration-300 ${
											theme === "dark" ? "text-gray-300" : "text-gray-700"
										}`}>
										Change Status:
									</label>
									<select
										value={task.status}
										onChange={async (e) => {
											const newStatus = e.target.value as
												| "pending"
												| "in_progress"
												| "completed"
												| "cancelled";
											if (newStatus !== task.status) {
												setIsUpdatingStatus(true);
												try {
													await updateTaskMutation.mutateAsync({
														id: task._id,
														data: { status: newStatus },
													});
												} catch (error) {
													// Error is handled by the mutation
												} finally {
													setIsUpdatingStatus(false);
												}
											}
										}}
										disabled={isUpdatingStatus}
										className={`px-3 py-1 rounded-lg text-sm border transition-all duration-300 w-full sm:w-auto ${
											theme === "dark"
												? "bg-gray-800 border-gray-700 text-white focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
												: "bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
										}`}>
										<option value='pending'>Pending</option>
										<option value='in_progress'>In Progress</option>
										<option value='completed'>Completed</option>
										<option value='cancelled'>Cancelled</option>
									</select>
									{isUpdatingStatus && (
										<div className='flex items-center space-x-2'>
											<div className='w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin'></div>
											<span
												className={`text-xs transition-colors duration-300 ${
													theme === "dark" ? "text-gray-400" : "text-gray-600"
												}`}>
												Updating...
											</span>
										</div>
									)}
								</div>
							</PermissionGate>
						</div>
					</div>
				</div>

				<div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3'>
					<PermissionGate permission={Permissions.EditTask}>
						<button
							onClick={() => setShowEditModal(true)}
							className={`flex items-center justify-center px-3 sm:px-4 py-2 rounded-lg transition-all duration-300 text-sm sm:text-base ${
								theme === "dark"
									? "bg-blue-600 hover:bg-blue-700 text-white"
									: "bg-blue-600 hover:bg-blue-700 text-white"
							}`}>
							<Edit size={16} className='mr-2' />
							<span className='hidden sm:inline'>Edit Task</span>
							<span className='sm:hidden'>Edit</span>
						</button>
					</PermissionGate>
					<PermissionGate permission={Permissions.EditTask}>
						<button
							onClick={() => {
								// Extract user IDs from assignedTo array
								const userIds = task.assignedTo.map((user) =>
									typeof user === "string" ? user : user._id
								);
								setSelectedUsers(userIds);
								setShowAssignmentModal(true);
							}}
							className={`flex items-center justify-center px-3 sm:px-4 py-2 rounded-lg transition-all duration-300 text-sm sm:text-base ${
								theme === "dark"
									? "bg-green-600 hover:bg-green-700 text-white"
									: "bg-green-600 hover:bg-green-700 text-white"
							}`}>
							<UserPlus size={16} className='mr-2' />
							<span className='hidden sm:inline'>Assign Members</span>
							<span className='sm:hidden'>Assign</span>
						</button>
					</PermissionGate>
					<PermissionGate permission={Permissions.CreateFeeBack}>
						<button
							onClick={() => setShowFeedbackModal(true)}
							disabled={!task.assignedTo || task.assignedTo.length === 0}
							className={`flex items-center justify-center px-3 sm:px-4 py-2 rounded-lg transition-all duration-300 text-sm sm:text-base ${
								!task.assignedTo || task.assignedTo.length === 0
									? "opacity-50 cursor-not-allowed"
									: theme === "dark"
									? "bg-purple-600 hover:bg-purple-700 text-white"
									: "bg-purple-600 hover:bg-purple-700 text-white"
							}`}>
							<MessageCircle size={16} className='mr-2' />
							<span className='hidden sm:inline'>Add Feedback</span>
							<span className='sm:hidden'>Feedback</span>
						</button>
					</PermissionGate>
					<PermissionGate permission={Permissions.DeleteTask}>
						<button
							onClick={handleDeleteTask}
							className={`flex items-center justify-center px-3 sm:px-4 py-2 rounded-lg transition-all duration-300 text-sm sm:text-base ${
								theme === "dark"
									? "bg-red-600 hover:bg-red-700 text-white"
									: "bg-red-600 hover:bg-red-700 text-white"
							}`}>
							<Trash2 size={16} className='mr-2' />
							<span className='hidden sm:inline'>Delete Task</span>
							<span className='sm:hidden'>Delete</span>
						</button>
					</PermissionGate>
				</div>
			</motion.div>

			{/* Task Details */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.1 }}
				className={`p-4 sm:p-6 rounded-xl transition-all duration-300 ${
					theme === "dark"
						? "bg-gray-900/60 backdrop-blur-xl border-gray-800/50 shadow-xl"
						: "bg-white/60 backdrop-blur-xl border-gray-200/50 shadow-xl"
				}`}>
				<div className='space-y-4 sm:space-y-6'>
					{/* Description */}
					<div>
						<h3
							className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
								theme === "dark" ? "text-white" : "text-black"
							}`}>
							Description
						</h3>
						<p
							className={`transition-colors duration-300 break-words ${
								theme === "dark" ? "text-gray-300" : "text-gray-700"
							}`}>
							{task.description}
						</p>
					</div>

					{/* Status Section */}
					<div>
						<h3
							className={`text-lg font-semibold mb-3 transition-colors duration-300 ${
								theme === "dark" ? "text-white" : "text-black"
							}`}>
							Task Status
						</h3>
						<div className='flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4'>
							<div className='flex items-center space-x-2'>
								<CheckSquare
									className={`w-5 h-5 ${
										theme === "dark" ? "text-gray-400" : "text-gray-600"
									}`}
								/>
								<span
									className={`px-4 py-2 rounded-lg text-sm font-medium ${getStatusColor(
										task.status
									)}`}>
									{task.status.replace("_", " ")}
								</span>
							</div>

							<PermissionGate permission={Permissions.EditTask}>
								<div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3'>
									<label
										className={`text-sm font-medium transition-colors duration-300 ${
											theme === "dark" ? "text-gray-300" : "text-gray-700"
										}`}>
										Update Status:
									</label>
									<select
										value={task.status}
										onChange={async (e) => {
											const newStatus = e.target.value as
												| "pending"
												| "in_progress"
												| "completed"
												| "cancelled";
											if (newStatus !== task.status) {
												setIsUpdatingStatus(true);
												try {
													await updateTaskMutation.mutateAsync({
														id: task._id,
														data: { status: newStatus },
													});
												} catch (error) {
													// Error is handled by the mutation
												} finally {
													setIsUpdatingStatus(false);
												}
											}
										}}
										disabled={isUpdatingStatus}
										className={`px-4 py-2 rounded-lg text-sm border transition-all duration-300 w-full sm:w-auto ${
											theme === "dark"
												? "bg-gray-800 border-gray-700 text-white focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
												: "bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
										}`}>
										<option value='pending'>Pending</option>
										<option value='in_progress'>In Progress</option>
										<option value='completed'>Completed</option>
										<option value='cancelled'>Cancelled</option>
									</select>
									{isUpdatingStatus && (
										<div className='flex items-center space-x-2'>
											<div className='w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin'></div>
											<span
												className={`text-xs transition-colors duration-300 ${
													theme === "dark" ? "text-gray-400" : "text-gray-600"
												}`}>
												Updating...
											</span>
										</div>
									)}
								</div>
							</PermissionGate>
						</div>
					</div>

					{/* Task Info Grid */}
					<div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6'>
						<div className='space-y-4'>
							<div className='flex items-center space-x-3'>
								<Calendar
									className={`w-5 h-5 flex-shrink-0 ${
										theme === "dark" ? "text-gray-400" : "text-gray-600"
									}`}
								/>
								<div className='min-w-0 flex-1'>
									<p
										className={`text-sm font-medium transition-colors duration-300 ${
											theme === "dark" ? "text-white" : "text-black"
										}`}>
										Due Date
									</p>
									<p
										className={`text-sm transition-colors duration-300 break-words ${
											theme === "dark" ? "text-gray-400" : "text-gray-600"
										}`}>
										{new Date(task.dueDate).toLocaleDateString()}
									</p>
								</div>
							</div>

							<div className='flex items-center space-x-3'>
								<Users
									className={`w-5 h-5 flex-shrink-0 ${
										theme === "dark" ? "text-gray-400" : "text-gray-600"
									}`}
								/>
								<div className='min-w-0 flex-1'>
									<p
										className={`text-sm font-medium transition-colors duration-300 ${
											theme === "dark" ? "text-white" : "text-black"
										}`}>
										Assigned To
									</p>
									<p
										className={`text-sm transition-colors duration-300 ${
											theme === "dark" ? "text-gray-400" : "text-gray-600"
										}`}>
										{task.assignedTo.length} people
									</p>
								</div>
							</div>

							<div className='flex items-center space-x-3'>
								<MessageCircle
									className={`w-5 h-5 flex-shrink-0 ${
										theme === "dark" ? "text-gray-400" : "text-gray-600"
									}`}
								/>
								<div className='min-w-0 flex-1'>
									<p
										className={`text-sm font-medium transition-colors duration-300 ${
											theme === "dark" ? "text-white" : "text-black"
										}`}>
										WhatsApp Group
									</p>
									<p
										className={`text-sm transition-colors duration-300 break-words ${
											theme === "dark" ? "text-gray-400" : "text-gray-600"
										}`}>
										{task.whatAppGroup}
									</p>
								</div>
							</div>
						</div>

						<div className='space-y-4'>
							<div className='flex items-center space-x-3'>
								<Clock
									className={`w-5 h-5 flex-shrink-0 ${
										theme === "dark" ? "text-gray-400" : "text-gray-600"
									}`}
								/>
								<div className='min-w-0 flex-1'>
									<p
										className={`text-sm font-medium transition-colors duration-300 ${
											theme === "dark" ? "text-white" : "text-black"
										}`}>
										Created
									</p>
									<p
										className={`text-sm transition-colors duration-300 ${
											theme === "dark" ? "text-gray-400" : "text-gray-600"
										}`}>
										{new Date(task.createdAt).toLocaleDateString()}
									</p>
								</div>
							</div>

							<div className='flex items-center space-x-3'>
								<FileText
									className={`w-5 h-5 flex-shrink-0 ${
										theme === "dark" ? "text-gray-400" : "text-gray-600"
									}`}
								/>
								<div className='min-w-0 flex-1'>
									<p
										className={`text-sm font-medium transition-colors duration-300 ${
											theme === "dark" ? "text-white" : "text-black"
										}`}>
										Attachments
									</p>
									<p
										className={`text-sm transition-colors duration-300 ${
											theme === "dark" ? "text-gray-400" : "text-gray-600"
										}`}>
										{task.attachments.length} files
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Assigned Users */}
					{task.assignedTo && task.assignedTo.length > 0 && (
						<div className='mt-6'>
							<h3
								className={`text-lg font-semibold mb-3 transition-colors duration-300 ${
									theme === "dark" ? "text-white" : "text-black"
								}`}>
								Assigned Members ({task.assignedTo.length})
							</h3>
							<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3'>
								{task.assignedTo.map((user) => {
									// Handle both string IDs and full user objects
									if (typeof user === "string") {
										const foundUser = users?.find((u) => u._id === user);
										if (!foundUser) return null;

										return (
											<div
												key={user}
												className={`flex items-center space-x-3 p-3 rounded-lg ${
													theme === "dark" ? "bg-gray-800" : "bg-gray-100"
												}`}>
												{foundUser.profilePicture ? (
													<img
														src={foundUser.profilePicture}
														alt={`${foundUser.firstName} ${foundUser.lastName}`}
														className='w-8 h-8 rounded-full object-cover flex-shrink-0'
													/>
												) : (
													<div
														className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 ${
															theme === "dark"
																? "bg-gray-700 text-gray-300"
																: "bg-gray-200 text-gray-700"
														}`}>
														{foundUser.firstName.charAt(0)}
														{foundUser.lastName.charAt(0)}
													</div>
												)}
												<div className='flex-1 min-w-0'>
													<p
														className={`font-medium text-sm transition-colors duration-300 break-words ${
															theme === "dark" ? "text-white" : "text-black"
														}`}>
														{foundUser.firstName} {foundUser.lastName}
													</p>
													<p
														className={`text-xs transition-colors duration-300 break-words ${
															theme === "dark"
																? "text-gray-400"
																: "text-gray-600"
														}`}>
														{foundUser.email}
													</p>
												</div>
											</div>
										);
									} else if (
										user &&
										typeof user === "object" &&
										"firstName" in user &&
										"lastName" in user
									) {
										// Handle full user objects
										return (
											<div
												key={user._id}
												className={`flex items-center space-x-3 p-3 rounded-lg ${
													theme === "dark" ? "bg-gray-800" : "bg-gray-100"
												}`}>
												{user.profilePicture ? (
													<img
														src={user.profilePicture}
														alt={`${user.firstName} ${user.lastName}`}
														className='w-8 h-8 rounded-full object-cover flex-shrink-0'
													/>
												) : (
													<div
														className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 ${
															theme === "dark"
																? "bg-gray-700 text-gray-300"
																: "bg-gray-200 text-gray-700"
														}`}>
														{user.firstName.charAt(0)}
														{user.lastName.charAt(0)}
													</div>
												)}
												<div className='flex-1 min-w-0'>
													<p
														className={`font-medium text-sm transition-colors duration-300 break-words ${
															theme === "dark" ? "text-white" : "text-black"
														}`}>
														{user.firstName} {user.lastName}
													</p>
													<p
														className={`text-xs transition-colors duration-300 break-words ${
															theme === "dark"
																? "text-gray-400"
																: "text-gray-600"
														}`}>
														{user.email}
													</p>
												</div>
											</div>
										);
									}
									return null;
								})}
							</div>
						</div>
					)}
				</div>
			</motion.div>

			{/* Attachments Section */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.2 }}
				className={`p-4 sm:p-6 rounded-xl transition-all duration-300 ${
					theme === "dark"
						? "bg-gray-900/60 backdrop-blur-xl border-gray-800/50 shadow-xl"
						: "bg-white/60 backdrop-blur-xl border-gray-200/50 shadow-xl"
				}`}>
				<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4'>
					<h3
						className={`text-lg font-semibold transition-colors duration-300 ${
							theme === "dark" ? "text-white" : "text-black"
						}`}>
						Attachments
					</h3>
					<PermissionGate permission={Permissions.UploadFile}>
						<button
							onClick={() => setShowFileUploadModal(true)}
							className={`flex items-center justify-center px-3 py-2 rounded-lg transition-all duration-300 text-sm sm:text-base w-full sm:w-auto ${
								theme === "dark"
									? "bg-blue-600 hover:bg-blue-700 text-white"
									: "bg-blue-600 hover:bg-blue-700 text-white"
							}`}>
							<Upload size={16} className='mr-2' />
							Upload File
						</button>
					</PermissionGate>
				</div>

				{task.attachments.length === 0 ? (
					<div className='text-center py-8'>
						<FileText
							className={`w-12 h-12 mx-auto mb-4 ${
								theme === "dark" ? "text-gray-600" : "text-gray-400"
							}`}
						/>
						<p
							className={`transition-colors duration-300 ${
								theme === "dark" ? "text-gray-400" : "text-gray-600"
							}`}>
							No attachments yet
						</p>
					</div>
				) : (
					<div className='space-y-3'>
						{task.attachments.map((attachment) => (
							<div
								key={attachment._id}
								className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 rounded-lg transition-colors duration-300 ${
									theme === "dark" ? "bg-gray-800" : "bg-gray-100"
								}`}>
								<div className='flex items-center space-x-3 flex-1 min-w-0'>
									<FileText
										className={`w-5 h-5 flex-shrink-0 ${
											theme === "dark" ? "text-gray-400" : "text-gray-600"
										}`}
									/>
									<div className='min-w-0 flex-1'>
										<p
											className={`text-sm font-medium transition-colors duration-300 break-words ${
												theme === "dark" ? "text-white" : "text-black"
											}`}>
											{attachment.fileName}
										</p>
										<p
											className={`text-xs transition-colors duration-300 ${
												theme === "dark" ? "text-gray-400" : "text-gray-600"
											}`}>
											Uploaded{" "}
											{new Date(attachment.uploadedAt).toLocaleDateString()}
										</p>
									</div>
								</div>
								<div className='flex items-center space-x-2 flex-shrink-0'>
									<button
										onClick={() =>
											downloadFile(attachment.fileUrl, attachment.fileName)
										}
										className={`p-2 rounded-lg transition-colors duration-300 ${
											theme === "dark"
												? "hover:bg-gray-700 text-gray-400 hover:text-white"
												: "hover:bg-gray-200 text-gray-600 hover:text-black"
										}`}>
										<Download size={16} />
									</button>
									<PermissionGate permission={Permissions.DeleteTask}>
										<button
											onClick={() => handleRemoveFile(attachment._id)}
											className={`p-2 rounded-lg transition-colors duration-300 ${
												theme === "dark"
													? "hover:bg-red-900/30 text-red-400 hover:text-red-300"
													: "hover:bg-red-50 text-red-600 hover:text-red-700"
											}`}>
											<X size={16} />
										</button>
									</PermissionGate>
								</div>
							</div>
						))}
					</div>
				)}
			</motion.div>

			{/* Task Feedback Section */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.3 }}
				className={`p-4 sm:p-6 rounded-xl transition-all duration-300 ${
					theme === "dark"
						? "bg-gray-900/60 backdrop-blur-xl border-gray-800/50 shadow-xl"
						: "bg-white/60 backdrop-blur-xl border-gray-200/50 shadow-xl"
				}`}>
				{/* Section Header */}
				<div className='flex items-center justify-between mb-6'>
					<div className='flex items-center space-x-3'>
						<div
							className={`p-3 rounded-xl ${
								theme === "dark" ? "bg-purple-600/20" : "bg-purple-100"
							}`}>
							<MessageSquare
								className={`w-6 h-6 ${
									theme === "dark" ? "text-purple-400" : "text-purple-600"
								}`}
							/>
						</div>
						<div>
							<h2
								className={`text-xl font-bold transition-colors duration-300 ${
									theme === "dark" ? "text-white" : "text-black"
								}`}>
								Task Feedback
							</h2>
							<p
								className={`text-sm transition-colors duration-300 ${
									theme === "dark" ? "text-gray-400" : "text-gray-600"
								}`}>
								Share feedback for {task.title}
							</p>
						</div>
					</div>
				</div>

				<FeedbackSection
					category='task'
					entityId={task._id}
					entityTitle={task.title}
					submittedTo={task.assignedTo.map((user) =>
						typeof user === "string" ? user : user._id
					)}
				/>
			</motion.div>

			{/* Edit Task Modal */}
			<Modal
				isOpen={showEditModal}
				onClose={() => setShowEditModal(false)}
				title='Edit Task'
				size='md'>
				<GenericForm
					schema={updateTaskSchema}
					onSubmit={handleUpdateTask}
					submitButtonText={
						updateTaskMutation.isPending ? "Updating..." : "Update Task"
					}
					defaultValues={{
						title: task.title,
						description: task.description,
						status: task.status,
						dueDate: task.dueDate.split("T")[0],
						whatAppGroup: task.whatAppGroup,
						assignedTo: task.assignedTo.map((user) =>
							typeof user === "string" ? user : user._id
						),
					}}
					className='space-y-4'
				/>
			</Modal>

			{/* File Upload Modal */}
			<Modal
				isOpen={showFileUploadModal}
				onClose={() => setShowFileUploadModal(false)}
				title='Upload File to Task'
				size='md'>
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

					{selectedFile && (
						<div
							className={`p-3 rounded-lg ${
								theme === "dark" ? "bg-gray-800" : "bg-gray-100"
							}`}>
							<div className='flex items-center justify-between'>
								<span
									className={`text-sm transition-colors duration-300 break-words flex-1 mr-2 ${
										theme === "dark" ? "text-white" : "text-black"
									}`}>
									{selectedFile.name}
								</span>
								<button
									onClick={() => setSelectedFile(null)}
									className='text-red-500 hover:text-red-700 flex-shrink-0'>
									<X size={16} />
								</button>
							</div>
						</div>
					)}
				</div>

				<div className='flex flex-col sm:flex-row gap-3 mt-6'>
					<button
						onClick={handleFileUpload}
						disabled={!selectedFile || uploadFileMutation.isPending}
						className={`flex-1 py-2 px-4 rounded-lg transition-colors duration-300 ${
							!selectedFile || uploadFileMutation.isPending
								? "bg-gray-400 cursor-not-allowed"
								: "bg-blue-600 hover:bg-blue-700 text-white"
						}`}>
						{uploadFileMutation.isPending ? "Uploading..." : "Upload File"}
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
			</Modal>

			{/* Assignment Modal */}
			<Modal
				isOpen={showAssignmentModal}
				onClose={() => {
					setShowAssignmentModal(false);
					setSelectedUsers([]);
					setSearchTerm("");
				}}
				title='Assign Task to Members'
				size='xl'>
				<div className='space-y-4'>
					{/* Search Bar */}
					<div className='relative'>
						<Search
							className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
								theme === "dark" ? "text-gray-400" : "text-gray-500"
							}`}
						/>
						<input
							type='text'
							placeholder='Search users...'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className={`w-full pl-10 pr-4 py-2 border rounded-lg transition-colors duration-300 ${
								theme === "dark"
									? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
									: "bg-white border-gray-300 text-black placeholder-gray-500"
							}`}
						/>
					</div>

					{/* Users List */}
					<div className='max-h-96 overflow-y-auto'>
						{usersLoading ? (
							<div className='text-center py-8'>
								<div
									className={`transition-colors duration-300 ${
										theme === "dark" ? "text-gray-400" : "text-gray-600"
									}`}>
									Loading users...
								</div>
							</div>
						) : filteredUsers.length === 0 ? (
							<div className='text-center py-8'>
								<div
									className={`transition-colors duration-300 ${
										theme === "dark" ? "text-gray-400" : "text-gray-600"
									}`}>
									No users found
								</div>
							</div>
						) : (
							<div className='space-y-2'>
								{filteredUsers.map((user) => (
									<div
										key={user._id}
										onClick={() => handleUserToggle(user._id)}
										className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors duration-300 ${
											selectedUsers.includes(user._id)
												? theme === "dark"
													? "bg-blue-600/20 border-blue-500/50"
													: "bg-blue-50 border-blue-200"
												: theme === "dark"
												? "bg-gray-800 hover:bg-gray-700"
												: "bg-gray-50 hover:bg-gray-100"
										} border`}>
										<div className='flex items-center space-x-3 flex-1 min-w-0'>
											<div
												className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 ${
													selectedUsers.includes(user._id)
														? "bg-blue-600 text-white"
														: theme === "dark"
														? "bg-gray-700 text-gray-300"
														: "bg-gray-200 text-gray-700"
												}`}>
												{user.firstName.charAt(0)}
												{user.lastName.charAt(0)}
											</div>
											<div className='min-w-0 flex-1'>
												<p
													className={`font-medium transition-colors duration-300 break-words ${
														theme === "dark" ? "text-white" : "text-black"
													}`}>
													{user.firstName} {user.lastName}
												</p>
												<p
													className={`text-sm transition-colors duration-300 break-words ${
														theme === "dark" ? "text-gray-400" : "text-gray-600"
													}`}>
													{user.email}
												</p>
											</div>
										</div>
										{selectedUsers.includes(user._id) && (
											<Check
												className={`w-5 h-5 flex-shrink-0 ${
													theme === "dark" ? "text-blue-400" : "text-blue-600"
												}`}
											/>
										)}
									</div>
								))}
							</div>
						)}
					</div>

					{/* Selected Users Count */}
					{selectedUsers.length > 0 && (
						<div
							className={`p-3 rounded-lg ${
								theme === "dark" ? "bg-blue-600/20" : "bg-blue-50"
							}`}>
							<p
								className={`text-sm font-medium transition-colors duration-300 ${
									theme === "dark" ? "text-blue-400" : "text-blue-700"
								}`}>
								{selectedUsers.length} user
								{selectedUsers.length !== 1 ? "s" : ""} selected
							</p>
						</div>
					)}
				</div>

				<div className='flex flex-col sm:flex-row gap-3 mt-6'>
					<button
						onClick={handleAssignmentUpdate}
						disabled={updateAssignmentMutation.isPending}
						className={`flex-1 py-2 px-4 rounded-lg transition-colors duration-300 ${
							updateAssignmentMutation.isPending
								? "bg-gray-400 cursor-not-allowed"
								: "bg-green-600 hover:bg-green-700 text-white"
						}`}>
						{updateAssignmentMutation.isPending
							? "Updating..."
							: "Update Assignment"}
					</button>
					<button
						onClick={() => {
							setShowAssignmentModal(false);
							setSelectedUsers([]);
							setSearchTerm("");
						}}
						className={`flex-1 py-2 px-4 rounded-lg transition-colors duration-300 ${
							theme === "dark"
								? "bg-gray-800 hover:bg-gray-700 text-white"
								: "bg-gray-200 hover:bg-gray-300 text-black"
						}`}>
						Cancel
					</button>
				</div>
			</Modal>

			{/* Feedback Modal */}
			<Modal
				isOpen={showFeedbackModal}
				onClose={() => setShowFeedbackModal(false)}
				title={`Feedback for ${task?.title || "Task"}`}
				size='lg'>
				<div className='space-y-4'>
					<FeedbackSection
						category='task'
						entityId={task?._id || ""}
						entityTitle={task?.title || ""}
						submittedTo={
							task?.assignedTo?.map((user) =>
								typeof user === "string" ? user : user._id
							) || []
						}
					/>
				</div>
			</Modal>
		</div>
	);
};

export default TaskDetail;
