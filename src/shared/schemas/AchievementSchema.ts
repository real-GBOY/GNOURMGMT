/** @format */

import * as z from "zod";
import * as yup from "yup";

export const achievementTypes = [
	"best_member_of_the_month",
	"best_member_of_the_year",
	"dedication",
] as const;

// Zod Schemas (existing)
export const CreateAchievementSchema = z.object({
	title: z
		.string()
		.min(1, "Title is required")
		.max(100, "Title must be less than 100 characters"),
	description: z
		.string()
		.min(10, "Description must be at least 10 characters")
		.max(500, "Description must be less than 500 characters"),
	achievementType: z.enum(achievementTypes),
	userId: z.string().min(1, "User is required"),
	file: z.instanceof(File).optional(),
});

export const UpdateAchievementSchema = z.object({
	title: z
		.string()
		.min(1, "Title is required")
		.max(100, "Title must be less than 100 characters")
		.optional(),
	description: z
		.string()
		.min(10, "Description must be at least 10 characters")
		.max(500, "Description must be less than 500 characters")
		.optional(),
	achievementType: z.enum(achievementTypes).optional(),
});

export const AssignAchievementSchema = z.object({
	title: z
		.string()
		.min(1, "Title is required")
		.max(100, "Title must be less than 100 characters"),
	description: z
		.string()
		.min(10, "Description must be at least 10 characters")
		.max(500, "Description must be less than 500 characters"),
	achievementType: z.enum(achievementTypes),
	userId: z.string().min(1, "User is required"),
});

export const UploadFileSchema = z.object({
	description: z
		.string()
		.min(1, "Description is required")
		.max(200, "Description must be less than 200 characters"),
});

// Yup Schemas (for GenericForm)
export const createAchievementYupSchema = yup.object().shape({
	title: yup
		.string()
		.min(1, "Title is required")
		.max(100, "Title must be less than 100 characters")
		.required("Title is required"),
	description: yup
		.string()
		.min(10, "Description must be at least 10 characters")
		.max(500, "Description must be less than 500 characters")
		.required("Description is required"),
	achievementType: yup
		.string()
		.oneOf(achievementTypes, "Please select a valid achievement type")
		.required("Achievement type is required"),
	userId: yup.string().min(1, "User is required").required("User is required"),

	certificateFile: yup.mixed().optional(),
});

export const updateAchievementYupSchema = yup.object().shape({
	title: yup
		.string()
		.min(1, "Title is required")
		.max(100, "Title must be less than 100 characters"),
	description: yup
		.string()
		.min(10, "Description must be at least 10 characters")
		.max(500, "Description must be less than 500 characters"),
	achievementType: yup
		.string()
		.oneOf(achievementTypes, "Please select a valid achievement type"),
});

export type CreateAchievementFormData = z.infer<typeof CreateAchievementSchema>;
export type UpdateAchievementFormData = z.infer<typeof UpdateAchievementSchema>;
export type AssignAchievementFormData = z.infer<typeof AssignAchievementSchema>;
export type UploadFileFormData = z.infer<typeof UploadFileSchema>;
