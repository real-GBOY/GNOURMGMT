/** @format */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiRepo from "../config/apiRepo";
import endPoints from "../config/endPoints";
import { reactQueryKeys } from "../config/reactQueryKeys";
import { Event, CreateEventData, UpdateEventData } from "../types/Event";
import { toastService } from "./toastService";

// Get all events
export const useEvents = () => {
	return useQuery({
		queryKey: reactQueryKeys.events.lists(),
		queryFn: async (): Promise<Event[]> => {
			const response = await apiRepo.GET(endPoints.events.base);
			// The API returns events wrapped in { success: true, data: [...] }
			return response?.data || [];
		},
		retry: 1,
		refetchOnWindowFocus: false,
	});
};

// Get event by ID
export const useEvent = (id: string) => {
	return useQuery({
		queryKey: reactQueryKeys.events.detail(id),
		queryFn: async (): Promise<Event> => {
			const response = await apiRepo.GET(endPoints.events.event(id));
			// The API returns event wrapped in { success: true, data: {...} }
			return response?.data;
		},
		enabled: !!id,
		retry: 1,
		refetchOnWindowFocus: false,
	});
};

// Create event
export const useCreateEvent = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: CreateEventData): Promise<Event> => {
			// Handle multipart form data for file upload
			const formData = new FormData();
			formData.append("title", data.title);
			formData.append("description", data.description);
			formData.append("startDate", data.startDate);
			formData.append("endDate", data.endDate);
			formData.append("location", data.location);
			formData.append("eventType", data.eventType);
			formData.append("createdBy", data.createdBy);

			if (data.file) {
				formData.append("file", data.file);
			}

			const response = await apiRepo.POST(endPoints.events.base, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			return response?.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: reactQueryKeys.events.lists(),
			});
			toastService.success("Event created successfully!");
		},
		onError: (error: unknown) => {
			const errorMessage =
				(error as { response?: { data?: { message?: string } } })?.response
					?.data?.message || "Failed to create event";
			toastService.error(errorMessage);
		},
	});
};

// Update event
export const useUpdateEvent = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			id,
			data,
		}: {
			id: string;
			data: UpdateEventData;
		}): Promise<Event> => {
			// Handle multipart form data for file upload
			const formData = new FormData();

			if (data.title) formData.append("title", data.title);
			if (data.description) formData.append("description", data.description);
			if (data.startDate) formData.append("startDate", data.startDate);
			if (data.endDate) formData.append("endDate", data.endDate);
			if (data.location) formData.append("location", data.location);
			if (data.eventType) formData.append("eventType", data.eventType);

			if (data.file) {
				formData.append("file", data.file);
			}

			const response = await apiRepo.PATCH(
				endPoints.events.event(id),
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);
			return response?.data;
		},
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({
				queryKey: reactQueryKeys.events.lists(),
			});
			queryClient.invalidateQueries({
				queryKey: reactQueryKeys.events.detail(id),
			});
			toastService.success("Event updated successfully!");
		},
		onError: (error: unknown) => {
			const errorMessage =
				(error as { response?: { data?: { message?: string } } })?.response
					?.data?.message || "Failed to update event";
			toastService.error(errorMessage);
		},
	});
};

// Delete event
export const useDeleteEvent = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string): Promise<void> => {
			await apiRepo.DELETE(endPoints.events.event(id));
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: reactQueryKeys.events.lists(),
			});
			toastService.success("Event deleted successfully!");
		},
		onError: (error: unknown) => {
			const errorMessage =
				(error as { response?: { data?: { message?: string } } })?.response
					?.data?.message || "Failed to delete event";
			toastService.error(errorMessage);
		},
	});
};

// Upload file to event
export const useUploadFileToEvent = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			id,
			file,
		}: {
			id: string;
			file: File;
		}): Promise<Event> => {
			const formData = new FormData();
			formData.append("file", file);

			const response = await apiRepo.POST(
				endPoints.events.uploadFile(id),
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);
			return response?.data;
		},
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({
				queryKey: reactQueryKeys.events.lists(),
			});
			queryClient.invalidateQueries({
				queryKey: reactQueryKeys.events.detail(id),
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

// Remove file from event
export const useRemoveFileFromEvent = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string): Promise<Event> => {
			const response = await apiRepo.DELETE(endPoints.events.removeFile(id));
			return response?.data;
		},
		onSuccess: (_, id) => {
			queryClient.invalidateQueries({
				queryKey: reactQueryKeys.events.lists(),
			});
			queryClient.invalidateQueries({
				queryKey: reactQueryKeys.events.detail(id),
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

// Add guests to event
export const useAddGuestsToEvent = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			eventId,
			guestIds,
		}: {
			eventId: string;
			guestIds: string[];
		}): Promise<Event> => {
			const response = await apiRepo.POST(endPoints.events.addGuests(eventId), {
				guestIds,
			});
			return response?.data;
		},
		onSuccess: (_, { eventId }) => {
			queryClient.invalidateQueries({
				queryKey: reactQueryKeys.events.lists(),
			});
			queryClient.invalidateQueries({
				queryKey: reactQueryKeys.events.detail(eventId),
			});
			toastService.success("Guests added successfully!");
		},
		onError: (error: unknown) => {
			const errorMessage =
				(error as { response?: { data?: { message?: string } } })?.response
					?.data?.message || "Failed to add guests";
			toastService.error(errorMessage);
		},
	});
};

// Remove guests from event
export const useRemoveGuestsFromEvent = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			eventId,
			guestIds,
		}: {
			eventId: string;
			guestIds: string[];
		}): Promise<Event> => {
			const response = await apiRepo.DELETE(
				endPoints.events.removeGuests(eventId),
				{
					guestIds,
				}
			);
			return response?.data;
		},
		onSuccess: (_, { eventId }) => {
			queryClient.invalidateQueries({
				queryKey: reactQueryKeys.events.lists(),
			});
			queryClient.invalidateQueries({
				queryKey: reactQueryKeys.events.detail(eventId),
			});
			toastService.success("Guests removed successfully!");
		},
		onError: (error: unknown) => {
			const errorMessage =
				(error as { response?: { data?: { message?: string } } })?.response
					?.data?.message || "Failed to remove guests";
			toastService.error(errorMessage);
		},
	});
};
