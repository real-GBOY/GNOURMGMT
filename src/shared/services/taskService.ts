/** @format */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiRepo from "../config/apiRepo";
import endPoints from "../config/endPoints";
import { reactQueryKeys } from "../config/reactQueryKeys";
import {
	Task,
	CreateTaskData,
	UpdateTaskData,
	TaskResponse,
	TasksResponse,
} from "../types/Task";
import { toastService } from "./toastService";

// Get all tasks
export const useTasks = () => {
	return useQuery({
		queryKey: reactQueryKeys.tasks.lists(),
		queryFn: async (): Promise<Task[]> => {
			const response: TasksResponse = await apiRepo.GET(endPoints.tasks.base);
			return response.data || [];
		},
		retry: 1,
		refetchOnWindowFocus: false,
	});
};

// Get task by ID
export const useTask = (id: string) => {
	return useQuery({
		queryKey: reactQueryKeys.tasks.detail(id),
		queryFn: async (): Promise<Task> => {
			const response: TaskResponse = await apiRepo.GET(
				endPoints.tasks.task(id)
			);
			return response.data;
		},
		enabled: !!id,
		retry: 1,
		refetchOnWindowFocus: false,
	});
};

// Create task
export const useCreateTask = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: CreateTaskData): Promise<Task> => {
			// If files are provided, use FormData
			if (data.files && data.files.length > 0) {
				const formData = new FormData();

				// Add task data
				formData.append("title", data.title);
				formData.append("description", data.description);
				formData.append("dueDate", data.dueDate);
				formData.append("whatAppGroup", data.whatAppGroup || "");

				// Add userid if available (from auth context)
				if (data.userId) {
					formData.append("userid", data.userId);
				}

				// Add files
				data.files.forEach((file) => {
					formData.append("file", file);
				});

				const response: TaskResponse = await apiRepo.POST(
					endPoints.tasks.base,
					formData
				);
				return response.data;
			} else {
				// No files, send as JSON
				const { files, ...taskData } = data;
				const response: TaskResponse = await apiRepo.POST(
					endPoints.tasks.base,
					taskData
				);
				return response.data;
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: reactQueryKeys.tasks.lists() });
			toastService.success("Task created successfully!");
		},
		onError: (error: unknown) => {
			const errorMessage =
				(error as { response?: { data?: { message?: string } } })?.response
					?.data?.message || "Failed to create task";
			toastService.error(errorMessage);
		},
	});
};

// Update task
export const useUpdateTask = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			id,
			data,
		}: {
			id: string;
			data: UpdateTaskData;
		}): Promise<Task> => {
			const response: TaskResponse = await apiRepo.PATCH(
				endPoints.tasks.task(id),
				data
			);
			return response.data;
		},
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({ queryKey: reactQueryKeys.tasks.lists() });
			queryClient.invalidateQueries({
				queryKey: reactQueryKeys.tasks.detail(id),
			});
			toastService.success("Task updated successfully!");
		},
		onError: (error: unknown) => {
			const errorMessage =
				(error as { response?: { data?: { message?: string } } })?.response
					?.data?.message || "Failed to update task";
			toastService.error(errorMessage);
		},
	});
};

// Delete task
export const useDeleteTask = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string): Promise<void> => {
			await apiRepo.DELETE(endPoints.tasks.task(id));
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: reactQueryKeys.tasks.lists() });
			toastService.success("Task deleted successfully!");
		},
		onError: (error: unknown) => {
			const errorMessage =
				(error as { response?: { data?: { message?: string } } })?.response
					?.data?.message || "Failed to delete task";
			toastService.error(errorMessage);
		},
	});
};

// Upload file to task
export const useUploadFileToTask = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			id,
			file,
		}: {
			id: string;
			file: File;
		}): Promise<Task> => {
			const formData = new FormData();
			formData.append("file", file);

			const response: TaskResponse = await apiRepo.POST(
				endPoints.tasks.uploadFile(id),
				formData
			);
			return response.data;
		},
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({ queryKey: reactQueryKeys.tasks.lists() });
			queryClient.invalidateQueries({
				queryKey: reactQueryKeys.tasks.detail(id),
			});
			toastService.success("File uploaded successfully!");
		},
		onError: (error: unknown) => {
			const errorMessage =
				(error as { response?: { data?: { message?: string } } })?.response
					?.data?.message || "Failed to upload file";
			toastService.error(errorMessage);
		},
	});
};

// Remove file from task
export const useRemoveFileFromTask = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			id,
			fileId,
		}: {
			id: string;
			fileId: string;
		}): Promise<void> => {
			await apiRepo.DELETE(endPoints.tasks.removeFile(id, fileId));
		},
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({ queryKey: reactQueryKeys.tasks.lists() });
			queryClient.invalidateQueries({
				queryKey: reactQueryKeys.tasks.detail(id),
			});
			toastService.success("File removed successfully!");
		},
		onError: (error: unknown) => {
			const errorMessage =
				(error as { response?: { data?: { message?: string } } })?.response
					?.data?.message || "Failed to remove file";
			toastService.error(errorMessage);
		},
	});
};
