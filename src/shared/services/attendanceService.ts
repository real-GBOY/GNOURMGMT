/** @format */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiRepo from "../config/apiRepo";
import endPoints from "../config/endPoints";
import { reactQueryKeys } from "../config/reactQueryKeys";
import {
	Attendance,
	CreateAttendanceData,
	UpdateAttendanceData,
	VerifyAttendanceData,
	AddFeedbackData,
} from "../types/Attendance";
import { toastService } from "./toastService";

// Get all attendance records
export const useAttendance = () => {
	return useQuery({
		queryKey: reactQueryKeys.attendance.lists(),
		queryFn: async (): Promise<Attendance[]> => {
			const response = await apiRepo.GET(endPoints.attendance.base);
			return response || [];
		},
		retry: 1,
		refetchOnWindowFocus: false,
	});
};

// Get attendance record by ID
export const useAttendanceById = (id: string) => {
	return useQuery({
		queryKey: reactQueryKeys.attendance.detail(id),
		queryFn: async (): Promise<Attendance> => {
			const response = await apiRepo.GET(endPoints.attendance.byId(id));
			return response;
		},
		enabled: !!id,
		retry: 1,
		refetchOnWindowFocus: false,
	});
};

// Get attendance records by user
export const useAttendanceByUser = (userId: string) => {
	return useQuery({
		queryKey: reactQueryKeys.attendance.byUser(userId),
		queryFn: async (): Promise<Attendance[]> => {
			const response = await apiRepo.GET(endPoints.attendance.byUser(userId));
			return response || [];
		},
		enabled: !!userId,
		retry: 1,
		refetchOnWindowFocus: false,
	});
};

// Get attendance records by event
export const useAttendanceByEvent = (eventId: string) => {
	return useQuery({
		queryKey: reactQueryKeys.attendance.byEvent(eventId),
		queryFn: async (): Promise<Attendance[]> => {
			const response = await apiRepo.GET(endPoints.attendance.byEvent(eventId));
			return response || [];
		},
		enabled: !!eventId,
		retry: 1,
		refetchOnWindowFocus: false,
	});
};

// Check if user has marked attendance for a specific event
export const useAttendanceByUserAndEvent = (
	userId: string,
	eventId: string
) => {
	return useQuery({
		queryKey: reactQueryKeys.attendance.byUserAndEvent(userId, eventId),
		queryFn: async (): Promise<Attendance | null> => {
			const response = await apiRepo.GET(
				endPoints.attendance.byUserAndEvent(userId, eventId)
			);
			return response || null;
		},
		enabled: !!userId && !!eventId,
		retry: 1,
		refetchOnWindowFocus: false,
	});
};

// Create attendance record
export const useCreateAttendance = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: CreateAttendanceData): Promise<Attendance> => {
			const response = await apiRepo.POST(endPoints.attendance.base, data);
			return response;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: reactQueryKeys.attendance.lists(),
			});
			toastService.success("Attendance record created successfully!");
		},
		onError: (error: unknown) => {
			const errorMessage =
				(error as { response?: { data?: { message?: string } } })?.response
					?.data?.message || "Failed to create attendance record";
			toastService.error(errorMessage);
		},
	});
};

// Update attendance record
export const useUpdateAttendance = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			id,
			data,
		}: {
			id: string;
			data: UpdateAttendanceData;
		}): Promise<Attendance> => {
			const response = await apiRepo.PATCH(endPoints.attendance.byId(id), data);
			return response;
		},
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({
				queryKey: reactQueryKeys.attendance.lists(),
			});
			queryClient.invalidateQueries({
				queryKey: reactQueryKeys.attendance.detail(id),
			});
			toastService.success("Attendance record updated successfully!");
		},
		onError: (error: unknown) => {
			const errorMessage =
				(error as { response?: { data?: { message?: string } } })?.response
					?.data?.message || "Failed to update attendance record";
			toastService.error(errorMessage);
		},
	});
};

// Delete attendance record
export const useDeleteAttendance = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string): Promise<void> => {
			await apiRepo.DELETE(endPoints.attendance.byId(id));
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: reactQueryKeys.attendance.lists(),
			});
			toastService.success("Attendance record deleted successfully!");
		},
		onError: (error: unknown) => {
			const errorMessage =
				(error as { response?: { data?: { message?: string } } })?.response
					?.data?.message || "Failed to delete attendance record";
			toastService.error(errorMessage);
		},
	});
};

// Verify attendance
export const useVerifyAttendance = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			id,
			data,
		}: {
			id: string;
			data: VerifyAttendanceData;
		}): Promise<Attendance> => {
			// Debug: Log the request details
			console.log("Verifying attendance with ID:", id);
			console.log("Verification data:", data);
			console.log("Endpoint:", endPoints.attendance.verify(id));

			const response = await apiRepo.PATCH(
				endPoints.attendance.verify(id),
				data
			);
			return response;
		},
		onSuccess: (data, { id }) => {
			queryClient.invalidateQueries({
				queryKey: reactQueryKeys.attendance.lists(),
			});
			queryClient.invalidateQueries({
				queryKey: reactQueryKeys.attendance.detail(id),
			});

			// Enhanced success message based on verification status
			const isVerified = data.verified;
			const message = isVerified
				? "✅ Attendance verified successfully!"
				: "❌ Attendance unverified successfully!";

			toastService.success(message);
		},
		onError: (error: unknown) => {
			console.error("Verification error:", error);

			// Extract error message from different possible error formats
			let errorMessage = "Failed to verify attendance";

			if (error && typeof error === "object") {
				// Try to extract message from axios error response
				const axiosError = error as any;
				if (axiosError.response?.data?.message) {
					errorMessage = axiosError.response.data.message;
				} else if (axiosError.message) {
					errorMessage = axiosError.message;
				}

				// Log additional error details for debugging
				console.error("Error details:", {
					status: axiosError.response?.status,
					statusText: axiosError.response?.statusText,
					data: axiosError.response?.data,
					message: axiosError.message,
				});
			}

			toastService.error(errorMessage);
		},
	});
};

// Add feedback to attendance
export const useAddFeedback = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			id,
			data,
		}: {
			id: string;
			data: AddFeedbackData;
		}): Promise<Attendance> => {
			const response = await apiRepo.PATCH(
				endPoints.attendance.addFeedback(id),
				data
			);
			return response;
		},
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({
				queryKey: reactQueryKeys.attendance.lists(),
			});
			queryClient.invalidateQueries({
				queryKey: reactQueryKeys.attendance.detail(id),
			});
			toastService.success("Feedback added successfully!");
		},
		onError: (error: unknown) => {
			const errorMessage =
				(error as { response?: { data?: { message?: string } } })?.response
					?.data?.message || "Failed to add feedback";
			toastService.error(errorMessage);
		},
	});
};
