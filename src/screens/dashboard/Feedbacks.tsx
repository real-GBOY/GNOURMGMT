/** @format */

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
	MessageCircleMore,
	Plus,
	Edit,
	Trash2,
	Search,
	Eye,
	User,
	ChevronDown,
} from "lucide-react";
import { useTheme } from "../../shared/contexts/ThemeContext";
import { useAuth } from "../../shared/contexts/AuthContext";
import PermissionGate from "../../shared/Secure/PermissionGate";
import Permissions from "../../shared/config/Permissions";
import {
	useFeedback,
	useFeedbackById,
	useCreateFeedback,
	useUpdateFeedback,
	useDeleteFeedback,
} from "../../shared/services/feedbackService";
import Modal from "../../shared/components/Modal";
import {
	createFeedbackSchema,
	updateFeedbackSchema,
	feedbackCategories,
} from "../../shared/schemas/FeedbackSchema";
import { CreateFeedbackData } from "../../shared/types/Feedback";
import { useUsers } from "../../shared/services/userService";
import { useTeams, useTeamMembers } from "../../shared/services/teamService";
import { useTasks } from "../../shared/services/taskService";
import { useEvents } from "../../shared/services/eventService";
import { useAttendance } from "../../shared/services/attendanceService";

const Feedbacks: React.FC = () => {
	const { theme } = useTheme();
	const { user } = useAuth();
	const [searchTerm, setSearchTerm] = useState("");
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [editingFeedbackId, setEditingFeedbackId] = useState<string | null>(
		null
	);
	const [viewingFeedbackId, setViewingFeedbackId] = useState<string | null>(
		null
	);
	const [selectedTeamId, setSelectedTeamId] = useState<string>("");
	const [selectedCategory, setSelectedCategory] = useState<string>("");
	const [formData, setFormData] = useState({
		title: "",
		content: "",
		submittedTo: "",
		taskId: "",
		meetingId: "",
		attendanceId: "",
	});

	const { data: feedbackList = [], isLoading, error } = useFeedback();
	const {
		data: viewingFeedback,
		isLoading: isViewingLoading,
		error: viewingError,
	} = useFeedbackById(viewingFeedbackId || "");
	const createFeedback = useCreateFeedback();
	const updateFeedback = useUpdateFeedback();
	const deleteFeedback = useDeleteFeedback();

	// Data providers for selects
	const isPresident = (user?.role?.key || "").toLowerCase() === "president";
	const { data: allUsers = [] } = useUsers(
		showCreateModal || !!viewingFeedbackId
	);
	const { data: teams = [] } = useTeams();
	const { data: teamMembers = [] } = useTeamMembers(selectedTeamId || "");
	const { data: tasks = [] } = useTasks();
	const { data: events = [] } = useEvents();
	const { data: attendanceList = [] } = useAttendance();

	const filtered = useMemo(() => {
		const term = searchTerm.toLowerCase();
		return feedbackList.filter(
			(f) =>
				f.title.toLowerCase().includes(term) ||
				f.content.toLowerCase().includes(term) ||
				f.category.toLowerCase().includes(term)
		);
	}, [feedbackList, searchTerm]);

	const submittedToOptions = useMemo(() => {
		const sourceUsers = isPresident
			? Array.isArray(allUsers)
				? allUsers
				: []
			: selectedTeamId
			? teamMembers.map((m: any) => m?.user).filter(Boolean)
			: [];
		return sourceUsers
			.map((u: any) => {
				if (u && typeof u === "object") {
					const id = u._id;
					const firstName = u.firstName ?? "Unknown";
					const lastName = u.lastName ?? "";
					return { value: id, label: `${firstName} ${lastName}`.trim() };
				}
				if (typeof u === "string") {
					const found = (allUsers || []).find((x: any) => x?._id === u);
					const firstName = found?.firstName ?? "Unknown";
					const lastName = found?.lastName ?? "";
					return { value: u, label: `${firstName} ${lastName}`.trim() };
				}
				return null;
			})
			.filter((opt: any) => opt && opt.value && opt.value !== user?.id);
	}, [isPresident, allUsers, selectedTeamId, teamMembers, user?.id]);

	const taskOptions = useMemo(
		() =>
			(Array.isArray(tasks) ? tasks : [])
				.filter((t: any) => t && t._id)
				.map((t: any) => ({ value: t._id, label: t.title ?? t._id })),
		[tasks]
	);

	const meetingOptions = useMemo(
		() =>
			(Array.isArray(events) ? events : [])
				.filter((e: any) => e && e._id)
				.map((e: any) => ({ value: e._id, label: e.title ?? e._id })),
		[events]
	);

	const attendanceOptions = useMemo(
		() =>
			(Array.isArray(attendanceList) ? attendanceList : [])
				.filter((a: any) => a && a._id)
				.map((a: any) => {
					const userObj = a?.user;
					const eventObj = a?.event;
					const userName =
						userObj && typeof userObj === "object"
							? `${userObj.firstName ?? "Unknown"} ${
									userObj.lastName ?? ""
							  }`.trim()
							: "Unknown User";
					const eventTitle =
						eventObj && typeof eventObj === "object"
							? eventObj.title ?? "Unknown Event"
							: "Unknown Event";
					return { value: a._id, label: `${userName} - ${eventTitle}` };
				}),
		[attendanceList]
	);

	const selectOptions = {
		category: feedbackCategories.map((c) => ({ value: c, label: c })),
		submittedTo: submittedToOptions,
		taskId: taskOptions,
		meetingId: meetingOptions,
		attendanceId: attendanceOptions,
	} as const;

	const handleCreate = async () => {
		if (!formData.title.trim() || !formData.content.trim()) {
			alert("Please fill in all required fields");
			return;
		}

		const payload: CreateFeedbackData = {
			title: formData.title.trim(),
			content: formData.content.trim(),
			category: selectedCategory as any,
			submittedTo: formData.submittedTo,
			taskId: formData.taskId || undefined,
			meetingId: formData.meetingId || undefined,
			attendanceId: formData.attendanceId || undefined,
		};

		await createFeedback.mutateAsync(payload);
		setShowCreateModal(false);
		setSelectedCategory(""); // Reset category selection
		setFormData({
			title: "",
			content: "",
			submittedTo: "",
			taskId: "",
			meetingId: "",
			attendanceId: "",
		});
	};

	const handleUpdate = async (id: string, data: any) => {
		await updateFeedback.mutateAsync({
			id,
			data: { title: data.title, content: data.content },
		});
		setEditingFeedbackId(null);
	};

	const handleEdit = (feedback: any) => {
		setFormData({
			title: feedback.title || "",
			content: feedback.content || "",
			submittedTo: "",
			taskId: "",
			meetingId: "",
			attendanceId: "",
		});
		setEditingFeedbackId(feedback._id);
	};

	const handleDelete = async (id: string) => {
		if (window.confirm("Are you sure you want to delete this feedback?")) {
			await deleteFeedback.mutateAsync(id);
		}
	};

	if (isLoading) {
		return (
			<div className='flex items-center justify-center h-64'>
				<div className='text-lg'>Loading feedback...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='flex items-center justify-center h-64'>
				<div className='text-red-500'>Error loading feedback</div>
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
						Feedbacks
					</h1>
					<p
						className={`mt-2 text-base sm:text-lg transition-colors duration-300 ${
							theme === "dark" ? "text-gray-400" : "text-gray-600"
						}`}>
						Manage and review feedback
					</p>
				</div>

				<PermissionGate permission={Permissions.CreateFeeBack}>
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
						<span className='hidden sm:inline'>Create Feedback</span>
						<span className='sm:hidden'>Add</span>
					</motion.button>
				</PermissionGate>
			</motion.div>

			{/* Search */}
			<div className='relative'>
				<Search
					className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
					size={18}
				/>
				<input
					type='text'
					placeholder='Search feedback...'
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className={`w-full pl-10 pr-4 py-2.5 rounded-lg border transition-colors duration-300 ${
						theme === "dark"
							? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
							: "bg-white border-gray-300 text-black placeholder-gray-500"
					}`}
				/>
			</div>

			{/* Grid */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.1 }}
				className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
				{filtered.map((f, index) => (
					<motion.div
						key={f._id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.05 * index }}
						className={`group relative p-5 rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${
							theme === "dark"
								? "bg-gray-900/60 backdrop-blur-xl border border-gray-800/50"
								: "bg-white/60 backdrop-blur-xl border border-gray-200/50"
						}`}>
						<div className='flex items-start justify-between mb-3'>
							<div className='flex items-center space-x-3'>
								<div
									className={`p-2.5 rounded-lg ${
										theme === "dark" ? "bg-blue-600/20" : "bg-blue-100"
									}`}>
									<MessageCircleMore
										className={`${
											theme === "dark" ? "text-blue-400" : "text-blue-600"
										} w-5 h-5`}
									/>
								</div>
								<div>
									<h3
										className={`font-semibold ${
											theme === "dark" ? "text-white" : "text-black"
										}`}>
										{f.title}
									</h3>
									<div className='text-xs'>
										<span
											className={`px-2 py-0.5 rounded-full ${
												theme === "dark"
													? "bg-gray-800 text-gray-300"
													: "bg-gray-100 text-gray-700"
											}`}>
											{f.category}
										</span>
									</div>
								</div>
							</div>
							<div className='flex items-center space-x-1'>
								<button
									className={`p-2 rounded-lg ${
										theme === "dark"
											? "hover:bg-gray-800 text-gray-400 hover:text-white"
											: "hover:bg-gray-100 text-gray-600 hover:text-black"
									}`}
									title='View'
									onClick={() => setViewingFeedbackId(f._id)}>
									<Eye size={16} />
								</button>
								<PermissionGate permission={Permissions.EditFeedback}>
									<button
										onClick={() => handleEdit(f)}
										className={`p-2 rounded-lg ${
											theme === "dark"
												? "hover:bg-gray-800 text-gray-400 hover:text-white"
												: "hover:bg-gray-100 text-gray-600 hover:text-black"
										}`}
										title='Edit'>
										<Edit size={16} />
									</button>
								</PermissionGate>
								<PermissionGate permission={Permissions.DeleteFeedback}>
									<button
										onClick={() => handleDelete(f._id)}
										className={`p-2 rounded-lg ${
											theme === "dark"
												? "hover:bg-red-900/30 text-red-400 hover:text-red-300"
												: "hover:bg-red-50 text-red-600 hover:text-red-700"
										}`}
										title='Delete'>
										<Trash2 size={16} />
									</button>
								</PermissionGate>
							</div>
						</div>
						<p
							className={`${
								theme === "dark" ? "text-gray-300" : "text-gray-700"
							} text-sm line-clamp-3`}>
							{f.content}
						</p>
					</motion.div>
				))}
			</motion.div>

			{/* Create Modal */}
			<Modal
				isOpen={showCreateModal}
				onClose={() => {
					setShowCreateModal(false);
					setSelectedCategory("");
					setFormData({
						title: "",
						content: "",
						submittedTo: "",
						taskId: "",
						meetingId: "",
						attendanceId: "",
					});
				}}
				title='Create Feedback'
				size='lg'>
				{/* Submitted By (current user) */}
				<div className='mb-6 p-4 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200/50 dark:border-purple-700/50'>
					<div className='flex items-center space-x-2'>
						<div className='w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center'>
							<User className='w-4 h-4 text-purple-600 dark:text-purple-400' />
						</div>
						<div>
							<span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
								Submitting as:
							</span>
							<div className='text-sm font-semibold text-purple-700 dark:text-purple-300'>
								{user?.firstName} {user?.lastName}
							</div>
						</div>
					</div>
				</div>

				{/* Team picker for non-president to load members */}
				{(user?.role?.key || "").toLowerCase() !== "president" && (
					<div className='mb-6'>
						<label className='block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300'>
							Team Selection
						</label>
						<select
							value={selectedTeamId}
							onChange={(e) => setSelectedTeamId(e.target.value)}
							className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 ${
								theme === "dark"
									? "bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
									: "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500"
							}`}>
							<option value=''>Select a team to load members...</option>
							{teams.map((t: any) => (
								<option key={t._id} value={t._id}>
									{t.name}
								</option>
							))}
						</select>
					</div>
				)}

				{/* Category Selection */}
				<div className='mb-6'>
					<label className='block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300'>
						Feedback Category
					</label>
					<div className='relative'>
						<select
							value={selectedCategory}
							onChange={(e) => setSelectedCategory(e.target.value)}
							className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 appearance-none ${
								theme === "dark"
									? "bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
									: "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500"
							}`}>
							<option value=''>Choose a feedback category</option>
							{feedbackCategories.map((category) => (
								<option key={category} value={category}>
									{category === "meeting"
										? "Event"
										: category.charAt(0).toUpperCase() + category.slice(1)}
								</option>
							))}
						</select>
						<div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
							<ChevronDown className='w-5 h-5 text-gray-400' />
						</div>
					</div>
				</div>

				{/* Conditional Fields - Only show when category is selected */}
				{selectedCategory && (
					<div className='space-y-6'>
						{/* Title Field - Always shown */}
						<div>
							<label className='block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300'>
								Feedback Title
							</label>
							<input
								type='text'
								value={formData.title}
								onChange={(e) =>
									setFormData({ ...formData, title: e.target.value })
								}
								placeholder='Enter a descriptive title for your feedback'
								className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 ${
									theme === "dark"
										? "bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
										: "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500"
								}`}
							/>
						</div>

						{/* Content Field - Always shown */}
						<div>
							<label className='block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300'>
								Feedback Content
							</label>
							<textarea
								value={formData.content}
								onChange={(e) =>
									setFormData({ ...formData, content: e.target.value })
								}
								placeholder='Share your detailed feedback, suggestions, or observations...'
								rows={4}
								className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 resize-none ${
									theme === "dark"
										? "bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
										: "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500"
								}`}
							/>
						</div>

						{/* Submitted To Field - Always shown */}
						<div>
							<label className='block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300'>
								Submit To
							</label>
							<select
								value={formData.submittedTo}
								onChange={(e) =>
									setFormData({ ...formData, submittedTo: e.target.value })
								}
								className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 ${
									theme === "dark"
										? "bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
										: "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500"
								}`}>
								<option value=''>Select recipient</option>
								{submittedToOptions.map((option) =>
									option ? (
										<option key={option.value} value={option.value}>
											{option.label}
										</option>
									) : null
								)}
							</select>
						</div>

						{/* Task-specific fields */}
						{selectedCategory === "task" && (
							<div>
								<label className='block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300'>
									Select Task
								</label>
								<select
									value={formData.taskId}
									onChange={(e) =>
										setFormData({ ...formData, taskId: e.target.value })
									}
									className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 ${
										theme === "dark"
											? "bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
											: "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500"
									}`}>
									<option value=''>Choose a specific task</option>
									{taskOptions.map((option) => (
										<option key={option.value} value={option.value}>
											{option.label}
										</option>
									))}
								</select>
							</div>
						)}

						{/* Meeting/Event-specific fields */}
						{selectedCategory === "meeting" && (
							<div>
								<label className='block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300'>
									Select Event
								</label>
								<select
									value={formData.meetingId}
									onChange={(e) =>
										setFormData({ ...formData, meetingId: e.target.value })
									}
									className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 ${
										theme === "dark"
											? "bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
											: "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500"
									}`}>
									<option value=''>Choose a specific event</option>
									{meetingOptions.map((option) => (
										<option key={option.value} value={option.value}>
											{option.label}
										</option>
									))}
								</select>
							</div>
						)}

						{/* Attendance-specific fields */}
						{selectedCategory === "attendance" && (
							<div>
								<label className='block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300'>
									Select Attendance Record
								</label>
								<select
									value={formData.attendanceId}
									onChange={(e) =>
										setFormData({ ...formData, attendanceId: e.target.value })
									}
									className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 ${
										theme === "dark"
											? "bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
											: "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500"
									}`}>
									<option value=''>Choose a specific attendance record</option>
									{attendanceOptions.map((option) => (
										<option key={option.value} value={option.value}>
											{option.label}
										</option>
									))}
								</select>
							</div>
						)}

						{/* Submit Button */}
						<div className='flex space-x-4 pt-6'>
							<button
								onClick={handleCreate}
								disabled={createFeedback.isPending}
								className='flex-1 py-3 px-6 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'>
								{createFeedback.isPending ? (
									<div className='flex items-center justify-center space-x-2'>
										<div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
										<span>Creating...</span>
									</div>
								) : (
									"Create Feedback"
								)}
							</button>
							<button
								onClick={() => {
									setShowCreateModal(false);
									setSelectedCategory("");
									setFormData({
										title: "",
										content: "",
										submittedTo: "",
										taskId: "",
										meetingId: "",
										attendanceId: "",
									});
								}}
								className='flex-1 py-3 px-6 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'>
								Cancel
							</button>
						</div>
					</div>
				)}
			</Modal>

			{/* View Modal */}
			<Modal
				isOpen={!!viewingFeedbackId}
				onClose={() => setViewingFeedbackId(null)}
				title='Feedback Details'
				size='md'>
				{isViewingLoading ? (
					<div className='p-4 text-sm'>Loading...</div>
				) : viewingError ? (
					<div className='p-4 text-sm text-red-500'>
						Failed to load feedback
					</div>
				) : viewingFeedback ? (
					<div className='space-y-3 text-sm'>
						<div>
							<span className='font-semibold'>Title:</span>{" "}
							{viewingFeedback.title}
						</div>
						<div>
							<span className='font-semibold'>Category:</span>{" "}
							{viewingFeedback.category}
						</div>
						<div>
							<span className='font-semibold'>Content:</span>
							<p className='mt-1 whitespace-pre-wrap'>
								{viewingFeedback.content}
							</p>
						</div>
						<div>
							<span className='font-semibold'>Submitted By:</span>
							<span className='ml-1'>
								{typeof viewingFeedback.submittedBy === "object"
									? `${viewingFeedback.submittedBy?.firstName ?? "Unknown"} ${
											viewingFeedback.submittedBy?.lastName ?? ""
									  }`.trim()
									: (allUsers.find(
											(u: any) => u._id === viewingFeedback.submittedBy
									  )?.firstName ?? "Unknown") +
									  " " +
									  (allUsers.find(
											(u: any) => u._id === viewingFeedback.submittedBy
									  )?.lastName ?? "")}
							</span>
						</div>
						<div>
							<span className='font-semibold'>Submitted To:</span>
							<span className='ml-1'>
								{typeof viewingFeedback.submittedTo === "object"
									? `${viewingFeedback.submittedTo?.firstName ?? "Unknown"} ${
											viewingFeedback.submittedTo?.lastName ?? ""
									  }`.trim()
									: (allUsers.find(
											(u: any) => u._id === viewingFeedback.submittedTo
									  )?.firstName ?? "Unknown") +
									  " " +
									  (allUsers.find(
											(u: any) => u._id === viewingFeedback.submittedTo
									  )?.lastName ?? "")}
							</span>
						</div>
						<div className='text-xs text-gray-500'>
							<span>
								Created: {new Date(viewingFeedback.createdAt).toLocaleString()}
							</span>
							<br />
							<span>
								Updated: {new Date(viewingFeedback.updatedAt).toLocaleString()}
							</span>
						</div>
					</div>
				) : null}
			</Modal>

			{/* Edit Modal */}
			<Modal
				isOpen={!!editingFeedbackId}
				onClose={() => setEditingFeedbackId(null)}
				title='Edit Feedback'
				size='md'>
				<div className='space-y-6'>
					<div>
						<label className='block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300'>
							Feedback Title
						</label>
						<input
							type='text'
							value={formData.title}
							onChange={(e) =>
								setFormData({ ...formData, title: e.target.value })
							}
							placeholder='Enter a descriptive title for your feedback'
							className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 ${
								theme === "dark"
									? "bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
									: "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500"
							}`}
						/>
					</div>
					<div>
						<label className='block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300'>
							Feedback Content
						</label>
						<textarea
							value={formData.content}
							onChange={(e) =>
								setFormData({ ...formData, content: e.target.value })
							}
							placeholder='Share your detailed feedback, suggestions, or observations...'
							rows={4}
							className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 resize-none ${
								theme === "dark"
									? "bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
									: "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500"
							}`}
						/>
					</div>
					<div className='flex space-x-4 pt-6'>
						<button
							onClick={() =>
								handleUpdate(editingFeedbackId!, {
									title: formData.title,
									content: formData.content,
								})
							}
							disabled={updateFeedback.isPending}
							className='flex-1 py-3 px-6 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'>
							{updateFeedback.isPending ? (
								<div className='flex items-center justify-center space-x-2'>
									<div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
									<span>Updating...</span>
								</div>
							) : (
								"Update Feedback"
							)}
						</button>
						<button
							onClick={() => setEditingFeedbackId(null)}
							className='flex-1 py-3 px-6 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'>
							Cancel
						</button>
					</div>
				</div>
			</Modal>
		</div>
	);
};

export default Feedbacks;
