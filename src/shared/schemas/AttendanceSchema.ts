/** @format */

// Form data types without validation schemas
export interface CreateAttendanceFormData {
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

export interface UpdateAttendanceFormData {
	status?: "present" | "late" | "left_early" | "absent" | "excused";
	lateMinutes?: number;
	earlyLeaveMinutes?: number;
	feedback?: string;
	checkInTime?: string;
	checkOutTime?: string;
}

export interface VerifyAttendanceFormData {
	verified: boolean;
	verifiedBy: string;
}

export interface AddFeedbackFormData {
	feedback: string;
	feedbackBy: string;
}
