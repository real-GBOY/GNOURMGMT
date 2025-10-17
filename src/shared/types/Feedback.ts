/** @format */

import { User } from "./User";

export type FeedbackCategory = "task" | "meeting" | "attendance" | "behavior";

export interface Feedback {
	_id: string;
	title: string;
	content: string;
	category: FeedbackCategory;
	submittedBy: string | User;
	submittedTo: string | User;
	taskId?: string;
	meetingId?: string;
	attendanceId?: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
}

export interface CreateFeedbackData {
	title: string;
	content: string;
	category: FeedbackCategory;
	submittedTo: string | string[];
	taskId?: string;
	meetingId?: string;
	attendanceId?: string;
}

export interface UpdateFeedbackData {
	title?: string;
	content?: string;
}

export interface FeedbackResponse {
	success: boolean;
	data: Feedback;
}

export interface FeedbackListResponse {
	success: boolean;
	data: Feedback[];
}
