/** @format */

import React from "react";
import { useForm } from "react-hook-form";
import {
	CreateAttendanceFormData,
	UpdateAttendanceFormData,
} from "../../schemas/AttendanceSchema";
import { User } from "../../types/User";
import { Event } from "../../types/Event";

interface AttendanceFormProps {
	onSubmit: (data: CreateAttendanceFormData | UpdateAttendanceFormData) => void;
	isLoading?: boolean;
	initialData?: Partial<CreateAttendanceFormData>;
	users?: User[];
	events?: Event[];
	isEdit?: boolean;
}

const AttendanceForm: React.FC<AttendanceFormProps> = ({
	onSubmit,
	isLoading = false,
	initialData,
	users = [],
	events = [],
	isEdit = false,
}) => {
	const { register, handleSubmit, watch } = useForm<CreateAttendanceFormData>({
		defaultValues: initialData,
	});

	const attendance = watch("attendance");
	const status = watch("status");

	return (
		<form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
			{/* User Selection */}
			<div>
				<label className='block text-sm font-medium text-gray-700 mb-2'>
					User
				</label>
				<select
					{...register("user")}
					className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
					disabled={isEdit}>
					<option value=''>Select a user</option>
					{users.map((user) => (
						<option key={user._id} value={user._id}>
							{user.firstName} {user.lastName} ({user.email})
						</option>
					))}
				</select>
			</div>

			{/* Event Selection */}
			<div>
				<label className='block text-sm font-medium text-gray-700 mb-2'>
					Event
				</label>
				<select
					{...register("event")}
					className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
					disabled={isEdit}>
					<option value=''>Select an event</option>
					{events.map((event) => (
						<option key={event._id} value={event._id}>
							{event.title} ({new Date(event.startDate).toLocaleDateString()})
						</option>
					))}
				</select>
			</div>

			{/* Attendance Status */}
			<div>
				<label className='block text-sm font-medium text-gray-700 mb-2'>
					Attendance Status
				</label>
				<div className='flex items-center space-x-4'>
					<label className='flex items-center'>
						<input
							type='radio'
							{...register("attendance")}
							value='true'
							className='mr-2'
						/>
						Present
					</label>
					<label className='flex items-center'>
						<input
							type='radio'
							{...register("attendance")}
							value='false'
							className='mr-2'
						/>
						Absent
					</label>
				</div>
			</div>

			{/* Status Details */}
			<div>
				<label className='block text-sm font-medium text-gray-700 mb-2'>
					Status Details
				</label>
				<select
					{...register("status")}
					className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'>
					<option value=''>Select status</option>
					<option value='present'>Present</option>
					<option value='late'>Late</option>
					<option value='left_early'>Left Early</option>
					<option value='absent'>Absent</option>
					<option value='excused'>Excused</option>
				</select>
			</div>

			{/* Time Details - Only show if attendance is true */}
			{attendance && (
				<>
					{/* Late Minutes */}
					{(status === "late" || status === "present") && (
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								Late Minutes
							</label>
							<input
								type='number'
								{...register("lateMinutes", { valueAsNumber: true })}
								className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
								placeholder='0'
								min='0'
							/>
						</div>
					)}

					{/* Early Leave Minutes */}
					{(status === "left_early" || status === "present") && (
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								Early Leave Minutes
							</label>
							<input
								type='number'
								{...register("earlyLeaveMinutes", { valueAsNumber: true })}
								className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
								placeholder='0'
								min='0'
							/>
						</div>
					)}

					{/* Check-in Time */}
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							Check-in Time
						</label>
						<input
							type='datetime-local'
							{...register("checkInTime")}
							className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
						/>
					</div>

					{/* Check-out Time */}
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							Check-out Time
						</label>
						<input
							type='datetime-local'
							{...register("checkOutTime")}
							className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
						/>
					</div>
				</>
			)}

			{/* Feedback */}
			<div>
				<label className='block text-sm font-medium text-gray-700 mb-2'>
					Feedback
				</label>
				<textarea
					{...register("feedback")}
					rows={3}
					className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
					placeholder='Add any feedback or notes...'
				/>
			</div>

			{/* Submit Button */}
			<div className='flex justify-end'>
				<button
					type='submit'
					disabled={isLoading}
					className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'>
					{isLoading
						? "Saving..."
						: isEdit
						? "Update Attendance"
						: "Create Attendance"}
				</button>
			</div>
		</form>
	);
};

export default AttendanceForm;
