/** @format */

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
	Calendar,
	Plus,
	Edit,
	Trash2,
	Search,
	MapPin,
	Eye,
	Clock,
	FileText,
	CheckCircle,
	CheckCheck,
	X,
} from "lucide-react";
import { useTheme } from "../../../shared/contexts/ThemeContext";
import { useAuth } from "../../../shared/contexts/AuthContext";
import {
	useEvents,
	useCreateEvent,
	useUpdateEvent,
	useDeleteEvent,
} from "../../../shared/services/eventService";
import {
	useCreateAttendance,
	useAttendanceByUserAndEvent,
	useVerifyAttendance,
} from "../../../shared/services/attendanceService";
import { EventForm } from "../../../shared/components/Form/EventForm";
import {
	eventSchema,
	updateEventSchema,
} from "../../../shared/schemas/EventSchema";
import {
	CreateEventData,
	UpdateEventData,
	Event,
} from "../../../shared/types/Event";
import { CreateAttendanceData } from "../../../shared/types/Attendance";
import PermissionGate from "../../../shared/Secure/PermissionGate";
import Permissions from "../../../shared/config/Permissions";
import { useNavigate } from "react-router-dom";
import { extractObjectId } from "../../../shared/utils/validation";

// Attendance Button Component
const AttendanceButton: React.FC<{ event: Event }> = ({ event }) => {
	const { theme } = useTheme();
	const { user } = useAuth();
	const createAttendanceMutation = useCreateAttendance();
	const verifyAttendanceMutation = useVerifyAttendance();
	const { data: existingAttendance } = useAttendanceByUserAndEvent(
		user?.id || "",
		event._id
	);

	const validateAttendanceMarking = () => {
		if (!user) {
			alert("Please log in to mark attendance");
			return false;
		}

		if (existingAttendance) {
			alert("You have already marked attendance for this event");
			return false;
		}

		const now = new Date();
		const eventStartDate = new Date(event.startDate);
		const eventEndDate = new Date(event.endDate);

		// Check if event has ended
		if (now > eventEndDate) {
			alert(
				"This event has already ended. You cannot mark attendance for past events."
			);
			return false;
		}

		// Check if event hasn't started yet (allow 30 minutes before start)
		const thirtyMinutesBeforeStart = new Date(
			eventStartDate.getTime() - 30 * 60 * 1000
		);
		if (now < thirtyMinutesBeforeStart) {
			alert(
				"This event hasn't started yet. You can mark attendance 30 minutes before the event starts."
			);
			return false;
		}

		return true;
	};

	const handleMarkAttendance = async () => {
		if (!validateAttendanceMarking()) {
			return;
		}

		const now = new Date();
		const eventStartDate = new Date(event.startDate);
		const eventEndDate = new Date(event.endDate);

		// Determine attendance status based on timing
		let status: "present" | "late" | "left_early" | "absent" | "excused" =
			"present";
		let lateMinutes = 0;
		let earlyLeaveMinutes = 0;

		if (now < eventStartDate) {
			// Event hasn't started yet (but within 30 minutes)
			status = "present";
		} else if (now > eventEndDate) {
			// Event has ended
			status = "absent";
		} else {
			// Event is ongoing
			const startTimeDiff = now.getTime() - eventStartDate.getTime();
			const endTimeDiff = eventEndDate.getTime() - now.getTime();

			if (startTimeDiff > 15 * 60 * 1000) {
				// More than 15 minutes late
				status = "late";
				lateMinutes = Math.floor(startTimeDiff / (60 * 1000));
			} else {
				status = "present";
			}
		}

		const attendanceData: CreateAttendanceData = {
			user: user!.id,
			event: event._id,
			attendance: true,
			status,
			lateMinutes,
			earlyLeaveMinutes,
			checkInTime: now.toISOString(),
		};

		try {
			await createAttendanceMutation.mutateAsync(attendanceData);
		} catch (error) {
			// Error is handled by the mutation
		}
	};

	const handleVerifyAttendance = async () => {
		if (!existingAttendance) return;

		const newVerifiedStatus = !existingAttendance.verified;

		// Check if user is authenticated
		if (!user?.id) {
			alert("Please log in to verify attendance");
			return;
		}

		// Extract the attendance ID using the utility function
		const attendanceId = extractObjectId(existingAttendance);

		if (!attendanceId) {
			console.error(
				"No valid ID found in attendance object:",
				existingAttendance
			);
			alert("Invalid attendance record - missing or invalid ID");
			return;
		}

		try {
			await verifyAttendanceMutation.mutateAsync({
				id: attendanceId,
				data: {
					verified: newVerifiedStatus,
					verifiedBy: user.id,
					verificationNotes: `${
						newVerifiedStatus ? "Verified" : "Unverified"
					} by ${user.firstName} ${user.lastName}`,
				},
			});
		} catch (error) {
			// Error is handled by the mutation
		}
	};

	if (existingAttendance) {
		return (
			<div className='flex items-center space-x-1'>
				<button
					disabled
					className={`p-2 rounded-lg transition-all duration-200 ${
						theme === "dark"
							? "bg-green-800/30 text-green-400 cursor-not-allowed"
							: "bg-green-50 text-green-600 cursor-not-allowed"
					}`}
					title='Attendance Already Marked'>
					<CheckCheck size={16} />
				</button>
				<PermissionGate permission={Permissions.EditAttendance}>
					<motion.button
						onClick={handleVerifyAttendance}
						disabled={verifyAttendanceMutation.isPending}
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.9 }}
						className={`p-2 rounded-lg transition-all duration-200 ${
							verifyAttendanceMutation.isPending
								? "bg-blue-500 text-white"
								: existingAttendance.verified
								? theme === "dark"
									? "hover:bg-red-800/30 text-red-400 hover:text-red-300"
									: "hover:bg-red-50 text-red-600 hover:text-red-700"
								: theme === "dark"
								? "hover:bg-blue-800/30 text-blue-400 hover:text-blue-300"
								: "hover:bg-blue-50 text-blue-600 hover:text-blue-700"
						}`}
						title={
							existingAttendance.verified
								? "Unverify Attendance"
								: "Verify Attendance"
						}>
						{verifyAttendanceMutation.isPending ? (
							<motion.div
								animate={{ rotate: 360 }}
								transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
								className='w-4 h-4 border-2 border-white border-t-transparent rounded-full'
							/>
						) : existingAttendance.verified ? (
							<X size={16} />
						) : (
							<CheckCircle size={16} />
						)}
					</motion.button>
				</PermissionGate>
			</div>
		);
	}

	return (
		<button
			onClick={handleMarkAttendance}
			disabled={createAttendanceMutation.isPending}
			className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
				theme === "dark"
					? "hover:bg-green-800/30 text-green-400 hover:text-green-300"
					: "hover:bg-green-50 text-green-600 hover:text-green-700"
			}`}
			title='Mark Attendance'>
			<CheckCircle size={16} />
		</button>
	);
};

const Events: React.FC = () => {
	const { theme } = useTheme();
	const { user } = useAuth();
	const navigate = useNavigate();
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);

	// React Query hooks
	const { data: events, isLoading, error } = useEvents();
	const createEventMutation = useCreateEvent();
	const updateEventMutation = useUpdateEvent();
	const deleteEventMutation = useDeleteEvent();

	// Filter events based on search term
	const filteredEvents = (Array.isArray(events) ? events : []).filter(
		(event) =>
			event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
			event.location.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handleCreateEvent = async (data: CreateEventData) => {
		try {
			await createEventMutation.mutateAsync(data);
			setShowCreateModal(false);
		} catch (error) {
			// Error is handled by the mutation
		}
	};

	const handleUpdateEvent = async (data: UpdateEventData) => {
		if (!selectedEvent) return;

		try {
			// Validate dates if both are provided
			if (data.startDate && data.endDate) {
				const startDate = new Date(data.startDate);
				const endDate = new Date(data.endDate);

				if (endDate <= startDate) {
					alert("End date must be after start date");
					return;
				}
			}

			// Validate that dates are in the future if provided
			if (data.startDate) {
				const startDate = new Date(data.startDate);
				const now = new Date();
				if (startDate <= now) {
					alert("Start date must be in the future");
					return;
				}
			}

			await updateEventMutation.mutateAsync({ id: selectedEvent._id, data });
			setShowEditModal(false);
			setSelectedEvent(null);
		} catch (error) {
			// Error is handled by the mutation
		}
	};

	const handleDeleteEvent = async (eventId: string) => {
		if (window.confirm("Are you sure you want to delete this event?")) {
			try {
				await deleteEventMutation.mutateAsync(eventId);
			} catch {
				// Error is handled by the mutation
			}
		}
	};

	const openEditModal = (event: Event) => {
		setSelectedEvent(event);
		setShowEditModal(true);
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
			<div className='flex items-center justify-center h-64'>
				<div className='text-lg'>Loading events...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='flex items-center justify-center h-64'>
				<div className='text-red-500'>
					Error loading events:{" "}
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
				className='flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0'>
				<div>
					<h1
						className={`text-2xl sm:text-3xl font-bold transition-colors duration-300 ${
							theme === "dark" ? "text-white" : "text-black"
						}`}>
						Events
					</h1>
					<p
						className={`mt-2 text-base sm:text-lg transition-colors duration-300 ${
							theme === "dark" ? "text-gray-400" : "text-gray-600"
						}`}>
						Manage your organization's events
					</p>
				</div>

				{/* Temporarily removed PermissionGate to fix create button */}
				<PermissionGate permission={Permissions.CreateEvent}>
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={() => {
							setShowCreateModal(true);
						}}
						className={`flex items-center px-3 sm:px-4 py-2 rounded-lg transition-all duration-300 text-sm sm:text-base ${
							theme === "dark"
								? "bg-blue-600 hover:bg-blue-700 text-white"
								: "bg-blue-600 hover:bg-blue-700 text-white"
						}`}>
						<Plus size={18} className='mr-2' />
						Create Event
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
					size={18}
				/>
				<input
					type='text'
					placeholder='Search events...'
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className={`w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 rounded-lg border transition-colors duration-300 text-sm sm:text-base ${
						theme === "dark"
							? "bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
							: "bg-white border-gray-300 text-black placeholder-gray-500 focus:border-blue-500"
					}`}
				/>
			</motion.div>

			{/* Events Grid */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.2 }}
				className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-6'>
				{filteredEvents.map((event, index) => (
					<motion.div
						key={event._id}
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
									<Calendar
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
										title={event.title}>
										{event.title}
									</h3>
									<div className='flex items-center space-x-2 mt-2'>
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

							{/* Action Buttons */}
							<div className='flex items-center space-x-1 flex-shrink-0'>
								{/* Mark Attendance Button */}
								<AttendanceButton event={event} />
								<button
									onClick={() => navigate(`/dashboard/events/${event._id}`)}
									className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
										theme === "dark"
											? "hover:bg-gray-800 text-gray-400 hover:text-white"
											: "hover:bg-gray-100 text-gray-600 hover:text-black"
									}`}
									title='View Event Details'>
									<Eye size={16} />
								</button>
								<PermissionGate permission={Permissions.EditEvent}>
									<button
										onClick={() => openEditModal(event)}
										className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
											theme === "dark"
												? "hover:bg-gray-800 text-gray-400 hover:text-white"
												: "hover:bg-gray-100 text-gray-600 hover:text-black"
										}`}
										title='Edit Event'>
										<Edit size={16} />
									</button>
								</PermissionGate>
								<PermissionGate permission={Permissions.DeleteEvent}>
									<button
										onClick={() => handleDeleteEvent(event._id)}
										className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
											theme === "dark"
												? "hover:bg-red-900/30 text-red-400 hover:text-red-300"
												: "hover:bg-red-50 text-red-600 hover:text-red-700"
										}`}
										title='Delete Event'>
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
								{event.description}
							</p>
						</div>

						{/* Event Details */}
						<div className='grid grid-cols-2 gap-3 mb-4'>
							{/* Location */}
							<div className='flex items-center space-x-2 text-xs'>
								<MapPin
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
										Location
									</div>
									<div
										className={`transition-colors duration-300 ${
											theme === "dark" ? "text-gray-400" : "text-gray-500"
										}`}>
										{event.location}
									</div>
								</div>
							</div>

							{/* Duration */}
							<div className='flex items-center space-x-2 text-xs'>
								<Clock
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
										Duration
									</div>
									<div
										className={`transition-colors duration-300 ${
											theme === "dark" ? "text-gray-400" : "text-gray-500"
										}`}>
										{formatDate(event.startDate)} - {formatDate(event.endDate)}
									</div>
								</div>
							</div>
						</div>

						{/* Agenda Section */}
						{event.agenda && (
							<div className='mb-4'>
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
											Agenda
										</div>
										<div className='flex items-center space-x-2'>
											<a
												href={event.agenda}
												target='_blank'
												rel='noopener noreferrer'
												className={`text-xs transition-colors duration-300 hover:underline ${
													theme === "dark"
														? "text-blue-400 hover:text-blue-300"
														: "text-blue-600 hover:text-blue-700"
												}`}>
												View Agenda
											</a>
										</div>
									</div>
								</div>
							</div>
						)}

						{/* Footer */}
						<div className='mt-auto pt-3 border-t border-gray-200 dark:border-gray-700'>
							<div className='flex items-center justify-between'>
								<div className='flex items-center space-x-2 text-xs'>
									<Calendar
										size={14}
										className={`flex-shrink-0 ${
											theme === "dark" ? "text-gray-400" : "text-gray-500"
										}`}
									/>
									<span
										className={`transition-colors duration-300 ${
											theme === "dark" ? "text-gray-400" : "text-gray-500"
										}`}>
										Created {new Date(event.createdAt).toLocaleDateString()}
									</span>
								</div>

								{/* Event ID (shortened) */}
								<div className='text-xs'>
									<span
										className={`transition-colors duration-300 ${
											theme === "dark" ? "text-gray-400" : "text-gray-500"
										}`}>
										ID: {event._id.slice(-6)}
									</span>
								</div>
							</div>
						</div>
					</motion.div>
				))}
			</motion.div>

			{/* Empty State */}
			{filteredEvents.length === 0 && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className='text-center py-12'>
					<Calendar
						className={`w-16 h-16 mx-auto mb-4 ${
							theme === "dark" ? "text-gray-600" : "text-gray-400"
						}`}
					/>
					<h3
						className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
							theme === "dark" ? "text-white" : "text-black"
						}`}>
						No events found
					</h3>
					<p
						className={`transition-colors duration-300 ${
							theme === "dark" ? "text-gray-400" : "text-gray-600"
						}`}>
						{searchTerm
							? "Try adjusting your search terms"
							: "Get started by creating your first event"}
					</p>
				</motion.div>
			)}

			{/* Create Event Modal */}
			{showCreateModal && (
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
							className={`text-lg sm:text-xl font-semibold mb-3 sm:mb-4 transition-colors duration-300 ${
								theme === "dark" ? "text-white" : "text-black"
							}`}>
							Create New Event
						</h2>
						<EventForm
							schema={eventSchema}
							onSubmit={handleCreateEvent}
							submitButtonText={
								createEventMutation.isPending ? "Creating..." : "Create Event"
							}
							className='space-y-4'
						/>
						<button
							onClick={() => {
								setShowCreateModal(false);
							}}
							className={`mt-3 sm:mt-4 w-full py-2 px-4 rounded-lg transition-colors duration-300 text-sm sm:text-base ${
								theme === "dark"
									? "bg-gray-800 hover:bg-gray-700 text-white"
									: "bg-gray-200 hover:bg-gray-300 text-black"
							}`}>
							Cancel
						</button>
					</motion.div>
				</div>
			)}

			{/* Edit Event Modal */}
			{showEditModal && selectedEvent && (
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
							className={`text-lg sm:text-xl font-semibold mb-3 sm:mb-4 transition-colors duration-300 ${
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
								title: selectedEvent.title,
								description: selectedEvent.description,
								startDate: selectedEvent.startDate,
								endDate: selectedEvent.endDate,
								location: selectedEvent.location,
								eventType: selectedEvent.eventType,
							}}
							existingEvent={selectedEvent}
							className='space-y-4'
						/>
						<button
							onClick={() => setShowEditModal(false)}
							className={`mt-3 sm:mt-4 w-full py-2 px-4 rounded-lg transition-colors duration-300 text-sm sm:text-base ${
								theme === "dark"
									? "bg-gray-800 hover:bg-gray-700 text-white"
									: "bg-gray-200 hover:bg-gray-300 text-black"
							}`}>
							Cancel
						</button>
					</motion.div>
				</div>
			)}
		</div>
	);
};

export default Events;
