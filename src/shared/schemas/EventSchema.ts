/** @format */

import * as yup from "yup";

export const eventSchema = yup.object().shape({
	title: yup
		.string()
		.required("Event title is required")
		.min(3, "Event title must be at least 3 characters"),
	description: yup
		.string()
		.required("Description is required")
		.min(10, "Description must be at least 10 characters"),
	startDate: yup.string().required("Start date is required"),
	endDate: yup.string().required("End date is required"),
	location: yup
		.string()
		.required("Location is required")
		.min(3, "Location must be at least 3 characters"),
	eventType: yup.string().required("Event type is required"),
	createdBy: yup.string(),
	file: yup.mixed().optional(),
});

export const updateEventSchema = yup.object().shape({
	title: yup
		.string()
		.min(3, "Event title must be at least 3 characters")
		.optional(),
	description: yup
		.string()
		.min(10, "Description must be at least 10 characters")
		.optional(),
	startDate: yup.string().optional(),
	endDate: yup.string().optional(),
	location: yup
		.string()
		.min(3, "Location must be at least 3 characters")
		.optional(),
	eventType: yup.string().optional(),
	file: yup.mixed().optional(),
});
