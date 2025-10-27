/** @format */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiRepo from "../config/apiRepo";
import endPoints from "../config/endPoints";
import { reactQueryKeys } from "../config/reactQueryKeys";
import {
	Feedback,
	CreateFeedbackData,
	UpdateFeedbackData,
} from "../types/Feedback";
import { toastService } from "./toastService";

// Get all feedback
export const useFeedback = () => {
	return useQuery({
		queryKey: reactQueryKeys.feedback.lists(),
		queryFn: async (): Promise<Feedback[]> => {
			const response = await apiRepo.GET(endPoints.feedback.base);
			if (Array.isArray(response)) return response;
			if (response && typeof response === "object" && "data" in response) {
				return (response as { data?: Feedback[] }).data || [];
			}
			return [];
		},
		retry: 1,
		refetchOnWindowFocus: false,
	});
};

// Get feedback by id
export const useFeedbackById = (id: string) => {
	return useQuery({
		queryKey: reactQueryKeys.feedback.detail(id),
		queryFn: async (): Promise<Feedback> => {
			const response = await apiRepo.GET(endPoints.feedback.byId(id));
			if (response && typeof response === "object" && "data" in response) {
				return (response as { data: Feedback }).data;
			}
			return response as Feedback;
		},
		enabled: !!id,
		retry: 1,
		refetchOnWindowFocus: false,
	});
};

// Filtered queries
export const useFeedbackByUser = (userId: string) => {
	return useQuery({
		queryKey: reactQueryKeys.feedback.byUser(userId),
		queryFn: async (): Promise<Feedback[]> => {
			const response = await apiRepo.GET(endPoints.feedback.byUser(userId));
			if (Array.isArray(response)) return response;
			if (response && typeof response === "object" && "data" in response) {
				return (response as { data?: Feedback[] }).data || [];
			}
			return [];
		},
		enabled: !!userId,
		retry: 1,
		refetchOnWindowFocus: false,
	});
};

export const useFeedbackByCategory = (category: string) => {
	return useQuery({
		queryKey: reactQueryKeys.feedback.byCategory(category),
		queryFn: async (): Promise<Feedback[]> => {
			const response = await apiRepo.GET(
				endPoints.feedback.byCategory(category)
			);
			if (Array.isArray(response)) return response;
			if (response && typeof response === "object" && "data" in response) {
				return (response as { data?: Feedback[] }).data || [];
			}
			return [];
		},
		enabled: !!category,
		retry: 1,
		refetchOnWindowFocus: false,
	});
};

export const useFeedbackByTask = (taskId: string) => {
	return useQuery({
		queryKey: reactQueryKeys.feedback.byTask(taskId),
		queryFn: async (): Promise<Feedback[]> => {
			const response = await apiRepo.GET(endPoints.feedback.byTask(taskId));
			if (Array.isArray(response)) return response;
			if (response && typeof response === "object" && "data" in response) {
				return (response as { data?: Feedback[] }).data || [];
			}
			return [];
		},
		enabled: !!taskId,
		retry: 1,
		refetchOnWindowFocus: false,
	});
};

export const useFeedbackByMeeting = (eventId: string) => {
	return useQuery({
		queryKey: reactQueryKeys.feedback.byMeeting(eventId),
		queryFn: async (): Promise<Feedback[]> => {
			const response = await apiRepo.GET(endPoints.feedback.byMeeting(eventId));
			if (Array.isArray(response)) return response;
			if (response && typeof response === "object" && "data" in response) {
				return (response as { data?: Feedback[] }).data || [];
			}
			return [];
		},
		enabled: !!eventId,
		retry: 1,
		refetchOnWindowFocus: false,
	});
};

export const useFeedbackByAttendance = (attendanceId: string) => {
	return useQuery({
		queryKey: reactQueryKeys.feedback.byAttendance(attendanceId),
		queryFn: async (): Promise<Feedback[]> => {
			const response = await apiRepo.GET(
				endPoints.feedback.byAttendance(attendanceId)
			);
			if (Array.isArray(response)) return response;
			if (response && typeof response === "object" && "data" in response) {
				return (response as { data?: Feedback[] }).data || [];
			}
			return [];
		},
		enabled: !!attendanceId,
		retry: 1,
		refetchOnWindowFocus: false,
	});
};

// Create feedback
export const useCreateFeedback = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data: CreateFeedbackData): Promise<Feedback> => {
			const response = await apiRepo.POST(endPoints.feedback.base, data);
			if (response && typeof response === "object" && "data" in response) {
				return (response as { data: Feedback }).data;
			}
			return response as Feedback;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: reactQueryKeys.feedback.lists(),
			});
			toastService.success("Feedback created successfully!");
		},
		onError: (error: unknown) => {
			const errorMessage =
				(error as { response?: { data?: { message?: string } } })?.response
					?.data?.message || "Failed to create feedback";
			toastService.error(errorMessage);
		},
	});
};

// Update feedback
export const useUpdateFeedback = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({
			id,
			data,
		}: {
			id: string;
			data: UpdateFeedbackData;
		}): Promise<Feedback> => {
			const response = await apiRepo.PATCH(endPoints.feedback.byId(id), data);
			if (response && typeof response === "object" && "data" in response) {
				return (response as { data: Feedback }).data;
			}
			return response as Feedback;
		},
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({
				queryKey: reactQueryKeys.feedback.lists(),
			});
			queryClient.invalidateQueries({
				queryKey: reactQueryKeys.feedback.detail(id),
			});
			toastService.success("Feedback updated successfully!");
		},
		onError: (error: unknown) => {
			const errorMessage =
				(error as { response?: { data?: { message?: string } } })?.response
					?.data?.message || "Failed to update feedback";
			toastService.error(errorMessage);
		},
	});
};

// Delete feedback
export const useDeleteFeedback = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id: string): Promise<void> => {
			await apiRepo.DELETE(endPoints.feedback.byId(id));
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: reactQueryKeys.feedback.lists(),
			});
			toastService.success("Feedback deleted successfully!");
		},
		onError: (error: unknown) => {
			const errorMessage =
				(error as { response?: { data?: { message?: string } } })?.response
					?.data?.message || "Failed to delete feedback";
			toastService.error(errorMessage);
		},
	});
};
