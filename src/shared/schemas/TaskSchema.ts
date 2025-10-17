/** @format */

import * as yup from "yup";

export const taskSchema = yup.object().shape({
	title: yup
		.string()
		.required("Task title is required")
		.min(3, "Task title must be at least 3 characters"),
	description: yup
		.string()
		.required("Description is required")
		.min(10, "Description must be at least 10 characters"),
	dueDate: yup.string().required("Due date is required"),
	whatAppGroup: yup.string().optional(),
});

export const updateTaskSchema = yup.object().shape({
	title: yup.string().min(3, "Task title must be at least 3 characters"),
	description: yup
		.string()
		.min(10, "Description must be at least 10 characters"),
	dueDate: yup.string(),
	whatAppGroup: yup.string(),
});
