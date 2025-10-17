/** @format */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiRepo from "../config/apiRepo";
import endPoints from "../config/endPoints";
import { reactQueryKeys } from "../config/reactQueryKeys";
import { User, Role, VerifyUserData, AssignRoleData } from "../types/User";
import { toastService } from "./toastService";

// Get unverified users
export const useUnverifiedUsers = (enabled: boolean = true) => {
	return useQuery({
		queryKey: reactQueryKeys.users.unverified(),
		queryFn: async (): Promise<User[]> => {
			console.log("🔍 [useUnverifiedUsers] Fetching unverified users...");
			const response = await apiRepo.GET(endPoints.unverifiedUsers);
			console.log("🔍 [useUnverifiedUsers] Raw API response:", response);

			// Check if response has a data property (common API pattern)
			let users: User[] = [];
			if (response && typeof response === "object" && "data" in response) {
				users = response.data || [];
			} else {
				users = response || [];
			}

			console.log("🔍 [useUnverifiedUsers] Processed users:", users);
			console.log("🔍 [useUnverifiedUsers] Users count:", users.length);
			if (users.length > 0) {
				console.log(
					"🔍 [useUnverifiedUsers] Sample user verification status:",
					users.map((u) => ({
						id: u._id,
						email: u.email,
						isVerified: u.isVerified,
						authType: u.authType,
					}))
				);
			}

			return users;
		},
		enabled,
		retry: 1,
		refetchOnWindowFocus: false,
	});
};

// Get all roles
export const useRoles = () => {
	return useQuery({
		queryKey: reactQueryKeys.roles.lists(),
		queryFn: async (): Promise<Role[]> => {
			try {
				const response = await apiRepo.GET(endPoints.roles);

				// Handle different response formats
				if (response && typeof response === "object") {
					// If response is directly an array (most likely case)
					if (Array.isArray(response)) {
						return response;
					}
					// If response has a data property
					if ("data" in response) {
						const data = response.data;
						if (Array.isArray(data)) {
							return data;
						}
						return [];
					}
					// If response has a success property and data
					if ("success" in response && "data" in response) {
						const data = response.data;
						if (Array.isArray(data)) {
							return data;
						}
						return [];
					}
				}

				return [];
			} catch (error) {
				console.error("Error fetching roles:", error);
				throw error;
			}
		},
		retry: 1,
		refetchOnWindowFocus: false,
	});
};

// Verify user
export const useVerifyUser = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			id,
			data,
		}: {
			id: string;
			data: VerifyUserData;
		}): Promise<User> => {
			const response = await apiRepo.PATCH(endPoints.verifyUser(id), data);
			return response;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: reactQueryKeys.users.unverified(),
			});
			toastService.success("User verified successfully!");
		},
		onError: (error: unknown) => {
			const errorMessage =
				(error as { response?: { data?: { message?: string } } })?.response
					?.data?.message || "Failed to verify user";
			toastService.error(errorMessage);
		},
	});
};

// Assign role to user
export const useAssignRole = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			id,
			data,
		}: {
			id: string;
			data: AssignRoleData;
		}): Promise<User> => {
			const response = await apiRepo.PATCH(endPoints.assignRole(id), data);
			return response;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: reactQueryKeys.users.unverified(),
			});
			toastService.success("Role assigned successfully!");
		},
		onError: (error: unknown) => {
			const errorMessage =
				(error as { response?: { data?: { message?: string } } })?.response
					?.data?.message || "Failed to assign role";
			toastService.error(errorMessage);
		},
	});
};

// Combined verify user with role assignment
export const useVerifyUserWithRole = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			userId,
			data,
		}: {
			userId: string;
			data: { isVerified: boolean; role: string };
		}): Promise<User> => {
			const response = await apiRepo.PATCH(endPoints.verifyUser(userId), data);
			return response;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: reactQueryKeys.users.unverified(),
			});
			toastService.success("User verified and role assigned successfully!");
		},
		onError: (error: unknown) => {
			const errorMessage =
				(error as { response?: { data?: { message?: string } } })?.response
					?.data?.message || "Failed to verify user";
			toastService.error(errorMessage);
		},
	});
};

// Get all users
export const useUsers = (enabled: boolean = true) => {
	return useQuery({
		queryKey: reactQueryKeys.users.lists(),
		queryFn: async (): Promise<User[]> => {
			const response = await apiRepo.GET(endPoints.users);
			// Check if response has a data property (common API pattern)
			if (response && typeof response === "object" && "data" in response) {
				return response.data || [];
			}
			return response || [];
		},
		enabled,
		retry: 1,
		refetchOnWindowFocus: false,
	});
};

// Utility function to find user by ID from a users array
export const findUserById = (
	users: User[],
	userId: string
): User | undefined => {
	return users?.find((u) => u._id === userId);
};

// Utility function to get user display name
export const getUserDisplayName = (user: User): string => {
	return `${user.firstName} ${user.lastName}`;
};

// Utility function to get user role name
export const getUserRoleName = (user: User): string => {
	if (typeof user.role === "object" && user.role?.key) {
		return user.role.key;
	} else if (typeof user.role === "string") {
		return user.role;
	}
	return "No Role Assigned";
};

// Utility function to check if user is verified
export const isUserVerified = (user: User): boolean => {
	return user.isVerified === true;
};

// Utility function to check if user is active
export const isUserActive = (user: User): boolean => {
	return user.isActive === true;
};

// Get single user by ID (using existing endpoints)
export const useUser = (userId: string, enabled: boolean = true) => {
	const { data: users, isLoading, error } = useUsers(enabled);

	// Find the specific user from the cached users data
	const user = findUserById(users || [], userId);

	return {
		data: user,
		isLoading,
		error: error || (!user && users ? new Error("User not found") : null),
	};
};

// Get user by ID with fallback to unverified users if not found in all users
export const useUserWithFallback = (
	userId: string,
	enabled: boolean = true
) => {
	const {
		data: allUsers,
		isLoading: allUsersLoading,
		error: allUsersError,
	} = useUsers(enabled);
	const {
		data: unverifiedUsers,
		isLoading: unverifiedLoading,
		error: unverifiedError,
	} = useUnverifiedUsers(enabled);

	// Try to find user in all users first, then in unverified users
	const user =
		findUserById(allUsers || [], userId) ||
		findUserById(unverifiedUsers || [], userId);

	const isLoading = allUsersLoading || unverifiedLoading;
	const error =
		allUsersError ||
		unverifiedError ||
		(!user && (allUsers || unverifiedUsers)
			? new Error("User not found")
			: null);

	return {
		data: user,
		isLoading,
		error,
	};
};

// Update task assignment
export const useUpdateTaskAssignment = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			taskId,
			userIds,
		}: {
			taskId: string;
			userIds: string[];
		}): Promise<{ success: boolean; message?: string }> => {
			const response = await apiRepo.PATCH(endPoints.task(taskId), {
				assignedTo: userIds,
			});
			return response;
		},
		onSuccess: (_, variables) => {
			// Invalidate task queries
			queryClient.invalidateQueries({
				queryKey: reactQueryKeys.tasks.detail(variables.taskId),
			});
			queryClient.invalidateQueries({ queryKey: reactQueryKeys.tasks.lists() });
			toastService.success("Task assignment updated successfully!");
		},
		onError: (error: unknown) => {
			const errorMessage =
				(error as { response?: { data?: { message?: string } } })?.response
					?.data?.message || "Failed to update task assignment";
			toastService.error(errorMessage);
		},
	});
};

// Get current user profile
export const useCurrentUserProfile = (enabled: boolean = true) => {
	return useQuery({
		queryKey: reactQueryKeys.users.profile(),
		queryFn: async (): Promise<User> => {
			const response = await apiRepo.GET(endPoints.profile);
			// Check if response has a data property (common API pattern)
			if (response && typeof response === "object" && "data" in response) {
				return response.data;
			}
			return response;
		},
		enabled,
		retry: 1,
		refetchOnWindowFocus: false,
	});
};

// Get profile by ID
export const useProfileById = (id: string, enabled: boolean = true) => {
	return useQuery({
		queryKey: reactQueryKeys.users.profile(),
		queryFn: async (): Promise<User> => {
			const response = await apiRepo.GET(endPoints.profileById(id));
			// Check if response has a data property (common API pattern)
			if (response && typeof response === "object" && "data" in response) {
				return response.data;
			}
			return response;
		},
		enabled,
		retry: 1,
		refetchOnWindowFocus: false,
	});
};

// Update user profile
export const useUpdateUserProfile = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (
			data: Partial<User> & { file?: File }
		): Promise<User> => {
			// If file is provided, use FormData
			if (data.file) {
				const formData = new FormData();

				// Add profile data
				Object.entries(data).forEach(([key, value]) => {
					if (key !== "file" && value !== undefined && value !== null) {
						formData.append(key, value.toString());
					}
				});

				// Add file
				formData.append("file", data.file);

				const response = await apiRepo.PUT(endPoints.profile, formData);
				return response;
			} else {
				// No file, send as JSON
				const { file, ...profileData } = data;
				const response = await apiRepo.PUT(endPoints.profile, profileData);
				return response;
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: reactQueryKeys.users.profile(),
			});
			toastService.success("Profile updated successfully!");
		},
		onError: (error: unknown) => {
			const errorMessage =
				(error as { response?: { data?: { message?: string } } })?.response
					?.data?.message || "Failed to update profile";
			toastService.error(errorMessage);
		},
	});
};

// Change password
export const useChangePassword = () => {
	return useMutation({
		mutationFn: async (data: {
			currentPassword: string;
			newPassword: string;
		}): Promise<{ success: boolean; message: string }> => {
			const response = await apiRepo.PUT(endPoints.changePassword, data);
			return response;
		},
		onSuccess: () => {
			toastService.success("Password changed successfully!");
		},
		onError: (error: unknown) => {
			const errorMessage =
				(error as { response?: { data?: { message?: string } } })?.response
					?.data?.message || "Failed to change password";
			toastService.error(errorMessage);
		},
	});
};
