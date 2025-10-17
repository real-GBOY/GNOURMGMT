/** @format */

import * as yup from "yup";

export const feedbackCategories = [
	"task",
	"meeting",
	"attendance",
	"behavior",
] as const;

export type FeedbackCategoryType = (typeof feedbackCategories)[number];

export const createFeedbackSchema = yup
	.object({
		title: yup
			.string()
			.required("Title is required")
			.min(3, "Title must be at least 3 characters"),
		content: yup
			.string()
			.required("Content is required")
			.min(10, "Content must be at least 10 characters"),
		category: yup
			.mixed<FeedbackCategoryType>()
			.oneOf(feedbackCategories, "Invalid category")
			.required("Category is required"),
		submittedTo: yup.string().required("Recipient is required"),
		taskId: yup.string().when("category", {
			is: "task",
			then: (schema) => schema.required("Task is required for task feedback"),
			otherwise: (schema) => schema.optional().nullable(),
		}),
		meetingId: yup.string().when("category", {
			is: "meeting",
			then: (schema) =>
				schema.required("Meeting is required for meeting feedback"),
			otherwise: (schema) => schema.optional().nullable(),
		}),
		attendanceId: yup.string().when("category", {
			is: "attendance",
			then: (schema) =>
				schema.required("Attendance is required for attendance feedback"),
			otherwise: (schema) => schema.optional().nullable(),
		}),
	})
	.required();

export const updateFeedbackSchema = yup
	.object({
		title: yup.string().min(3, "Title must be at least 3 characters"),
		content: yup.string().min(10, "Content must be at least 10 characters"),
	})
	.required();
