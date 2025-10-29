/** @format */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiRepo from "../config/apiRepo";
import endPoints from "../config/endPoints";
import { reactQueryKeys } from "../config/reactQueryKeys";
import {
	Team,
	CreateTeamData,
	UpdateTeamData,
	TeamMember,
} from "../types/Team";
import { toastService } from "./toastService";

// Get all teams
export const useTeams = () => {
	return useQuery({
		queryKey: reactQueryKeys.teams.lists(),
		queryFn: async (): Promise<Team[]> => {
			const response = await apiRepo.GET(endPoints.teams.base);
			// The API returns teams directly as an array, not wrapped in data
			return response || [];
		},
		retry: 1,
		refetchOnWindowFocus: false,
	});
};

// Get team by ID
export const useTeam = (id: string) => {
	return useQuery({
		queryKey: reactQueryKeys.teams.detail(id),
		queryFn: async (): Promise<Team> => {
			const response = await apiRepo.GET(endPoints.teams.team(id));
			// The API returns team directly, not wrapped in data
			return response;
		},
		enabled: !!id,
		retry: 1,
		refetchOnWindowFocus: false,
	});
};

// Get team members
export const useTeamMembers = (teamId: string) => {
	return useQuery({
		queryKey: reactQueryKeys.teams.members(teamId),
		queryFn: async (): Promise<TeamMember[]> => {
			const response = await apiRepo.GET(endPoints.teams.members(teamId));
			// Handle the new API response structure
			if (
				response &&
				response.success &&
				response.data &&
				response.data.members
			) {
				return response.data.members;
			}
			return [];
		},
		enabled: !!teamId,
		retry: 1,
		refetchOnWindowFocus: false,
	});
};

// Create team
export const useCreateTeam = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: CreateTeamData): Promise<Team> => {
			const response = await apiRepo.POST(endPoints.teams.base, data);
			return response;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: reactQueryKeys.teams.lists() });
			toastService.success("Team created successfully!");
		},
		onError: (error: unknown) => {
			const errorMessage =
				(error as { response?: { data?: { message?: string } } })?.response
					?.data?.message || "Failed to create team";
			toastService.error(errorMessage);
		},
	});
};

// Update team
export const useUpdateTeam = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			id,
			data,
		}: {
			id: string;
			data: UpdateTeamData;
		}): Promise<Team> => {
			const response = await apiRepo.PATCH(endPoints.teams.team(id), data);
			return response;
		},
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({ queryKey: reactQueryKeys.teams.lists() });
			queryClient.invalidateQueries({
				queryKey: reactQueryKeys.teams.detail(id),
			});
			toastService.success("Team updated successfully!");
		},
		onError: (error: unknown) => {
			const errorMessage =
				(error as { response?: { data?: { message?: string } } })?.response
					?.data?.message || "Failed to update team";
			toastService.error(errorMessage);
		},
	});
};

// Delete team
export const useDeleteTeam = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string): Promise<void> => {
			await apiRepo.DELETE(endPoints.teams.team(id));
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: reactQueryKeys.teams.lists() });
			toastService.success("Team deleted successfully!");
		},
		onError: (error: unknown) => {
			const errorMessage =
				(error as { response?: { data?: { message?: string } } })?.response
					?.data?.message || "Failed to delete team";
			toastService.error(errorMessage);
		},
	});
};

// Add members to a team
export const useAddTeamMembers = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			teamId,
			memberIds,
		}: {
			teamId: string;
			memberIds: string[];
		}): Promise<void> => {
			await apiRepo.POST(endPoints.teams.members(teamId), {
				members: memberIds,
			});
		},
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({
				queryKey: reactQueryKeys.teams.members(variables.teamId),
			});
			queryClient.invalidateQueries({
				queryKey: reactQueryKeys.teams.detail(variables.teamId),
			});
			toastService.success("Members added successfully!");
		},
		onError: (error: unknown) => {
			const errorMessage =
				(error as { response?: { data?: { message?: string } } })?.response
					?.data?.message || "Failed to add members";
			toastService.error(errorMessage);
		},
	});
};
