/** @format */

import { User } from "./User";

export interface TaskAttachment {
	_id: string;
	fileUrl: string;
	fileName: string;
	uploadedBy?: string;
	uploadedAt: string;
}

export interface Task {
	_id: string;
	title: string;
	description: string;
	status: "pending" | "in_progress" | "completed" | "cancelled";
	dueDate: string;
	attachments: TaskAttachment[];
	whatAppGroup: string;
	assignedTo: User[];
	createdBy?: User;
	createdAt: string;
	__v: number;
}

export interface CreateTaskData {
	title: string;
	description: string;
	dueDate: string;
	whatAppGroup?: string;
	files?: File[];
	userId?: string;
}

export interface UpdateTaskData {
	title?: string;
	description?: string;
	status?: "pending" | "in_progress" | "completed" | "cancelled";
	dueDate?: string;
	whatAppGroup?: string;
	assignedTo?: string[];
}

export interface TaskResponse {
	success: boolean;
	message?: string;
	data: Task;
}

export interface TasksResponse {
	success: boolean;
	data: Task[];
}
