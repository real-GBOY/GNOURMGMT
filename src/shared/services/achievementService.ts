/** @format */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiRepo from "../config/apiRepo";
import endPoints from "../config/endPoints";
import { reactQueryKeys } from "../config/reactQueryKeys";
import {
	Achievement,
	CreateAchievementData,
	UpdateAchievementData,
	AssignAchievementData,
	AchievementStats,
	AchievementsResponse,
	AchievementResponse,
	AchievementStatsResponse,
} from "../types/Achievement";
import { toastService } from "./toastService";
import { ApiError } from "../types";

// Get all achievements
export const useAchievements = (filters?: string) => {
	return useQuery({
		queryKey: filters
			? reactQueryKeys.achievements.list(filters)
			: reactQueryKeys.achievements.lists(),
		queryFn: async (): Promise<Achievement[]> => {
			const response: AchievementsResponse = await apiRepo.GET(
				filters
					? `${endPoints.achievements.base}?${filters}`
					: endPoints.achievements.base
			);
			return response?.data || [];
		},
		retry: 1,
		refetchOnWindowFocus: false,
	});
};

// Get achievement by ID
export const useAchievement = (id: string, enabled: boolean = true) => {
	return useQuery({
		queryKey: reactQueryKeys.achievements.detail(id),
		queryFn: async (): Promise<Achievement> => {
			const response: AchievementResponse = await apiRepo.GET(
				endPoints.achievements.achievement(id)
			);
			return response.data;
		},
		enabled,
		retry: 1,
		refetchOnWindowFocus: false,
	});
};

// Get achievements by user
export const useUserAchievements = (
	userId: string,
	filters?: string,
	enabled: boolean = true
) => {
	return useQuery({
		queryKey: filters
			? [...reactQueryKeys.achievements.byUser(userId), { filters }]
			: reactQueryKeys.achievements.byUser(userId),
		queryFn: async (): Promise<Achievement[]> => {
			const response: AchievementsResponse = await apiRepo.GET(
				filters
					? `${endPoints.achievements.byUser(userId)}?${filters}`
					: endPoints.achievements.byUser(userId)
			);
			return response?.data || [];
		},
		enabled,
		retry: 1,
		refetchOnWindowFocus: false,
	});
};

// Get achievement statistics
export const useAchievementStats = () => {
	return useQuery({
		queryKey: reactQueryKeys.achievements.stats(),
		queryFn: async (): Promise<AchievementStats> => {
			const response: AchievementStatsResponse = await apiRepo.GET(
				endPoints.achievements.stats
			);
			return response.data;
		},
		retry: 1,
		refetchOnWindowFocus: false,
	});
};

// Create achievement
export const useCreateAchievement = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: CreateAchievementData): Promise<Achievement> => {
			console.log(
				"useCreateAchievement: Creating achievement with data:",
				data
			);
			try {
				const response: AchievementResponse = await apiRepo.POST(
					endPoints.achievements.base,
					data
				);
				console.log(
					"useCreateAchievement: Achievement created successfully:",
					response
				);
				return response.data;
			} catch (error) {
				console.error(
					"useCreateAchievement: Failed to create achievement:",
					error
				);
				throw error;
			}
		},
		onSuccess: () => {
			console.log("useCreateAchievement: Success callback triggered");
			queryClient.invalidateQueries({
				queryKey: reactQueryKeys.achievements.all,
			});
			toastService.success("Achievement created successfully!");
		},
		onError: (error: ApiError) => {
			console.error("useCreateAchievement: Error callback triggered:", error);
			toastService.error(
				error?.response?.data?.message || "Failed to create achievement"
			);
		},
	});
};

// Create achievement with file upload
export const useCreateAchievementWithFile = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (formData: FormData): Promise<Achievement> => {
			const response: AchievementResponse = await apiRepo.POST(
				endPoints.achievements.base,
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: reactQueryKeys.achievements.all,
			});
			toastService.success("Achievement created successfully!");
		},
		onError: (error: ApiError) => {
			toastService.error(
				error?.response?.data?.message || "Failed to create achievement"
			);
		},
	});
};

// Assign achievement to user
export const useAssignAchievement = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: AssignAchievementData): Promise<Achievement> => {
			const response: AchievementResponse = await apiRepo.POST(
				endPoints.achievements.assign,
				data
			);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: reactQueryKeys.achievements.all,
			});
			toastService.success("Achievement assigned successfully!");
		},
		onError: (error: ApiError) => {
			toastService.error(
				error?.response?.data?.message || "Failed to assign achievement"
			);
		},
	});
};

// Assign achievement with file upload
export const useAssignAchievementWithFile = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (formData: FormData): Promise<Achievement> => {
			const response: AchievementResponse = await apiRepo.POST(
				endPoints.achievements.assign,
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: reactQueryKeys.achievements.all,
			});
			toastService.success("Achievement assigned successfully!");
		},
		onError: (error: any) => {
			toastService.error(
				error?.response?.data?.message || "Failed to assign achievement"
			);
		},
	});
};

// Update achievement
export const useUpdateAchievement = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			id,
			data,
		}: {
			id: string;
			data: UpdateAchievementData;
		}): Promise<Achievement> => {
			const response: AchievementResponse = await apiRepo.PUT(
				endPoints.achievements.achievement(id),
				data
			);
			return response.data;
		},
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({
				queryKey: reactQueryKeys.achievements.detail(id),
			});
			queryClient.invalidateQueries({
				queryKey: reactQueryKeys.achievements.all,
			});
			toastService.success("Achievement updated successfully!");
		},
		onError: (error: any) => {
			toastService.error(
				error?.response?.data?.message || "Failed to update achievement"
			);
		},
	});
};

// Delete achievement
export const useDeleteAchievement = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string): Promise<void> => {
			await apiRepo.DELETE(endPoints.achievements.achievement(id));
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: reactQueryKeys.achievements.all,
			});
			toastService.success("Achievement deleted successfully!");
		},
		onError: (error: any) => {
			toastService.error(
				error?.response?.data?.message || "Failed to delete achievement"
			);
		},
	});
};

// Upload supporting document
export const useUploadSupportingDocument = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			id,
			formData,
		}: {
			id: string;
			formData: FormData;
		}): Promise<void> => {
			await apiRepo.POST(
				endPoints.achievements.uploadSupportingDocument(id),
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);
		},
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({
				queryKey: reactQueryKeys.achievements.detail(id),
			});
			toastService.success("Supporting document uploaded successfully!");
		},
		onError: (error: any) => {
			toastService.error(
				error?.response?.data?.message || "Failed to upload supporting document"
			);
		},
	});
};

// Upload evidence file
export const useUploadEvidenceFile = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			id,
			formData,
		}: {
			id: string;
			formData: FormData;
		}): Promise<void> => {
			await apiRepo.POST(
				endPoints.achievements.uploadEvidenceFile(id),
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);
		},
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({
				queryKey: reactQueryKeys.achievements.detail(id),
			});
			toastService.success("Evidence file uploaded successfully!");
		},
		onError: (error: any) => {
			toastService.error(
				error?.response?.data?.message || "Failed to upload evidence file"
			);
		},
	});
};

// Remove supporting document
export const useRemoveSupportingDocument = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			id,
			fileIndex,
		}: {
			id: string;
			fileIndex: number;
		}): Promise<void> => {
			await apiRepo.DELETE(
				endPoints.achievements.removeSupportingDocument(id, fileIndex)
			);
		},
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({
				queryKey: reactQueryKeys.achievements.detail(id),
			});
			toastService.success("Supporting document removed successfully!");
		},
		onError: (error: any) => {
			toastService.error(
				error?.response?.data?.message || "Failed to remove supporting document"
			);
		},
	});
};

// Remove certificate file
export const useRemoveCertificateFile = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			id,
			fileIndex,
		}: {
			id: string;
			fileIndex: number;
		}): Promise<void> => {
			await apiRepo.DELETE(
				endPoints.achievements.removeCertificateFile(id, fileIndex)
			);
		},
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({
				queryKey: reactQueryKeys.achievements.detail(id),
			});
			toastService.success("Certificate file removed successfully!");
		},
		onError: (error: any) => {
			toastService.error(
				error?.response?.data?.message || "Failed to remove certificate file"
			);
		},
	});
};

// Remove evidence file
export const useRemoveEvidenceFile = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			id,
			fileIndex,
		}: {
			id: string;
			fileIndex: number;
		}): Promise<void> => {
			await apiRepo.DELETE(
				endPoints.achievements.removeEvidenceFile(id, fileIndex)
			);
		},
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({
				queryKey: reactQueryKeys.achievements.detail(id),
			});
			toastService.success("Evidence file removed successfully!");
		},
		onError: (error: any) => {
			toastService.error(
				error?.response?.data?.message || "Failed to remove evidence file"
			);
		},
	});
};
