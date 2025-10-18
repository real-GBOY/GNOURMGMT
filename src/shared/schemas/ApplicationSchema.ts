/** @format */

import * as yup from "yup";

const EGYPT_MOBILE_REGEX = /^(?:\+?20|0020|0)1[0125]\d{8}$/;

export const applicationYupSchema = yup.object().shape({
	firstName: yup.string().trim().required("First name is required"),
	lastName: yup.string().trim().required("Last name is required"),
	email: yup
		.string()
		.trim()
		.lowercase()
		.email("Invalid email address format.")
		.required("Email is required"),
	phone: yup
		.string()
		.trim()
		.matches(
			EGYPT_MOBILE_REGEX,
			"Invalid Egyptian mobile number. Use formats like 010XXXXXXXX or +2010XXXXXXXX."
		)
		.required("Phone is required"),
	gender: yup
		.string()
		.oneOf(["Male", "Female", "Mickey Mouse"])
		.required("Gender is required"),
	faculty: yup.string().trim().required("Faculty is required"),
	academicYear: yup
		.string()
		.oneOf(["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year"])
		.required("Academic year is required"),
	selectedTeam: yup
		.string()
		.oneOf([
			"Project",
			"Presentation",
			"Digital Marketing",
			"HR",
			"Logistics",
			"PR-FR",
			"Graphic Design",
			"Video Editing",
		])
		.required("Team is required"),
	skills: yup
		.array()
		.of(
			yup
				.string()
				.trim()
				.min(1, "Skill cannot be empty")
				.max(50, "Skill must be at most 50 characters")
		)
		.min(1, "Provide at least one non-empty skill (each up to 50 characters).")
		.required("Skills are required"),
	relevantExperience: yup.string().trim().optional().default(""),
	facebook: yup
		.string()
		.trim()
		.matches(
			/^(https?:\/\/)(www\.)?(facebook\.com|fb\.com)\/.+$/i,
			"Facebook profile URL is required. Use format like https://facebook.com/username or https://fb.com/username"
		)
		.required("Facebook profile is required"),
	instagram: yup
		.string()
		.trim()
		.matches(
			/^(https?:\/\/)(www\.)?(instagram\.com)\/.+$/i,
			"Invalid Instagram URL. Use format like https://instagram.com/username"
		)
		.optional()
		.default(""),
	linkedin: yup
		.string()
		.trim()
		.matches(
			/^(https?:\/\/)(www\.)?(linkedin\.com)\/.+$/i,
			"Invalid LinkedIn URL. Use format like https://linkedin.com/in/username"
		)
		.optional()
		.default(""),
	otherSocialLinks: yup
		.array()
		.of(
			yup
				.string()
				.trim()
				.matches(
					/^(https?:\/\/)([\w-]+\.)+[\w-]+(\/[\w\-._~:\/?#\[\]@!$&'()*+,;=]*)?$/i,
					"Invalid URL. Use full http(s) link, e.g., https://example.com"
				)
		)
		.optional()
		.default([]),
	dateOfBirth: yup
		.date()
		.max(new Date(), "Date of birth must be a valid past date.")
		.required("Date of birth is required"),
	acceptedTerms: yup.boolean().default(false),
});

export type ApplicationFormData = yup.InferType<typeof applicationYupSchema>;
