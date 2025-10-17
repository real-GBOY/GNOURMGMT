/** @format */

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
	MessageSquare,
	Plus,
	Edit,
	Trash2,
	User,
	Calendar,
	CheckSquare,
	Clock,
	Star,
	X,
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import {
	useFeedbackByTask,
	useFeedbackByMeeting,
	useFeedbackByAttendance,
	useCreateFeedback,
	useUpdateFeedback,
	useDeleteFeedback,
} from "../../services/feedbackService";
import {
	Feedback,
	CreateFeedbackData,
	UpdateFeedbackData,
} from "../../types/Feedback";
import PermissionGate from "../../Secure/PermissionGate";
import Permissions from "../../config/Permissions";
import { toastService } from "../../services/toastService";

interface FeedbackSectionProps {
	category: "task" | "meeting" | "attendance";
	entityId: string;
	entityTitle: string;
	submittedTo?: string | string[];
	className?: string;
}

const FeedbackSection: React.FC<FeedbackSectionProps> = ({
	category,
	entityId,
	entityTitle,
	submittedTo,
	className = "",
}) => {
	const { theme } = useTheme();
	const { user } = useAuth();
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [editingFeedback, setEditingFeedback] = useState<Feedback | null>(null);
	const [formData, setFormData] = useState({
		title: "",
		content: "",
	});

	// Get feedback based on category
	const getFeedbackQuery = () => {
		switch (category) {
			case "task":
				return useFeedbackByTask(entityId);
			case "meeting":
				return useFeedbackByMeeting(entityId);
			case "attendance":
				return useFeedbackByAttendance(entityId);
			default:
				return useFeedbackByTask(entityId);
		}
	};

	const { data: feedbackList, isLoading } = getFeedbackQuery();
	const createFeedbackMutation = useCreateFeedback();
	const updateFeedbackMutation = useUpdateFeedback();
	const deleteFeedbackMutation = useDeleteFeedback();

	const handleCreateFeedback = async () => {
		if (!user?.id) {
			toastService.error("Please log in to submit feedback");
			return;
		}

		if (!formData.title.trim() || !formData.content.trim()) {
			toastService.error("Please fill in all fields");
			return;
		}

		const feedbackData: CreateFeedbackData = {
			title: formData.title.trim(),
			content: formData.content.trim(),
			category,
			submittedTo: submittedTo || user.id, // If no specific recipient, submit to self
		};

		// Add category-specific ID
		switch (category) {
			case "task":
				feedbackData.taskId = entityId;
				break;
			case "meeting":
				feedbackData.meetingId = entityId;
				break;
			case "attendance":
				feedbackData.attendanceId = entityId;
				break;
		}

		try {
			await createFeedbackMutation.mutateAsync(feedbackData);
			setShowCreateModal(false);
			setFormData({ title: "", content: "" });
		} catch {
			// Error is handled by the mutation
		}
	};

	const handleUpdateFeedback = async () => {
		if (!editingFeedback) return;

		if (!formData.title.trim() || !formData.content.trim()) {
			toastService.error("Please fill in all fields");
			return;
		}

		const updateData: UpdateFeedbackData = {
			title: formData.title.trim(),
			content: formData.content.trim(),
		};

		try {
			await updateFeedbackMutation.mutateAsync({
				id: editingFeedback._id,
				data: updateData,
			});
			setShowEditModal(false);
			setEditingFeedback(null);
			setFormData({ title: "", content: "" });
		} catch {
			// Error is handled by the mutation
		}
	};

	const handleDeleteFeedback = async (feedbackId: string) => {
		if (window.confirm("Are you sure you want to delete this feedback?")) {
			try {
				await deleteFeedbackMutation.mutateAsync(feedbackId);
			} catch {
				// Error is handled by the mutation
			}
		}
	};

	const openEditModal = (feedback: Feedback) => {
		setEditingFeedback(feedback);
		setFormData({
			title: feedback.title,
			content: feedback.content,
		});
		setShowEditModal(true);
	};

	const getCategoryIcon = () => {
		switch (category) {
			case "task":
				return <CheckSquare size={20} />;
			case "meeting":
				return <Calendar size={20} />;
			case "attendance":
				return <Clock size={20} />;
			default:
				return <MessageSquare size={20} />;
		}
	};

	const getCategoryLabel = () => {
		// For task category, show the actual task title if available
		if (category === "task" && entityTitle) {
			return entityTitle;
		}

		switch (category) {
			case "task":
				return "Task";
			case "meeting":
				return "Event";
			case "attendance":
				return "Attendance";
			default:
				return "General";
		}
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const isOwner = (feedback: Feedback) => {
		return (
			user?.id === feedback.submittedBy ||
			(typeof feedback.submittedBy === "object" &&
				feedback.submittedBy._id === user?.id)
		);
	};

	return (
		<div className={`space-y-4 ${className}`}>
			{/* Header */}
			<div className='flex items-center justify-between'>
				<div className='flex items-center space-x-3'>
					<div
						className={`p-2 rounded-lg ${
							theme === "dark" ? "bg-purple-600/20" : "bg-purple-100"
						}`}>
						<MessageSquare
							className={`w-5 h-5 ${
								theme === "dark" ? "text-purple-400" : "text-purple-600"
							}`}
						/>
					</div>
					<div>
						<h3
							className={`text-lg font-semibold transition-colors duration-300 ${
								theme === "dark" ? "text-white" : "text-black"
							}`}>
							{category === "task" && entityTitle
								? entityTitle
								: getCategoryLabel()}{" "}
							Feedback
						</h3>
						<p
							className={`text-sm transition-colors duration-300 ${
								theme === "dark" ? "text-gray-400" : "text-gray-600"
							}`}>
							Share your thoughts and suggestions
							{submittedTo &&
								Array.isArray(submittedTo) &&
								submittedTo.length > 1 && (
									<span className='block mt-1 text-xs text-purple-500'>
										This feedback will be sent to {submittedTo.length} users
									</span>
								)}
						</p>
					</div>
				</div>

				<PermissionGate permission={Permissions.CreateFeeBack}>
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={() => setShowCreateModal(true)}
						className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
							theme === "dark"
								? "bg-purple-600 hover:bg-purple-700 text-white"
								: "bg-purple-600 hover:bg-purple-700 text-white"
						}`}>
						<Plus size={16} />
						<span>Add Feedback</span>
					</motion.button>
				</PermissionGate>
			</div>

			{/* Feedback List */}
			<div className='space-y-3'>
				{isLoading ? (
					<div className='text-center py-8'>
						<div className='text-gray-500'>Loading feedback...</div>
					</div>
				) : feedbackList && feedbackList.length > 0 ? (
					feedbackList.map((feedback) => (
						<motion.div
							key={feedback._id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							className={`p-4 rounded-lg transition-all duration-300 ${
								theme === "dark"
									? "bg-gray-800/60 backdrop-blur-xl border-gray-700/50"
									: "bg-white/60 backdrop-blur-xl border-gray-200/50"
							}`}>
							<div className='flex items-start justify-between'>
								<div className='flex-1 min-w-0'>
									<div className='flex items-center space-x-2 mb-2'>
										{getCategoryIcon()}
										<h4
											className={`font-semibold transition-colors duration-300 break-words ${
												theme === "dark" ? "text-white" : "text-black"
											}`}>
											{feedback.title}
										</h4>
									</div>
									<p
										className={`text-sm transition-colors duration-300 break-words mb-3 ${
											theme === "dark" ? "text-gray-300" : "text-gray-700"
										}`}>
										{feedback.content}
									</p>
									<div className='flex items-center space-x-4 text-xs text-gray-500'>
										<div className='flex items-center space-x-1'>
											<User size={14} />
											<span>
												{typeof feedback.submittedBy === "object"
													? `${feedback.submittedBy.firstName} ${feedback.submittedBy.lastName}`
													: "Unknown User"}
											</span>
										</div>
										<div className='flex items-center space-x-1'>
											<Calendar size={14} />
											<span>{formatDate(feedback.createdAt)}</span>
										</div>
									</div>
								</div>

								{/* Actions */}
								<div className='flex items-center space-x-2 ml-4'>
									{isOwner(feedback) && (
										<>
											<PermissionGate permission={Permissions.EditFeedback}>
												<button
													onClick={() => openEditModal(feedback)}
													className={`p-1 rounded transition-colors duration-200 ${
														theme === "dark"
															? "hover:bg-gray-700 text-gray-400 hover:text-white"
															: "hover:bg-gray-100 text-gray-600 hover:text-black"
													}`}
													title='Edit Feedback'>
													<Edit size={16} />
												</button>
											</PermissionGate>
											<PermissionGate permission={Permissions.DeleteFeedback}>
												<button
													onClick={() => handleDeleteFeedback(feedback._id)}
													className={`p-1 rounded transition-colors duration-200 ${
														theme === "dark"
															? "hover:bg-red-900/30 text-red-400 hover:text-red-300"
															: "hover:bg-red-50 text-red-600 hover:text-red-700"
													}`}
													title='Delete Feedback'>
													<Trash2 size={16} />
												</button>
											</PermissionGate>
										</>
									)}
								</div>
							</div>
						</motion.div>
					))
				) : (
					<div className='text-center py-8'>
						<MessageSquare
							className={`w-16 h-16 mx-auto mb-4 ${
								theme === "dark" ? "text-gray-600" : "text-gray-400"
							}`}
						/>
						<h3
							className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
								theme === "dark" ? "text-white" : "text-black"
							}`}>
							No feedback yet
						</h3>
						<p
							className={`transition-colors duration-300 ${
								theme === "dark" ? "text-gray-400" : "text-gray-600"
							}`}>
							Be the first to share your thoughts about this{" "}
							{getCategoryLabel().toLowerCase()}
						</p>
					</div>
				)}
			</div>

			{/* Create Feedback Modal */}
			{showCreateModal && (
				<div className='fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4'>
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						className={`w-full max-w-md p-6 rounded-xl ${
							theme === "dark"
								? "bg-gray-900 border border-gray-800"
								: "bg-white border border-gray-200"
						}`}>
						<div className='flex items-center justify-between mb-4'>
							<h2
								className={`text-xl font-semibold transition-colors duration-300 ${
									theme === "dark" ? "text-white" : "text-black"
								}`}>
								Add {getCategoryLabel()} Feedback
							</h2>
							<button
								onClick={() => setShowCreateModal(false)}
								className={`p-1 rounded transition-colors duration-300 ${
									theme === "dark"
										? "hover:bg-gray-800 text-gray-400 hover:text-white"
										: "hover:bg-gray-100 text-gray-600 hover:text-black"
								}`}>
								<X size={20} />
							</button>
						</div>

						<div className='space-y-4'>
							<div>
								<label
									className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
										theme === "dark" ? "text-white" : "text-black"
									}`}>
									Title
								</label>
								<input
									type='text'
									value={formData.title}
									onChange={(e) =>
										setFormData({ ...formData, title: e.target.value })
									}
									placeholder='Feedback title'
									className={`w-full px-3 py-2 rounded-lg border transition-colors duration-300 ${
										theme === "dark"
											? "bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
											: "bg-white border-gray-300 text-black placeholder-gray-500 focus:border-blue-500"
									}`}
								/>
							</div>

							<div>
								<label
									className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
										theme === "dark" ? "text-white" : "text-black"
									}`}>
									Content
								</label>
								<textarea
									value={formData.content}
									onChange={(e) =>
										setFormData({ ...formData, content: e.target.value })
									}
									placeholder='Share your feedback...'
									rows={4}
									className={`w-full px-3 py-2 rounded-lg border transition-colors duration-300 ${
										theme === "dark"
											? "bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
											: "bg-white border-gray-300 text-black placeholder-gray-500 focus:border-blue-500"
									}`}
								/>
							</div>

							<div className='flex space-x-3'>
								<button
									onClick={handleCreateFeedback}
									disabled={createFeedbackMutation.isPending}
									className={`flex-1 py-2 px-4 rounded-lg transition-all duration-300 ${
										theme === "dark"
											? "bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
											: "bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
									}`}>
									{createFeedbackMutation.isPending
										? "Submitting..."
										: "Submit Feedback"}
								</button>
								<button
									onClick={() => setShowCreateModal(false)}
									className={`flex-1 py-2 px-4 rounded-lg transition-colors duration-300 ${
										theme === "dark"
											? "bg-gray-800 hover:bg-gray-700 text-white"
											: "bg-gray-200 hover:bg-gray-300 text-black"
									}`}>
									Cancel
								</button>
							</div>
						</div>
					</motion.div>
				</div>
			)}

			{/* Edit Feedback Modal */}
			{showEditModal && editingFeedback && (
				<div className='fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4'>
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						className={`w-full max-w-md p-6 rounded-xl ${
							theme === "dark"
								? "bg-gray-900 border border-gray-800"
								: "bg-white border border-gray-200"
						}`}>
						<div className='flex items-center justify-between mb-4'>
							<h2
								className={`text-xl font-semibold transition-colors duration-300 ${
									theme === "dark" ? "text-white" : "text-black"
								}`}>
								Edit Feedback
							</h2>
							<button
								onClick={() => setShowEditModal(false)}
								className={`p-1 rounded transition-colors duration-300 ${
									theme === "dark"
										? "hover:bg-gray-800 text-gray-400 hover:text-white"
										: "hover:bg-gray-100 text-gray-600 hover:text-black"
								}`}>
								<X size={20} />
							</button>
						</div>

						<div className='space-y-4'>
							<div>
								<label
									className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
										theme === "dark" ? "text-white" : "text-black"
									}`}>
									Title
								</label>
								<input
									type='text'
									value={formData.title}
									onChange={(e) =>
										setFormData({ ...formData, title: e.target.value })
									}
									placeholder='Feedback title'
									className={`w-full px-3 py-2 rounded-lg border transition-colors duration-300 ${
										theme === "dark"
											? "bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
											: "bg-white border-gray-300 text-black placeholder-gray-500 focus:border-blue-500"
									}`}
								/>
							</div>

							<div>
								<label
									className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
										theme === "dark" ? "text-white" : "text-black"
									}`}>
									Content
								</label>
								<textarea
									value={formData.content}
									onChange={(e) =>
										setFormData({ ...formData, content: e.target.value })
									}
									placeholder='Share your feedback...'
									rows={4}
									className={`w-full px-3 py-2 rounded-lg border transition-colors duration-300 ${
										theme === "dark"
											? "bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
											: "bg-white border-gray-300 text-black placeholder-gray-500 focus:border-blue-500"
									}`}
								/>
							</div>

							<div className='flex space-x-3'>
								<button
									onClick={handleUpdateFeedback}
									disabled={updateFeedbackMutation.isPending}
									className={`flex-1 py-2 px-4 rounded-lg transition-all duration-300 ${
										theme === "dark"
											? "bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
											: "bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
									}`}>
									{updateFeedbackMutation.isPending
										? "Updating..."
										: "Update Feedback"}
								</button>
								<button
									onClick={() => setShowEditModal(false)}
									className={`flex-1 py-2 px-4 rounded-lg transition-colors duration-300 ${
										theme === "dark"
											? "bg-gray-800 hover:bg-gray-700 text-white"
											: "bg-gray-200 hover:bg-gray-300 text-black"
									}`}>
									Cancel
								</button>
							</div>
						</div>
					</motion.div>
				</div>
			)}
		</div>
	);
};

export default FeedbackSection;
