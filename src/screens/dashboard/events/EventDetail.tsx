/** @format */

import React, { useState } from "react";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";
import { useParams, useNavigate } from "react-router-dom";
import {
	Calendar,
	Edit,
	Trash2,
	ArrowLeft,
	MapPin,
	Clock,
	FileText,
	Settings,
	Users,
} from "lucide-react";
import { useTheme } from "../../../shared/contexts/ThemeContext";
import {
	useEvent,
	useUpdateEvent,
	useDeleteEvent,
} from "../../../shared/services/eventService";
import { EventForm } from "../../../shared/components/Form/EventForm";
import { updateEventSchema } from "../../../shared/schemas/EventSchema";
import { UpdateEventData } from "../../../shared/types/Event";
import PermissionGate from "../../../shared/Secure/PermissionGate";
import Permissions from "../../../shared/config/Permissions";
import GuestManagement from "../../../shared/components/GuestManagement";
import FeedbackSection from "../../../shared/components/Feedback/FeedbackSection";

const EventDetail: React.FC = () => {
	const { theme } = useTheme();
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [showEditModal, setShowEditModal] = useState(false);

	// React Query hooks
	const { data: event, isLoading, error } = useEvent(id!);
	const updateEventMutation = useUpdateEvent();
	const deleteEventMutation = useDeleteEvent();

	const handleUpdateEvent = async (data: UpdateEventData) => {
		if (!event) return;

		try {
			await updateEventMutation.mutateAsync({ id: event._id, data });
			setShowEditModal(false);
		} catch {
			// Error is handled by the mutation
		}
	};

	const handleDeleteEvent = async () => {
		if (!event) return;

		if (window.confirm("Are you sure you want to delete this event?")) {
			try {
				await deleteEventMutation.mutateAsync(event._id);
				navigate("/dashboard/events");
			} catch {
				// Error is handled by the mutation
			}
		}
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const getEventTypeColor = (eventType: string) => {
		switch (eventType) {
			case "team-meeting":
				return theme === "dark"
					? "bg-blue-600/20 text-blue-400"
					: "bg-blue-100 text-blue-700";
			case "conference":
				return theme === "dark"
					? "bg-purple-600/20 text-purple-400"
					: "bg-purple-100 text-purple-700";
			case "workshop":
				return theme === "dark"
					? "bg-green-600/20 text-green-400"
					: "bg-green-100 text-green-700";
			default:
				return theme === "dark"
					? "bg-gray-600/20 text-gray-400"
					: "bg-gray-100 text-gray-700";
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "scheduled":
				return theme === "dark"
					? "bg-green-600/20 text-green-400"
					: "bg-green-100 text-green-700";
			case "ongoing":
				return theme === "dark"
					? "bg-blue-600/20 text-blue-400"
					: "bg-blue-100 text-blue-700";
			case "completed":
				return theme === "dark"
					? "bg-gray-600/20 text-gray-400"
					: "bg-gray-100 text-gray-700";
			case "cancelled":
				return theme === "dark"
					? "bg-red-600/20 text-red-400"
					: "bg-red-100 text-red-700";
			default:
				return theme === "dark"
					? "bg-gray-600/20 text-gray-400"
					: "bg-gray-100 text-gray-700";
		}
	};

	if (isLoading) {
		return (
			<div className='flex items-center justify-center min-h-[50vh] px-4'>
				<div className='text-lg'>Loading event...</div>
			</div>
		);
	}

	if (error || !event) {
		return (
			<div className='flex items-center justify-center min-h-[50vh] px-4'>
				<div className='text-red-500 text-center'>
					Error loading event:{" "}
					{(error as { message?: string })?.message || "Event not found"}
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
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={() => window.history.back()}
						className={`p-2 rounded-lg transition-colors duration-300 flex-shrink-0 ${
							theme === "dark"
								? "hover:bg-gray-800 text-gray-400 hover:text-white"
								: "hover:bg-gray-100 text-gray-600 hover:text-black"
						}`}
						aria-label='Go back'
						title='Go back'>
						<ArrowLeft size={20} />
					</motion.button>
					<div className='flex-1 min-w-0'>
						<h1
							className={`text-xl sm:text-2xl lg:text-3xl font-bold transition-colors duration-300 break-words ${
								theme === "dark" ? "text-white" : "text-black"
							}`}>
							{event.title}
						</h1>
						<p
							className={`mt-2 text-base sm:text-lg transition-colors duration-300 ${
								theme === "dark" ? "text-gray-400" : "text-gray-600"
							}`}>
							Event Details
						</p>
					</div>
				</div>

				<div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3'>
					<PermissionGate permission={Permissions.ViewAttendance}>
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={() =>
								navigate(`/dashboard/events/${event._id}/attendance`)
							}
							className={`flex items-center justify-center px-3 sm:px-4 py-2 rounded-lg transition-all duration-300 text-sm sm:text-base ${
								theme === "dark"
									? "bg-green-600 hover:bg-green-700 text-white"
									: "bg-green-600 hover:bg-green-700 text-white"
							}`}>
							<Users size={16} className='mr-2' />
							<span className='hidden sm:inline'>View Attendance</span>
							<span className='sm:hidden'>Attendance</span>
						</motion.button>
					</PermissionGate>

					<PermissionGate permission={Permissions.EditEvent}>
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={() => setShowEditModal(true)}
							className={`flex items-center justify-center px-3 sm:px-4 py-2 rounded-lg transition-all duration-300 text-sm sm:text-base ${
								theme === "dark"
									? "bg-blue-600 hover:bg-blue-700 text-white"
									: "bg-blue-600 hover:bg-blue-700 text-white"
							}`}>
							<Edit size={16} className='mr-2' />
							<span className='hidden sm:inline'>Edit Event</span>
							<span className='sm:hidden'>Edit</span>
						</motion.button>
					</PermissionGate>

					<PermissionGate permission={Permissions.DeleteEvent}>
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={handleDeleteEvent}
							className={`flex items-center justify-center px-3 sm:px-4 py-2 rounded-lg transition-all duration-300 text-sm sm:text-base ${
								theme === "dark"
									? "bg-red-600 hover:bg-red-700 text-white"
									: "bg-red-600 hover:bg-red-700 text-white"
							}`}>
							<Trash2 size={16} className='mr-2' />
							<span className='hidden sm:inline'>Delete Event</span>
							<span className='sm:hidden'>Delete</span>
						</motion.button>
					</PermissionGate>
				</div>
			</motion.div>

			{/* Event Information */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.1 }}
				className={`p-4 sm:p-6 rounded-xl transition-all duration-300 ${
					theme === "dark"
						? "bg-gray-900/60 backdrop-blur-xl border-gray-800/50 shadow-xl"
						: "bg-white/60 backdrop-blur-xl border-gray-200/50 shadow-xl"
				}`}>
				<div className='flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 lg:gap-6 mb-6'>
					<div className='flex items-start space-x-3 sm:space-x-4'>
						<div
							className={`p-2 sm:p-3 rounded-lg flex-shrink-0 ${
								theme === "dark" ? "bg-blue-600/20" : "bg-blue-100"
							}`}>
							<Calendar
								className={`w-6 h-6 sm:w-8 sm:h-8 ${
									theme === "dark" ? "text-blue-400" : "text-blue-600"
								}`}
							/>
						</div>
						<div className='flex-1 min-w-0'>
							<h2
								className={`text-xl sm:text-2xl font-bold transition-colors duration-300 break-words ${
									theme === "dark" ? "text-white" : "text-black"
								}`}>
								{event.title}
							</h2>
							<div className='flex flex-wrap items-center gap-2 mt-2'>
								<span
									className={`px-3 py-1 rounded-full text-xs font-medium ${getEventTypeColor(
										event.eventType
									)}`}>
									{event.eventType.replace("-", " ")}
								</span>
								<span
									className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
										event.status
									)}`}>
									{event.status}
								</span>
							</div>
						</div>
					</div>

					<div
						className={`flex items-center space-x-1 text-sm transition-colors duration-300 ${
							theme === "dark" ? "text-gray-400" : "text-gray-500"
						}`}>
						<Calendar size={16} />
						<span>
							Created {new Date(event.createdAt).toLocaleDateString()}
						</span>
					</div>
				</div>

				<div className='space-y-4 sm:space-y-6'>
					{/* Description */}
					<div>
						<h3
							className={`font-semibold mb-2 transition-colors duration-300 ${
								theme === "dark" ? "text-white" : "text-black"
							}`}>
							Description
						</h3>
						<p
							className={`text-sm transition-colors duration-300 break-words ${
								theme === "dark" ? "text-gray-300" : "text-gray-700"
							}`}>
							{event.description}
						</p>
					</div>

					{/* Event Details Grid */}
					<div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6'>
						{/* Location */}
						<div className='flex items-start space-x-3'>
							<MapPin
								className={`w-5 h-5 mt-1 flex-shrink-0 ${
									theme === "dark" ? "text-gray-400" : "text-gray-500"
								}`}
							/>
							<div className='min-w-0 flex-1'>
								<h4
									className={`font-semibold text-sm transition-colors duration-300 ${
										theme === "dark" ? "text-white" : "text-black"
									}`}>
									Location
								</h4>
								<p
									className={`text-sm transition-colors duration-300 break-words ${
										theme === "dark" ? "text-gray-300" : "text-gray-700"
									}`}>
									{event.location}
								</p>
							</div>
						</div>

						{/* Date & Time */}
						<div className='flex items-start space-x-3'>
							<Clock
								className={`w-5 h-5 mt-1 flex-shrink-0 ${
									theme === "dark" ? "text-gray-400" : "text-gray-500"
								}`}
							/>
							<div className='min-w-0 flex-1'>
								<h4
									className={`font-semibold text-sm transition-colors duration-300 ${
										theme === "dark" ? "text-white" : "text-black"
									}`}>
									Date & Time
								</h4>
								<div className='text-sm space-y-1'>
									<p
										className={`transition-colors duration-300 break-words ${
											theme === "dark" ? "text-gray-300" : "text-gray-700"
										}`}>
										<strong>Start:</strong> {formatDate(event.startDate)}
									</p>
									<p
										className={`transition-colors duration-300 break-words ${
											theme === "dark" ? "text-gray-300" : "text-gray-700"
										}`}>
										<strong>End:</strong> {formatDate(event.endDate)}
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Agenda/File */}
					{event.agenda && (
						<div>
							<h3
								className={`font-semibold mb-2 transition-colors duration-300 ${
									theme === "dark" ? "text-white" : "text-black"
								}`}>
								Event Agenda
							</h3>
							<div className='flex items-center space-x-2'>
								<FileText
									className={`w-5 h-5 flex-shrink-0 ${
										theme === "dark" ? "text-gray-400" : "text-gray-500"
									}`}
								/>
								<a
									href={event.agenda}
									target='_blank'
									rel='noopener noreferrer'
									className={`text-sm transition-colors duration-300 hover:underline break-words ${
										theme === "dark"
											? "text-blue-400 hover:text-blue-300"
											: "text-blue-600 hover:text-blue-700"
									}`}>
									View Agenda
								</a>
							</div>
						</div>
					)}
				</div>
			</motion.div>

			{/* Guest Management */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.15 }}
				className={`p-4 sm:p-6 rounded-xl transition-all duration-300 ${
					theme === "dark"
						? "bg-gray-900/60 backdrop-blur-xl border-gray-800/50 shadow-xl"
						: "bg-white/60 backdrop-blur-xl border-gray-200/50 shadow-xl"
				}`}>
				<PermissionGate permission={Permissions.ManageEventGuests}>
					<GuestManagement event={event} />
				</PermissionGate>
			</motion.div>

			{/* Event Feedback */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.2 }}
				className={`p-4 sm:p-6 rounded-xl transition-all duration-300 ${
					theme === "dark"
						? "bg-gray-900/60 backdrop-blur-xl border-gray-800/50 shadow-xl"
						: "bg-white/60 backdrop-blur-xl border-gray-200/50 shadow-xl"
				}`}>
				<FeedbackSection
					category='meeting'
					entityId={event._id}
					entityTitle={event.title}
				/>
			</motion.div>

			{/* Event Actions */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.2 }}
				className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
				<PermissionGate permission={Permissions.ViewAttendance}>
					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						onClick={() =>
							navigate(`/dashboard/events/${event._id}/attendance`)
						}
						className={`p-4 rounded-xl transition-all duration-300 ${
							theme === "dark"
								? "bg-gray-800/60 backdrop-blur-xl border-gray-700/50 hover:bg-gray-700/60"
								: "bg-white/60 backdrop-blur-xl border-gray-200/50 hover:bg-gray-50/60"
						}`}>
						<div className='flex items-center space-x-3'>
							<Users
								className={`w-6 h-6 flex-shrink-0 ${
									theme === "dark" ? "text-green-400" : "text-green-600"
								}`}
							/>
							<div className='text-left min-w-0 flex-1'>
								<h3
									className={`font-semibold transition-colors duration-300 break-words ${
										theme === "dark" ? "text-white" : "text-black"
									}`}>
									View Attendance
								</h3>
								<p
									className={`text-sm transition-colors duration-300 ${
										theme === "dark" ? "text-gray-400" : "text-gray-600"
									}`}>
									See who attended
								</p>
							</div>
						</div>
					</motion.button>
				</PermissionGate>

				<PermissionGate permission={Permissions.EditEvent}>
					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						onClick={() => setShowEditModal(true)}
						className={`p-4 rounded-xl transition-all duration-300 ${
							theme === "dark"
								? "bg-gray-800/60 backdrop-blur-xl border-gray-700/50 hover:bg-gray-700/60"
								: "bg-white/60 backdrop-blur-xl border-gray-200/50 hover:bg-gray-50/60"
						}`}>
						<div className='flex items-center space-x-3'>
							<Edit
								className={`w-6 h-6 flex-shrink-0 ${
									theme === "dark" ? "text-blue-400" : "text-blue-600"
								}`}
							/>
							<div className='text-left min-w-0 flex-1'>
								<h3
									className={`font-semibold transition-colors duration-300 break-words ${
										theme === "dark" ? "text-white" : "text-black"
									}`}>
									Edit Event
								</h3>
								<p
									className={`text-sm transition-colors duration-300 ${
										theme === "dark" ? "text-gray-400" : "text-gray-600"
									}`}>
									Update event details
								</p>
							</div>
						</div>
					</motion.button>
				</PermissionGate>

				<PermissionGate permission={Permissions.EditEvent}>
					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						className={`p-4 rounded-xl transition-all duration-300 ${
							theme === "dark"
								? "bg-gray-800/60 backdrop-blur-xl border-gray-700/50 hover:bg-gray-700/60"
								: "bg-white/60 backdrop-blur-xl border-gray-200/50 hover:bg-gray-50/60"
						}`}>
						<div className='flex items-center space-x-3'>
							<Settings
								className={`w-6 h-6 flex-shrink-0 ${
									theme === "dark" ? "text-green-400" : "text-green-600"
								}`}
							/>
							<div className='text-left min-w-0 flex-1'>
								<h3
									className={`font-semibold transition-colors duration-300 break-words ${
										theme === "dark" ? "text-white" : "text-black"
									}`}>
									Event Settings
								</h3>
								<p
									className={`text-sm transition-colors duration-300 ${
										theme === "dark" ? "text-gray-400" : "text-gray-600"
									}`}>
									Manage event preferences
								</p>
							</div>
						</div>
					</motion.button>
				</PermissionGate>

				<PermissionGate permission={Permissions.DeleteEvent}>
					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						onClick={handleDeleteEvent}
						className={`p-4 rounded-xl transition-all duration-300 ${
							theme === "dark"
								? "bg-red-900/20 backdrop-blur-xl border-red-800/50 hover:bg-red-800/20"
								: "bg-red-50/60 backdrop-blur-xl border-red-200/50 hover:bg-red-100/60"
						}`}>
						<div className='flex items-center space-x-3'>
							<Trash2
								className={`w-6 h-6 flex-shrink-0 ${
									theme === "dark" ? "text-red-400" : "text-red-600"
								}`}
							/>
							<div className='text-left min-w-0 flex-1'>
								<h3
									className={`font-semibold transition-colors duration-300 break-words ${
										theme === "dark" ? "text-white" : "text-black"
									}`}>
									Delete Event
								</h3>
								<p
									className={`text-sm transition-colors duration-300 ${
										theme === "dark" ? "text-gray-400" : "text-gray-600"
									}`}>
									Permanently remove event
								</p>
							</div>
						</div>
					</motion.button>
				</PermissionGate>
			</motion.div>

			{/* Edit Event Modal */}
			{showEditModal &&
				event &&
				createPortal(
					<div className='fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4'>
						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							className={`w-full max-w-md p-4 sm:p-6 rounded-xl ${
								theme === "dark"
									? "bg-gray-900 border border-gray-800"
									: "bg-white border border-gray-200"
							}`}>
							<h2
								className={`text-xl font-semibold mb-4 transition-colors duration-300 ${
									theme === "dark" ? "text-white" : "text-black"
								}`}>
								Edit Event
							</h2>
							<EventForm
								schema={updateEventSchema}
								onSubmit={handleUpdateEvent}
								submitButtonText={
									updateEventMutation.isPending ? "Updating..." : "Update Event"
								}
								defaultValues={{
									title: event.title,
									description: event.description,
									startDate: event.startDate,
									endDate: event.endDate,
									location: event.location,
									eventType: event.eventType,
								}}
								className='space-y-4'
							/>
							<button
								onClick={() => setShowEditModal(false)}
								className={`mt-4 w-full py-2 px-4 rounded-lg transition-colors duration-300 ${
									theme === "dark"
										? "bg-gray-800 hover:bg-gray-700 text-white"
										: "bg-gray-200 hover:bg-gray-300 text-black"
								}`}>
								Cancel
							</button>
						</motion.div>
					</div>,
					document.body
				)}
		</div>
	);
};

export default EventDetail;
