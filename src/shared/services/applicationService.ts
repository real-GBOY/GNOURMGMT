/** @format */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiRepo from "../config/apiRepo";
import endPoints from "../config/endPoints";
import { toastService } from "./toastService";
import { ApiError } from "../types";

export interface ApplicationPayload {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	gender: "Male" | "Female" | "Mickey Mouse";
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
	facebook: string;
	linkedin?: string;
	instagram?: string;
	otherSocialLinks?: string[];
	dateOfBirth: string | Date;
	acceptedTerms: boolean;
}

export interface Applicant {
	_id: string;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	gender: "Male" | "Female" | "Mickey Mouse";
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
	facebook: string;
	linkedin?: string;
	instagram?: string;
	otherSocialLinks?: string[];
	dateOfBirth: string;
	acceptedTerms: boolean;
	status?: "pending" | "approved" | "rejected";
	createdAt: string;
	updatedAt: string;
}

export interface UpdateApplicantPayload {
	status?: "pending" | "approved" | "rejected";
	firstName?: string;
	lastName?: string;
	email?: string;
	phone?: string;
	gender?: "Male" | "Female" | "Mickey Mouse";
	faculty?: string;
	academicYear?: "1st Year" | "2nd Year" | "3rd Year" | "4th Year" | "5th Year";
	selectedTeam?:
		| "Project"
		| "Presentation"
		| "Digital Marketing"
		| "HR"
		| "Logistics"
		| "PR-FR"
		| "Graphic Design"
		| "Video Editing";
	skills?: string[];
	relevantExperience?: string;
	facebook?: string;
	linkedin?: string;
	instagram?: string;
	otherSocialLinks?: string[];
	dateOfBirth?: string | Date;
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

export const useGetApplicants = () => {
	return useQuery({
		queryKey: ["applicants"],
		queryFn: async (): Promise<Applicant[]> => {
			// Add limit parameter to fetch all applicants
			const response = await apiRepo.GET(`${endPoints.applicants}?limit=1000`);
			return response.data as Applicant[];
		},
	});
};

export const useGetAllApplicantsForAnalytics = () => {
	return useQuery({
		queryKey: ["applicants-analytics"],
		queryFn: async (): Promise<Applicant[]> => {
			// Fetch all applicants without any limit for analytics
			const response = await apiRepo.GET(
				`${endPoints.applicants}?limit=0&skip=0`
			);
			return response.data as Applicant[];
		},
		staleTime: 5 * 60 * 1000, // 5 minutes
		cacheTime: 10 * 60 * 1000, // 10 minutes
	});
};

export const useGetApplicantById = (id: string) => {
	return useQuery({
		queryKey: ["applicant", id],
		queryFn: async (): Promise<Applicant> => {
			const response = await apiRepo.GET(`${endPoints.applicants}/${id}`);
			return response.data;
		},
		enabled: !!id,
	});
};

export const useUpdateApplicant = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({
			id,
			data,
		}: {
			id: string;
			data: UpdateApplicantPayload;
		}): Promise<Applicant> => {
			const response = await apiRepo.PATCH(
				`${endPoints.applicants}/${id}`,
				data
			);
			return response.data;
		},
		onSuccess: (updatedApplicant) => {
			queryClient.invalidateQueries({ queryKey: ["applicants"] });
			queryClient.setQueryData(
				["applicant", updatedApplicant._id],
				updatedApplicant
			);
			toastService.success("Applicant updated successfully!");
		},
		onError: (error: ApiError) => {
			toastService.error(
				error?.response?.data?.message || "Failed to update applicant"
			);
		},
	});
};

export const useDeleteApplicant = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id: string): Promise<void> => {
			await apiRepo.DELETE(`${endPoints.applicants}/${id}`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["applicants"] });
			toastService.success("Applicant deleted successfully!");
		},
		onError: (error: ApiError) => {
			toastService.error(
				error?.response?.data?.message || "Failed to delete applicant"
			);
		},
	});
};
