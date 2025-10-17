/** @format */

import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
	useAttendanceById,
	useUpdateAttendance,
	useVerifyAttendance,
	useAddFeedback,
} from "../../../shared/services/attendanceService";
import { Attendance } from "../../../shared/types/Attendance";
import {
	UpdateAttendanceFormData,
	VerifyAttendanceFormData,
	AddFeedbackFormData,
} from "../../../shared/schemas/AttendanceSchema";
import AttendanceForm from "../../../shared/components/Form/AttendanceForm";
import Modal from "../../../shared/components/Modal";
import { toastService } from "../../../shared/services/toastService";

const AttendanceDetail: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
	const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

	const { data: attendance, isLoading, error } = useAttendanceById(id || "");
	const updateAttendanceMutation = useUpdateAttendance();
	const verifyAttendanceMutation = useVerifyAttendance();
	const addFeedbackMutation = useAddFeedback();

	const handleUpdateAttendance = (data: UpdateAttendanceFormData) => {
		if (!id) return;

		updateAttendanceMutation.mutate(
			{ id, data },
			{
				onSuccess: () => {
					setIsEditModalOpen(false);
				},
			}
		);
	};

	const handleVerifyAttendance = (data: VerifyAttendanceFormData) => {
		if (!id) return;

		verifyAttendanceMutation.mutate(
			{ id, data },
			{
				onSuccess: () => {
					setIsVerifyModalOpen(false);
				},
			}
		);
	};

	const handleAddFeedback = (data: AddFeedbackFormData) => {
		if (!id) return;

		addFeedbackMutation.mutate(
			{ id, data },
			{
				onSuccess: () => {
					setIsFeedbackModalOpen(false);
				},
			}
		);
	};

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

	const formatTime = (timeString?: string) => {
		if (!timeString) return "N/A";
		return new Date(timeString).toLocaleString();
	};

	if (isLoading) {
		return (
			<div className='flex justify-center items-center h-64'>
				<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
			</div>
		);
	}

	if (error || !attendance) {
		return (
			<div className='text-center text-red-600'>
				Error loading attendance record. Please try again.
			</div>
		);
	}

	return (
		<div className='container mx-auto px-4 py-8'>
			<div className='flex justify-between items-center mb-6'>
				<div>
					<button
						onClick={() => navigate(-1)}
						className='text-blue-600 hover:text-blue-800 mb-2'>
						← Back to Attendance
					</button>
					<h1 className='text-3xl font-bold text-gray-900'>
						Attendance Details
					</h1>
				</div>
				<div className='flex space-x-2'>
					<button
						onClick={() => setIsEditModalOpen(true)}
						className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'>
						Edit
					</button>
					<button
						onClick={() => setIsVerifyModalOpen(true)}
						className='px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500'>
						{attendance.verified ? "Unverify" : "Verify"}
					</button>
					<button
						onClick={() => setIsFeedbackModalOpen(true)}
						className='px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500'>
						Add Feedback
					</button>
				</div>
			</div>

			<div className='bg-white shadow-md rounded-lg p-6'>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					{/* User Information */}
					<div>
						<h2 className='text-xl font-semibold text-gray-900 mb-4'>
							User Information
						</h2>
						<div className='space-y-3'>
							<div>
								<label className='text-sm font-medium text-gray-500'>
									Name
								</label>
								<p className='text-sm text-gray-900'>
									{attendance.user.firstName} {attendance.user.lastName}
								</p>
							</div>
							<div>
								<label className='text-sm font-medium text-gray-500'>
									Email
								</label>
								<p className='text-sm text-gray-900'>{attendance.user.email}</p>
							</div>
						</div>
					</div>

					{/* Event Information */}
					<div>
						<h2 className='text-xl font-semibold text-gray-900 mb-4'>
							Event Information
						</h2>
						<div className='space-y-3'>
							<div>
								<label className='text-sm font-medium text-gray-500'>
									Event Title
								</label>
								<p className='text-sm text-gray-900'>
									{attendance.event.title}
								</p>
							</div>
							<div>
								<label className='text-sm font-medium text-gray-500'>
									Event Date
								</label>
								<p className='text-sm text-gray-900'>
									{new Date(attendance.event.startDate).toLocaleDateString()} -{" "}
									{new Date(attendance.event.endDate).toLocaleDateString()}
								</p>
							</div>
						</div>
					</div>

					{/* Attendance Status */}
					<div>
						<h2 className='text-xl font-semibold text-gray-900 mb-4'>
							Attendance Status
						</h2>
						<div className='space-y-3'>
							<div>
								<label className='text-sm font-medium text-gray-500'>
									Status
								</label>
								<div className='mt-1'>
									<span
										className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
											attendance.status
										)}`}>
										{attendance.status.replace("_", " ")}
									</span>
								</div>
							</div>
							<div>
								<label className='text-sm font-medium text-gray-500'>
									Verified
								</label>
								<div className='mt-1'>
									<span
										className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
											attendance.verified
												? "bg-green-100 text-green-800"
												: "bg-red-100 text-red-800"
										}`}>
										{attendance.verified ? "Verified" : "Not Verified"}
									</span>
								</div>
							</div>
						</div>
					</div>

					{/* Time Details */}
					<div>
						<h2 className='text-xl font-semibold text-gray-900 mb-4'>
							Time Details
						</h2>
						<div className='space-y-3'>
							<div>
								<label className='text-sm font-medium text-gray-500'>
									Check-in Time
								</label>
								<p className='text-sm text-gray-900'>
									{formatTime(attendance.checkInTime)}
								</p>
							</div>
							<div>
								<label className='text-sm font-medium text-gray-500'>
									Check-out Time
								</label>
								<p className='text-sm text-gray-900'>
									{formatTime(attendance.checkOutTime)}
								</p>
							</div>
							{attendance.lateMinutes > 0 && (
								<div>
									<label className='text-sm font-medium text-gray-500'>
										Late Minutes
									</label>
									<p className='text-sm text-yellow-600'>
										{attendance.lateMinutes} minutes
									</p>
								</div>
							)}
							{attendance.earlyLeaveMinutes > 0 && (
								<div>
									<label className='text-sm font-medium text-gray-500'>
										Early Leave Minutes
									</label>
									<p className='text-sm text-orange-600'>
										{attendance.earlyLeaveMinutes} minutes
									</p>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Feedback Section */}
				{attendance.feedback && (
					<div className='mt-6'>
						<h2 className='text-xl font-semibold text-gray-900 mb-4'>
							Feedback
						</h2>
						<div className='bg-gray-50 p-4 rounded-md'>
							<p className='text-sm text-gray-900'>{attendance.feedback}</p>
						</div>
					</div>
				)}

				{/* Record Information */}
				<div className='mt-6 pt-6 border-t border-gray-200'>
					<h2 className='text-xl font-semibold text-gray-900 mb-4'>
						Record Information
					</h2>
					<div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm'>
						<div>
							<label className='text-sm font-medium text-gray-500'>
								Record ID
							</label>
							<p className='text-sm text-gray-900'>{attendance._id}</p>
						</div>
						<div>
							<label className='text-sm font-medium text-gray-500'>
								Created
							</label>
							<p className='text-sm text-gray-900'>
								{formatTime(attendance.createdAt)}
							</p>
						</div>
						<div>
							<label className='text-sm font-medium text-gray-500'>
								Last Updated
							</label>
							<p className='text-sm text-gray-900'>
								{formatTime(attendance.updatedAt)}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Edit Modal */}
			<Modal
				isOpen={isEditModalOpen}
				onClose={() => setIsEditModalOpen(false)}
				title='Edit Attendance Record'>
				<AttendanceForm
					onSubmit={handleUpdateAttendance}
					isLoading={updateAttendanceMutation.isPending}
					initialData={{
						status: attendance.status,
						lateMinutes: attendance.lateMinutes,
						earlyLeaveMinutes: attendance.earlyLeaveMinutes,
						feedback: attendance.feedback,
						checkInTime: attendance.checkInTime,
						checkOutTime: attendance.checkOutTime,
					}}
					isEdit={true}
				/>
			</Modal>

			{/* Verify Modal */}
			<Modal
				isOpen={isVerifyModalOpen}
				onClose={() => setIsVerifyModalOpen(false)}
				title={
					attendance.verified ? "Unverify Attendance" : "Verify Attendance"
				}>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						handleVerifyAttendance({
							verified: !attendance.verified,
							verifiedBy: "current-user-id", // This should come from auth context
						});
					}}
					className='space-y-4'>
					<p className='text-gray-600'>
						{attendance.verified
							? "Are you sure you want to unverify this attendance record?"
							: "Are you sure you want to verify this attendance record?"}
					</p>
					<div className='flex justify-end space-x-2'>
						<button
							type='button'
							onClick={() => setIsVerifyModalOpen(false)}
							className='px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50'>
							Cancel
						</button>
						<button
							type='submit'
							disabled={verifyAttendanceMutation.isPending}
							className='px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50'>
							{verifyAttendanceMutation.isPending ? "Processing..." : "Confirm"}
						</button>
					</div>
				</form>
			</Modal>

			{/* Feedback Modal */}
			<Modal
				isOpen={isFeedbackModalOpen}
				onClose={() => setIsFeedbackModalOpen(false)}
				title='Add Feedback'>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						const formData = new FormData(e.currentTarget);
						handleAddFeedback({
							feedback: formData.get("feedback") as string,
							feedbackBy: "current-user-id", // This should come from auth context
						});
					}}
					className='space-y-4'>
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							Feedback
						</label>
						<textarea
							name='feedback'
							rows={4}
							className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
							placeholder='Add your feedback here...'
							required
						/>
					</div>
					<div className='flex justify-end space-x-2'>
						<button
							type='button'
							onClick={() => setIsFeedbackModalOpen(false)}
							className='px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50'>
							Cancel
						</button>
						<button
							type='submit'
							disabled={addFeedbackMutation.isPending}
							className='px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50'>
							{addFeedbackMutation.isPending ? "Adding..." : "Add Feedback"}
						</button>
					</div>
				</form>
			</Modal>
		</div>
	);
};

export default AttendanceDetail;
