/** @format */

import { useMutation } from "@tanstack/react-query";
import apiRepo from "../config/apiRepo";
import endPoints from "../config/endPoints";
import { toastService } from "./toastService";
import { ApiError } from "../types";

export interface ApplicationPayload {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	gender: "Male" | "Female" | "Prefer not to say";
	faculty: string;
	academicYear: "1st Year" | "2nd Year" | "3rd Year" | "4th Year" | "5th Year";
	selectedTeam:
		| "Project"
		| "Presentation"
		| "Digital Marketing"
		| "HR"
		| "Logistics"
		| "PR-FR"
		| "Graphic Design"
		| "Video Editing";
	skills: string[];
	relevantExperience: string;
	socialLinks?: string[];
	dateOfBirth: string | Date;
	acceptedTerms: boolean;
}

export const useSubmitApplication = () => {
	return useMutation({
		mutationFn: async (data: ApplicationPayload): Promise<void> => {
			// Post to applicants endpoint per backend router
			await apiRepo.POST(endPoints.applicants, data);
		},
		onSuccess: () => {
			toastService.success("Application submitted successfully!");
		},
		onError: (error: ApiError) => {
			toastService.error(
				error?.response?.data?.message || "Failed to submit application"
			);
		},
	});
};
