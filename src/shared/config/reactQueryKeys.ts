/** @format */

export const reactQueryKeys = {
	teams: {
		all: ["teams"] as const,
		lists: () => [...reactQueryKeys.teams.all, "list"] as const,
		list: (filters: string) =>
			[...reactQueryKeys.teams.lists(), { filters }] as const,
		details: () => [...reactQueryKeys.teams.all, "detail"] as const,
		detail: (id: string) => [...reactQueryKeys.teams.details(), id] as const,
		members: (teamId: string) =>
			[...reactQueryKeys.teams.all, "members", teamId] as const,
	},
	tasks: {
		all: ["tasks"] as const,
		lists: () => [...reactQueryKeys.tasks.all, "list"] as const,
		list: (filters: string) =>
			[...reactQueryKeys.tasks.lists(), { filters }] as const,
		details: () => [...reactQueryKeys.tasks.all, "detail"] as const,
		detail: (id: string) => [...reactQueryKeys.tasks.details(), id] as const,
	},
	events: {
		all: ["events"] as const,
		lists: () => [...reactQueryKeys.events.all, "list"] as const,
		list: (filters: string) =>
			[...reactQueryKeys.events.lists(), { filters }] as const,
		details: () => [...reactQueryKeys.events.all, "detail"] as const,
		detail: (id: string) => [...reactQueryKeys.events.details(), id] as const,
	},
	users: {
		all: ["users"] as const,
		lists: () => [...reactQueryKeys.users.all, "list"] as const,
		list: (filters: string) =>
			[...reactQueryKeys.users.lists(), { filters }] as const,
		details: () => [...reactQueryKeys.users.all, "detail"] as const,
		detail: (id: string) => [...reactQueryKeys.users.details(), id] as const,
		unverified: () => [...reactQueryKeys.users.all, "unverified"] as const,
		profile: () => [...reactQueryKeys.users.all, "profile"] as const,
	},
	roles: {
		all: ["roles"] as const,
		lists: () => [...reactQueryKeys.roles.all, "list"] as const,
	},
	attendance: {
		all: ["attendance"] as const,
		lists: () => [...reactQueryKeys.attendance.all, "list"] as const,
		list: (filters: string) =>
			[...reactQueryKeys.attendance.lists(), { filters }] as const,
		details: () => [...reactQueryKeys.attendance.all, "detail"] as const,
		detail: (id: string) =>
			[...reactQueryKeys.attendance.details(), id] as const,
		byUser: (userId: string) =>
			[...reactQueryKeys.attendance.all, "user", userId] as const,
		byEvent: (eventId: string) =>
			[...reactQueryKeys.attendance.all, "event", eventId] as const,
		byUserAndEvent: (userId: string, eventId: string) =>
			[
				...reactQueryKeys.attendance.all,
				"user",
				userId,
				"event",
				eventId,
			] as const,
	},
	feedback: {
		all: ["feedback"] as const,
		lists: () => [...reactQueryKeys.feedback.all, "list"] as const,
		list: (filters: string) =>
			[...reactQueryKeys.feedback.lists(), { filters }] as const,
		details: () => [...reactQueryKeys.feedback.all, "detail"] as const,
		detail: (id: string) => [...reactQueryKeys.feedback.details(), id] as const,
		byUser: (userId: string) =>
			[...reactQueryKeys.feedback.all, "user", userId] as const,
		byCategory: (category: string) =>
			[...reactQueryKeys.feedback.all, "category", category] as const,
		byTask: (taskId: string) =>
			[...reactQueryKeys.feedback.all, "task", taskId] as const,
		byMeeting: (eventId: string) =>
			[...reactQueryKeys.feedback.all, "meeting", eventId] as const,
		byAttendance: (attendanceId: string) =>
			[...reactQueryKeys.feedback.all, "attendance", attendanceId] as const,
	},
	achievements: {
		all: ["achievements"] as const,
		lists: () => [...reactQueryKeys.achievements.all, "list"] as const,
		list: (filters: string) =>
			[...reactQueryKeys.achievements.lists(), { filters }] as const,
		details: () => [...reactQueryKeys.achievements.all, "detail"] as const,
		detail: (id: string) =>
			[...reactQueryKeys.achievements.details(), id] as const,
		byUser: (userId: string) =>
			[...reactQueryKeys.achievements.all, "user", userId] as const,
		stats: () => [...reactQueryKeys.achievements.all, "stats"] as const,
	},
} as const;
