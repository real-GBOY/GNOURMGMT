/** @format */

import React from "react";
import { useAttendanceByEvent } from "../../../shared/services/attendanceService";
import { extractObjectId } from "../../../shared/utils/validation";

const AttendanceDebug: React.FC = () => {
	// Replace this with an actual event ID from your system
	const eventId = "your-event-id-here";

	const {
		data: attendanceList,
		isLoading,
		error,
	} = useAttendanceByEvent(eventId);

	if (isLoading) {
		return <div>Loading attendance data...</div>;
	}

	if (error) {
		return <div>Error loading attendance: {JSON.stringify(error)}</div>;
	}

	if (!attendanceList || attendanceList.length === 0) {
		return <div>No attendance records found for this event.</div>;
	}

	return (
		<div className='p-4'>
			<h2 className='text-xl font-bold mb-4'>Attendance Debug Information</h2>
			<div className='space-y-4'>
				{attendanceList.map((attendance, index) => {
					const extractedId = extractObjectId(attendance);

					return (
						<div key={index} className='border p-4 rounded'>
							<h3 className='font-semibold'>Attendance Record {index + 1}</h3>
							<div className='text-sm space-y-1'>
								<div>
									<strong>Raw _id:</strong> {attendance._id}
								</div>
								<div>
									<strong>_id type:</strong> {typeof attendance._id}
								</div>
								<div>
									<strong>_id length:</strong>{" "}
									{attendance._id?.length || "undefined"}
								</div>
								<div>
									<strong>Extracted ID:</strong> {extractedId || "null"}
								</div>
								<div>
									<strong>Has 'id' field:</strong>{" "}
									{(attendance as any).id ? "Yes" : "No"}
								</div>
								<div>
									<strong>User:</strong> {attendance.user.firstName}{" "}
									{attendance.user.lastName}
								</div>
								<div>
									<strong>Status:</strong> {attendance.status}
								</div>
								<div>
									<strong>Verified:</strong>{" "}
									{attendance.verified ? "Yes" : "No"}
								</div>
							</div>
							<div className='mt-2'>
								<strong>Full object:</strong>
								<pre className='text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto'>
									{JSON.stringify(attendance, null, 2)}
								</pre>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default AttendanceDebug;
