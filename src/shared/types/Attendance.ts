/** @format */

export interface Attendance {
	_id: string;
	user: {
		_id: string;
		firstName: string;
		lastName: string;
		email: string;
	};
	event: {
		_id: string;
		title: string;
		startDate: string;
		endDate: string;
	};
	attendance: boolean;
	status: "present" | "late" | "left_early" | "absent" | "excused";
	lateMinutes: number;
	earlyLeaveMinutes: number;
	verified: boolean;
	feedback: string;
	checkInTime?: string;
	checkOutTime?: string;
	verifiedBy?: string;
	feedbackBy?: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
}

export interface CreateAttendanceData {
	user: string;
	event: string;
	attendance: boolean;
	status: "present" | "late" | "left_early" | "absent" | "excused";
	lateMinutes?: number;
	earlyLeaveMinutes?: number;
	feedback?: string;
	checkInTime?: string;
	checkOutTime?: string;
}

export interface UpdateAttendanceData {
	status?: "present" | "late" | "left_early" | "absent" | "excused";
	lateMinutes?: number;
	earlyLeaveMinutes?: number;
	feedback?: string;
	checkInTime?: string;
	checkOutTime?: string;
}

export interface VerifyAttendanceData {
	verified: boolean;
	verifiedBy: string;
	verificationNotes?: string;
}

export interface AddFeedbackData {
	feedback: string;
	feedbackBy: string;
}

export interface AttendanceResponse {
	message: string;
	data: Attendance;
}

export interface AttendanceListResponse {
	data: Attendance[];
}
