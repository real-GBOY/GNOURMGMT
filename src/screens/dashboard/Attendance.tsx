/** @format */

import React, { useState } from "react";
import {
	useAttendance,
	useCreateAttendance,
	useDeleteAttendance,
} from "../../shared/services/attendanceService";
import { useUsers } from "../../shared/services/userService";
import { useEvents } from "../../shared/services/eventService";
import { Attendance } from "../../shared/types/Attendance";
import { CreateAttendanceFormData } from "../../shared/schemas/AttendanceSchema";
import AttendanceForm from "../../shared/components/Form/AttendanceForm";
import Modal from "../../shared/components/Modal/Modal";
import { toastService } from "../../shared/services/toastService";

const Attendance: React.FC = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedAttendance, setSelectedAttendance] =
		useState<Attendance | null>(null);
	const [isEdit, setIsEdit] = useState(false);

	const { data: attendanceRecords, isLoading, error } = useAttendance();
	const { data: users = [] } = useUsers();
	const { data: events = [] } = useEvents();

	const createAttendanceMutation = useCreateAttendance();
	const deleteAttendanceMutation = useDeleteAttendance();

	const handleCreateAttendance = (data: CreateAttendanceFormData) => {
		createAttendanceMutation.mutate(data, {
			onSuccess: () => {
				setIsModalOpen(false);
				setSelectedAttendance(null);
				setIsEdit(false);
			},
		});
	};

	const handleEditAttendance = (attendance: Attendance) => {
		setSelectedAttendance(attendance);
		setIsEdit(true);
		setIsModalOpen(true);
	};

	const handleDeleteAttendance = (id: string) => {
		if (
			window.confirm("Are you sure you want to delete this attendance record?")
		) {
			deleteAttendanceMutation.mutate(id);
		}
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

	if (error) {
		return (
			<div className='text-center text-red-600'>
				Error loading attendance records. Please try again.
			</div>
		);
	}

	return (
		<div className='container mx-auto px-4 py-8'>
			<div className='flex justify-between items-center mb-6'>
				<h1 className='text-3xl font-bold text-gray-900'>
					Attendance Management
				</h1>
				<button
					onClick={() => {
						setIsModalOpen(true);
						setSelectedAttendance(null);
						setIsEdit(false);
					}}
					className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'>
					Add Attendance Record
				</button>
			</div>

			{/* Attendance Records Table */}
			<div className='bg-white shadow-md rounded-lg overflow-hidden'>
				<div className='overflow-x-auto'>
					<table className='min-w-full divide-y divide-gray-200'>
						<thead className='bg-gray-50'>
							<tr>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									User
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									Event
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									Status
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									Time Details
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									Verified
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									Actions
								</th>
							</tr>
						</thead>
						<tbody className='bg-white divide-y divide-gray-200'>
							{attendanceRecords?.map((record) => (
								<tr key={record._id} className='hover:bg-gray-50'>
									<td className='px-6 py-4 whitespace-nowrap'>
										<div className='flex items-center'>
											<div>
												<div className='text-sm font-medium text-gray-900'>
													{record.user.firstName} {record.user.lastName}
												</div>
												<div className='text-sm text-gray-500'>
													{record.user.email}
												</div>
											</div>
										</div>
									</td>
									<td className='px-6 py-4 whitespace-nowrap'>
										<div>
											<div className='text-sm font-medium text-gray-900'>
												{record.event.title}
											</div>
											<div className='text-sm text-gray-500'>
												{new Date(record.event.startDate).toLocaleDateString()}
											</div>
										</div>
									</td>
									<td className='px-6 py-4 whitespace-nowrap'>
										<span
											className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
												record.status
											)}`}>
											{record.status.replace("_", " ")}
										</span>
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
										<div>
											{record.checkInTime && (
												<div>Check-in: {formatTime(record.checkInTime)}</div>
											)}
											{record.checkOutTime && (
												<div>Check-out: {formatTime(record.checkOutTime)}</div>
											)}
											{record.lateMinutes > 0 && (
												<div className='text-yellow-600'>
													Late: {record.lateMinutes} min
												</div>
											)}
											{record.earlyLeaveMinutes > 0 && (
												<div className='text-orange-600'>
													Left early: {record.earlyLeaveMinutes} min
												</div>
											)}
										</div>
									</td>
									<td className='px-6 py-4 whitespace-nowrap'>
										<span
											className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
												record.verified
													? "bg-green-100 text-green-800"
													: "bg-red-100 text-red-800"
											}`}>
											{record.verified ? "Verified" : "Not Verified"}
										</span>
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
										<div className='flex space-x-2'>
											<button
												onClick={() => handleEditAttendance(record)}
												className='text-blue-600 hover:text-blue-900'>
												Edit
											</button>
											<button
												onClick={() => handleDeleteAttendance(record._id)}
												className='text-red-600 hover:text-red-900'>
												Delete
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{attendanceRecords?.length === 0 && (
					<div className='text-center py-8 text-gray-500'>
						No attendance records found.
					</div>
				)}
			</div>

			{/* Modal for Create/Edit Attendance */}
			<Modal
				isOpen={isModalOpen}
				onClose={() => {
					setIsModalOpen(false);
					setSelectedAttendance(null);
					setIsEdit(false);
				}}
				title={isEdit ? "Edit Attendance Record" : "Add Attendance Record"}>
				<AttendanceForm
					onSubmit={handleCreateAttendance}
					isLoading={createAttendanceMutation.isPending}
					initialData={
						selectedAttendance
							? {
									user: selectedAttendance.user._id,
									event: selectedAttendance.event._id,
									attendance: selectedAttendance.attendance,
									status: selectedAttendance.status,
									lateMinutes: selectedAttendance.lateMinutes,
									earlyLeaveMinutes: selectedAttendance.earlyLeaveMinutes,
									feedback: selectedAttendance.feedback,
									checkInTime: selectedAttendance.checkInTime,
									checkOutTime: selectedAttendance.checkOutTime,
							  }
							: undefined
					}
					users={users}
					events={events}
					isEdit={isEdit}
				/>
			</Modal>
		</div>
	);
};

export default Attendance;
