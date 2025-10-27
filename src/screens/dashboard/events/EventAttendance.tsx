/** @format */

import React, { useState } from "react";
import { motion } from "framer-motion";
import * as XLSX from "xlsx";
import { useParams, useNavigate } from "react-router-dom";
import {
	ArrowLeft,
	Users,
	Search,
	Filter,
	Download,
	Eye,
	Edit,
	Trash2,
	CheckCircle,
	Clock,
	AlertCircle,
	X,
	User,
	Calendar,
	MapPin,
	MessageCircle,
} from "lucide-react";
import { useTheme } from "../../../shared/contexts/ThemeContext";
import { useAuth } from "../../../shared/contexts/AuthContext";
import { useEvent } from "../../../shared/services/eventService";
import {
	useAttendanceByEvent,
	useVerifyAttendance,
} from "../../../shared/services/attendanceService";
import { Attendance } from "../../../shared/types/Attendance";
import PermissionGate from "../../../shared/Secure/PermissionGate";
import Permissions from "../../../shared/config/Permissions";
import Modal from "../../../shared/components/Modal";
import { toastService } from "../../../shared/services/toastService";
import { extractObjectId } from "../../../shared/utils/validation";
import FeedbackSection from "../../../shared/components/Feedback/FeedbackSection";

const EventAttendance: React.FC = () => {
	const { theme } = useTheme();
	const { user } = useAuth();
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [selectedAttendance, setSelectedAttendance] =
		useState<Attendance | null>(null);
	const [showDetailModal, setShowDetailModal] = useState(false);
	const [verifyingAttendanceId, setVerifyingAttendanceId] = useState<
		string | null
	>(null);
	const [showSuccessAnimation, setShowSuccessAnimation] = useState<
		string | null
	>(null);
	const [showFeedbackModal, setShowFeedbackModal] = useState(false);
	const [selectedAttendanceForFeedback, setSelectedAttendanceForFeedback] =
		useState<Attendance | null>(null);

	// React Query hooks
	const {
		data: event,
		isLoading: eventLoading,
		error: eventError,
	} = useEvent(id!);
	const {
		data: attendanceList,
		isLoading: attendanceLoading,
		error: attendanceError,
	} = useAttendanceByEvent(id!);
	const verifyAttendanceMutation = useVerifyAttendance();

	// Filter attendance based on search term and status
	const filteredAttendance = (attendanceList || []).filter((attendance) => {
		const matchesSearch =
			attendance.user.firstName
				.toLowerCase()
				.includes(searchTerm.toLowerCase()) ||
			attendance.user.lastName
				.toLowerCase()
				.includes(searchTerm.toLowerCase()) ||
			attendance.user.email.toLowerCase().includes(searchTerm.toLowerCase());

		const matchesStatus =
			statusFilter === "all" || attendance.status === statusFilter;

		return matchesSearch && matchesStatus;
	});

	const getStatusColor = (status: string) => {
		switch (status) {
			case "present":
				return "bg-green-100 text-green-800";
			case "late":
				return "bg-yellow-100 text-yellow-800";
			case "left_early":
				return "bg-orange-100 text-orange-800";
			case "absent":
				return "bg-red-100 text-red-800";
			case "excused":
				return "bg-blue-100 text-blue-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "present":
				return <CheckCircle size={16} className='text-green-600' />;
			case "late":
				return <Clock size={16} className='text-yellow-600' />;
			case "left_early":
				return <AlertCircle size={16} className='text-orange-600' />;
			case "absent":
				return <X size={16} className='text-red-600' />;
			case "excused":
				return <User size={16} className='text-blue-600' />;
			default:
				return <User size={16} className='text-gray-600' />;
		}
	};

	const formatTime = (timeString?: string) => {
		if (!timeString) return "N/A";
		return new Date(timeString).toLocaleString();
	};

	const handleViewDetail = (attendance: Attendance) => {
		setSelectedAttendance(attendance);
		setShowDetailModal(true);
	};

	const handleOpenFeedbackModal = (attendance: Attendance) => {
		setSelectedAttendanceForFeedback(attendance);
		setShowFeedbackModal(true);
	};

	const handleVerifyAttendance = async (attendance: Attendance) => {
		const newVerifiedStatus = !attendance.verified;

		// Check if user is authenticated
		if (!user?.id) {
			toastService.error("Please log in to verify attendance");
			return;
		}

		// Extract the attendance ID using the utility function
		const attendanceId = extractObjectId(attendance);

		if (!attendanceId) {
			console.error("No valid ID found in attendance object:", attendance);
			toastService.error("Invalid attendance record - missing or invalid ID");
			return;
		}

		// Set loading state
		setVerifyingAttendanceId(attendanceId);

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

			// Show success animation
			setShowSuccessAnimation(attendanceId);
			setTimeout(() => {
				setShowSuccessAnimation(null);
			}, 2000);
		} catch (error) {
			// Error is handled by the mutation
		} finally {
			// Clear loading state
			setVerifyingAttendanceId(null);
		}
	};

	const exportAttendance = () => {
		if (!event || !filteredAttendance.length) return;

		const data = filteredAttendance.map((attendance) => ({
			Name: `${attendance.user.firstName} ${attendance.user.lastName}`,
			Email: attendance.user.email,
			Status: attendance.status,
			"Check-in Time": attendance.checkInTime
				? formatTime(attendance.checkInTime)
				: "N/A",
			"Check-out Time": attendance.checkOutTime
				? formatTime(attendance.checkOutTime)
				: "N/A",
			"Late Minutes": attendance.lateMinutes || 0,
			"Early Leave Minutes": attendance.earlyLeaveMinutes || 0,
			Verified: attendance.verified ? "Yes" : "No",
			Feedback: attendance.feedback || "",
		}));

		// Create a new workbook and worksheet
		const worksheet = XLSX.utils.json_to_sheet(data);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

		// Write to file
		XLSX.writeFile(
			workbook,
			`${event.title}_attendance.xlsx`.replace(/[^a-z0-9]/gi, "_")
		);
	};

	if (eventLoading || attendanceLoading) {
		return (
			<div className='flex items-center justify-center h-64'>
				<div className='text-lg'>Loading attendance data...</div>
			</div>
		);
	}

	if (eventError || attendanceError || !event) {
		return (
			<div className='flex items-center justify-center h-64'>
				<div className='text-red-500'>
					Error loading data:{" "}
					{(eventError || (attendanceError as { message?: string }))?.message ||
						"Data not found"}
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
				className='flex items-center justify-between'>
				<div className='flex items-center space-x-4'>
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={() => navigate(`/dashboard/events/${event._id}`)}
						className={`p-2 rounded-lg transition-colors duration-300 ${
							theme === "dark"
								? "hover:bg-gray-800 text-gray-400 hover:text-white"
								: "hover:bg-gray-100 text-gray-600 hover:text-black"
						}`}
						aria-label='Go back'
						title='Go back'>
						<ArrowLeft size={20} />
					</motion.button>
					<div>
						<h1
							className={`text-3xl font-bold transition-colors duration-300 ${
								theme === "dark" ? "text-white" : "text-black"
							}`}>
							Event Attendance
						</h1>
						<p
							className={`mt-2 text-lg transition-colors duration-300 ${
								theme === "dark" ? "text-gray-400" : "text-gray-600"
							}`}>
							{event.title}
						</p>
					</div>
				</div>

				<div className='flex items-center space-x-3'>
					<PermissionGate permission={Permissions.ViewAttendance}>
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={exportAttendance}
							disabled={!filteredAttendance.length}
							className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 ${
								theme === "dark"
									? "bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
									: "bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
							}`}>
							<Download size={20} className='mr-2' />
							Export CSV
						</motion.button>
					</PermissionGate>

					{/* Verification Progress Indicator */}
					{verifyingAttendanceId && (
						<motion.div
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							className='flex items-center space-x-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm'>
							<motion.div
								animate={{ rotate: 360 }}
								transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
								className='w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full'
							/>
							<span>Verifying attendance...</span>
						</motion.div>
					)}
				</div>
			</motion.div>

			{/* Event Summary */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.1 }}
				className={`p-6 rounded-xl transition-all duration-300 ${
					theme === "dark"
						? "bg-gray-900/60 backdrop-blur-xl border-gray-800/50 shadow-xl"
						: "bg-white/60 backdrop-blur-xl border-gray-200/50 shadow-xl"
				}`}>
				<div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
					<div className='text-center'>
						<div
							className={`text-2xl font-bold ${
								theme === "dark" ? "text-white" : "text-black"
							}`}>
							{attendanceList?.length || 0}
						</div>
						<div
							className={`text-sm ${
								theme === "dark" ? "text-gray-400" : "text-gray-600"
							}`}>
							Total Attendees
						</div>
					</div>
					<div className='text-center'>
						<div className={`text-2xl font-bold text-green-600`}>
							{attendanceList?.filter((a) => a.status === "present").length ||
								0}
						</div>
						<div
							className={`text-sm ${
								theme === "dark" ? "text-gray-400" : "text-gray-600"
							}`}>
							Present
						</div>
					</div>
					<div className='text-center'>
						<div className={`text-2xl font-bold text-yellow-600`}>
							{attendanceList?.filter((a) => a.status === "late").length || 0}
						</div>
						<div
							className={`text-sm ${
								theme === "dark" ? "text-gray-400" : "text-gray-600"
							}`}>
							Late
						</div>
					</div>
					<div className='text-center'>
						<div className={`text-2xl font-bold text-red-600`}>
							{attendanceList?.filter((a) => a.status === "absent").length || 0}
						</div>
						<div
							className={`text-sm ${
								theme === "dark" ? "text-gray-400" : "text-gray-600"
							}`}>
							Absent
						</div>
					</div>
				</div>
			</motion.div>

			{/* Filters */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.2 }}
				className='flex flex-col sm:flex-row gap-4'>
				{/* Search */}
				<div className='flex-1 relative'>
					<Search
						className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
						size={18}
					/>
					<input
						type='text'
						placeholder='Search attendees...'
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-colors duration-300 ${
							theme === "dark"
								? "bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
								: "bg-white border-gray-300 text-black placeholder-gray-500 focus:border-blue-500"
						}`}
					/>
				</div>

				{/* Status Filter */}
				<div className='flex items-center space-x-2'>
					<Filter
						className={`${
							theme === "dark" ? "text-gray-400" : "text-gray-500"
						}`}
						size={18}
					/>
					<select
						value={statusFilter}
						onChange={(e) => setStatusFilter(e.target.value)}
						className={`px-3 py-2 rounded-lg border transition-colors duration-300 ${
							theme === "dark"
								? "bg-gray-800 border-gray-700 text-white focus:border-blue-500"
								: "bg-white border-gray-300 text-black focus:border-blue-500"
						}`}>
						<option value='all'>All Status</option>
						<option value='present'>Present</option>
						<option value='late'>Late</option>
						<option value='left_early'>Left Early</option>
						<option value='absent'>Absent</option>
						<option value='excused'>Excused</option>
					</select>
				</div>
			</motion.div>

			{/* Attendance List */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.3 }}
				className={`rounded-xl overflow-hidden ${
					theme === "dark"
						? "bg-gray-900/60 backdrop-blur-xl border-gray-800/50 shadow-xl"
						: "bg-white/60 backdrop-blur-xl border-gray-200/50 shadow-xl"
				}`}>
				{filteredAttendance.length === 0 ? (
					<div className='p-8 text-center'>
						<Users
							className={`w-16 h-16 mx-auto mb-4 ${
								theme === "dark" ? "text-gray-600" : "text-gray-400"
							}`}
						/>
						<h3
							className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
								theme === "dark" ? "text-white" : "text-black"
							}`}>
							No attendees found
						</h3>
						<p
							className={`transition-colors duration-300 ${
								theme === "dark" ? "text-gray-400" : "text-gray-600"
							}`}>
							{searchTerm || statusFilter !== "all"
								? "Try adjusting your filters"
								: "No one has marked attendance for this event yet"}
						</p>
					</div>
				) : (
					<div className='overflow-x-auto'>
						<table className='w-full'>
							<thead
								className={`${
									theme === "dark" ? "bg-gray-800/50" : "bg-gray-50/50"
								}`}>
								<tr>
									<th
										className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
											theme === "dark" ? "text-gray-300" : "text-gray-500"
										}`}>
										Attendee
									</th>
									<th
										className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
											theme === "dark" ? "text-gray-300" : "text-gray-500"
										}`}>
										Status
									</th>
									<th
										className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
											theme === "dark" ? "text-gray-300" : "text-gray-500"
										}`}>
										Check-in Time
									</th>
									<th
										className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
											theme === "dark" ? "text-gray-300" : "text-gray-500"
										}`}>
										Verified
									</th>
									<th
										className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
											theme === "dark" ? "text-gray-300" : "text-gray-500"
										}`}>
										Actions
									</th>
									<th
										className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
											theme === "dark" ? "text-gray-300" : "text-gray-500"
										}`}>
										Feedback
									</th>
								</tr>
							</thead>
							<tbody
								className={`divide-y ${
									theme === "dark" ? "divide-gray-800" : "divide-gray-200"
								}`}>
								{filteredAttendance.map((attendance) => (
									<motion.tr
										key={attendance._id}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.3 }}
										className={`hover:${
											theme === "dark" ? "bg-gray-800/30" : "bg-gray-50/30"
										} transition-colors duration-200 ${
											showSuccessAnimation === attendance._id
												? "bg-green-50"
												: ""
										}`}>
										<td className='px-6 py-4 whitespace-nowrap'>
											<div className='flex items-center'>
												<div className='flex-shrink-0 h-10 w-10'>
													<div
														className={`h-10 w-10 rounded-full flex items-center justify-center ${
															theme === "dark" ? "bg-gray-700" : "bg-gray-200"
														}`}>
														<User
															className={`h-6 w-6 ${
																theme === "dark"
																	? "text-gray-300"
																	: "text-gray-600"
															}`}
														/>
													</div>
												</div>
												<div className='ml-4'>
													<div
														className={`text-sm font-medium ${
															theme === "dark" ? "text-white" : "text-black"
														}`}>
														{attendance.user.firstName}{" "}
														{attendance.user.lastName}
													</div>
													<div
														className={`text-sm ${
															theme === "dark"
																? "text-gray-400"
																: "text-gray-500"
														}`}>
														{attendance.user.email}
													</div>
												</div>
											</div>
										</td>
										<td className='px-6 py-4 whitespace-nowrap'>
											<div className='flex items-center space-x-2'>
												{getStatusIcon(attendance.status)}
												<span
													className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
														attendance.status
													)}`}>
													{attendance.status.replace("_", " ")}
												</span>
											</div>
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm'>
											<div
												className={`${
													theme === "dark" ? "text-gray-300" : "text-gray-700"
												}`}>
												{formatTime(attendance.checkInTime)}
											</div>
											{attendance.lateMinutes > 0 && (
												<div className='text-xs text-yellow-600'>
													{attendance.lateMinutes} min late
												</div>
											)}
										</td>
										<td className='px-6 py-4 whitespace-nowrap'>
											<motion.div
												initial={{ opacity: 0, scale: 0.8 }}
												animate={{ opacity: 1, scale: 1 }}
												transition={{ duration: 0.3 }}
												className='flex items-center space-x-2'>
												<span
													className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full transition-all duration-300 ${
														attendance.verified
															? "bg-green-100 text-green-800 shadow-sm"
															: "bg-red-100 text-red-800 shadow-sm"
													}`}>
													{attendance.verified ? (
														<>
															<CheckCircle size={12} className='mr-1' />
															Verified
														</>
													) : (
														<>
															<X size={12} className='mr-1' />
															Not Verified
														</>
													)}
												</span>
												{verifyingAttendanceId === attendance._id && (
													<motion.div
														animate={{ opacity: [0.5, 1, 0.5] }}
														transition={{ duration: 1, repeat: Infinity }}
														className='text-xs text-blue-600'>
														Verifying...
													</motion.div>
												)}
											</motion.div>
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
											<div className='flex items-center space-x-2'>
												<button
													onClick={() => handleViewDetail(attendance)}
													className={`p-1 rounded transition-colors duration-200 ${
														theme === "dark"
															? "hover:bg-gray-700 text-gray-400 hover:text-white"
															: "hover:bg-gray-100 text-gray-600 hover:text-black"
													}`}
													title='View Details'>
													<Eye size={16} />
												</button>
												<PermissionGate permission={Permissions.EditAttendance}>
													<motion.button
														onClick={() => handleVerifyAttendance(attendance)}
														disabled={
															verifyAttendanceMutation.isPending ||
															verifyingAttendanceId === attendance._id
														}
														whileHover={{ scale: 1.1 }}
														whileTap={{ scale: 0.9 }}
														className={`p-1 rounded transition-all duration-200 relative ${
															verifyingAttendanceId === attendance._id
																? "bg-blue-500 text-white"
																: attendance.verified
																? theme === "dark"
																	? "hover:bg-red-900/30 text-red-400 hover:text-red-300"
																	: "hover:bg-red-50 text-red-600 hover:text-red-700"
																: theme === "dark"
																? "hover:bg-blue-700 text-blue-400 hover:text-blue-300"
																: "hover:bg-blue-100 text-blue-600 hover:text-blue-700"
														}`}
														title={
															attendance.verified
																? "Unverify Attendance"
																: "Verify Attendance"
														}>
														{verifyingAttendanceId === attendance._id ? (
															<motion.div
																animate={{ rotate: 360 }}
																transition={{
																	duration: 1,
																	repeat: Infinity,
																	ease: "linear",
																}}
																className='w-4 h-4 border-2 border-white border-t-transparent rounded-full'
															/>
														) : showSuccessAnimation === attendance._id ? (
															<motion.div
																initial={{ scale: 0 }}
																animate={{ scale: 1 }}
																transition={{
																	type: "spring",
																	stiffness: 500,
																	damping: 30,
																}}
																className='text-green-500'>
																<CheckCircle size={16} />
															</motion.div>
														) : attendance.verified ? (
															<X size={16} />
														) : (
															<CheckCircle size={16} />
														)}
													</motion.button>
												</PermissionGate>
												<PermissionGate permission={Permissions.EditAttendance}>
													<button
														className={`p-1 rounded transition-colors duration-200 ${
															theme === "dark"
																? "hover:bg-gray-700 text-gray-400 hover:text-white"
																: "hover:bg-gray-100 text-gray-600 hover:text-black"
														}`}
														title='Edit Attendance'>
														<Edit size={16} />
													</button>
												</PermissionGate>
												<PermissionGate
													permission={Permissions.DeleteAttendance}>
													<button
														className={`p-1 rounded transition-colors duration-200 ${
															theme === "dark"
																? "hover:bg-red-900/30 text-red-400 hover:text-red-300"
																: "hover:bg-red-50 text-red-600 hover:text-red-700"
														}`}
														title='Delete Attendance'>
														<Trash2 size={16} />
													</button>
												</PermissionGate>
											</div>
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
											<div className='flex items-center space-x-2'>
												<PermissionGate permission={Permissions.CreateFeeBack}>
													<button
														onClick={() => handleOpenFeedbackModal(attendance)}
														className={`p-1 rounded transition-colors duration-200 ${
															theme === "dark"
																? "hover:bg-gray-700 text-gray-400 hover:text-white"
																: "hover:bg-gray-100 text-gray-600 hover:text-black"
														}`}
														title='Add Feedback'>
														<MessageCircle size={16} />
													</button>
												</PermissionGate>
												{/* Show feedback count if any exists */}
												<span
													className={`text-xs px-2 py-1 rounded-full ${
														theme === "dark"
															? "bg-gray-700 text-gray-300"
															: "bg-gray-100 text-gray-600"
													}`}>
													{/* TODO: Replace with actual feedback count from API */}
													0
												</span>
											</div>
										</td>
									</motion.tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</motion.div>

			{/* Success Notification */}
			{showSuccessAnimation && (
				<motion.div
					initial={{ opacity: 0, y: -50, scale: 0.8 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					exit={{ opacity: 0, y: -50, scale: 0.8 }}
					className='fixed top-4 right-4 z-[9999] bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2'>
					<CheckCircle size={20} />
					<span className='font-medium'>
						Attendance verification successful!
					</span>
				</motion.div>
			)}

			{/* Feedback Modal */}
			{showFeedbackModal && selectedAttendanceForFeedback && (
				<Modal
					isOpen={showFeedbackModal}
					onClose={() => setShowFeedbackModal(false)}
					title={`Feedback for ${selectedAttendanceForFeedback.user.firstName} ${selectedAttendanceForFeedback.user.lastName}`}
					size='lg'>
					<div className='space-y-4'>
						<FeedbackSection
							category='attendance'
							entityId={selectedAttendanceForFeedback._id}
							entityTitle={`${selectedAttendanceForFeedback.user.firstName} ${selectedAttendanceForFeedback.user.lastName}'s Attendance`}
							submittedTo={selectedAttendanceForFeedback.user._id}
						/>
					</div>
				</Modal>
			)}

			{/* Attendance Detail Modal */}
			{showDetailModal && selectedAttendance && (
				<Modal
					isOpen={showDetailModal}
					onClose={() => setShowDetailModal(false)}
					title='Attendance Details'>
					<div className='space-y-4'>
						<div className='grid grid-cols-2 gap-4'>
							<div>
								<label className='text-sm font-medium text-gray-500'>
									Name
								</label>
								<p className='text-sm text-gray-900'>
									{selectedAttendance.user.firstName}{" "}
									{selectedAttendance.user.lastName}
								</p>
							</div>
							<div>
								<label className='text-sm font-medium text-gray-500'>
									Email
								</label>
								<p className='text-sm text-gray-900'>
									{selectedAttendance.user.email}
								</p>
							</div>
							<div>
								<label className='text-sm font-medium text-gray-500'>
									Status
								</label>
								<div className='flex items-center space-x-2 mt-1'>
									{getStatusIcon(selectedAttendance.status)}
									<span
										className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
											selectedAttendance.status
										)}`}>
										{selectedAttendance.status.replace("_", " ")}
									</span>
								</div>
							</div>
							<div>
								<label className='text-sm font-medium text-gray-500'>
									Verified
								</label>
								<p className='text-sm text-gray-900'>
									{selectedAttendance.verified ? "Yes" : "No"}
								</p>
							</div>
							<div>
								<label className='text-sm font-medium text-gray-500'>
									Check-in Time
								</label>
								<p className='text-sm text-gray-900'>
									{formatTime(selectedAttendance.checkInTime)}
								</p>
							</div>
							<div>
								<label className='text-sm font-medium text-gray-500'>
									Check-out Time
								</label>
								<p className='text-sm text-gray-900'>
									{formatTime(selectedAttendance.checkOutTime)}
								</p>
							</div>
							{selectedAttendance.lateMinutes > 0 && (
								<div>
									<label className='text-sm font-medium text-gray-500'>
										Late Minutes
									</label>
									<p className='text-sm text-yellow-600'>
										{selectedAttendance.lateMinutes} minutes
									</p>
								</div>
							)}
							{selectedAttendance.earlyLeaveMinutes > 0 && (
								<div>
									<label className='text-sm font-medium text-gray-500'>
										Early Leave Minutes
									</label>
									<p className='text-sm text-orange-600'>
										{selectedAttendance.earlyLeaveMinutes} minutes
									</p>
								</div>
							)}
						</div>
						{selectedAttendance.feedback && (
							<div>
								<label className='text-sm font-medium text-gray-500'>
									Feedback
								</label>
								<p className='text-sm text-gray-900 mt-1'>
									{selectedAttendance.feedback}
								</p>
							</div>
						)}
					</div>
				</Modal>
			)}
		</div>
	);
};

export default EventAttendance;
