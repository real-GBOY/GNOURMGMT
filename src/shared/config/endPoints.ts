/** @format */

const endPoints = {
	auth: {
		login: "/auth/login",
		register: "/auth/signup",
		profile: "/auth/profile",
		profileById: (id: string) => `/auth/profile/${id}`,
		changePassword: "/auth/profile/password",
	},

	users: {
		base: "/users",
		user: (id: string) => `/users/${id}`,
		unverified: "/users/unverified",
		verify: (id: string) => `/users/verify/${id}`,
		assignRole: (id: string) => `/users/assign-role/${id}`,
	},

	roles: {
		base: "/roles",
	},

	teams: {
		base: "/teams",
		team: (id: string) => `/teams/${id}`,
		members: (id: string) => `/teams/${id}/members`,
	},

	tasks: {
		base: "/tasks",
		task: (id: string) => `/tasks/${id}`,
		assign: (id: string) => `/tasks/${id}/assign`,
		uploadFile: (id: string) => `/tasks/${id}/upload-file`,
		removeFile: (id: string, fileId: string) => `/tasks/${id}/files/${fileId}`,
	},

	events: {
		base: "/events",
		event: (id: string) => `/events/${id}`,
		uploadFile: (id: string) => `/events/${id}/upload-file`,
		removeFile: (id: string) => `/events/${id}/file`,
		addGuests: (id: string) => `/events/${id}/guests`,
		removeGuests: (id: string) => `/events/${id}/guests`,
	},

	attendance: {
		base: "/attendance",
		byId: (id: string) => `/attendance/${id}`,
		byUser: (userId: string) => `/attendance/user/${userId}`,
		byEvent: (eventId: string) => `/attendance/event/${eventId}`,
		byUserAndEvent: (userId: string, eventId: string) =>
			`/attendance/user/${userId}/event/${eventId}`,
		verify: (id: string) => `/attendance/${id}/verify`,
		addFeedback: (id: string) => `/attendance/${id}/feedback`,
	},

	feedback: {
		base: "/feedback",
		byId: (id: string) => `/feedback/${id}`,
		byUser: (userId: string) => `/feedback/user/${userId}`,
		byCategory: (category: string) => `/feedback/category/${category}`,
		byTask: (taskId: string) => `/feedback/task/${taskId}`,
		byMeeting: (eventId: string) => `/feedback/meeting/${eventId}`,
		byAttendance: (attendanceId: string) =>
			`/feedback/attendance/${attendanceId}`,
	},

	achievements: {
		base: "/achievements",
		achievement: (id: string) => `/achievements/${id}`,
		stats: "/achievements/stats",
		byUser: (userId: string) => `/achievements/user/${userId}`,
		assign: "/achievements/assign",
		uploadSupportingDocument: (id: string) =>
			`/achievements/${id}/supporting-document`,
		uploadEvidenceFile: (id: string) => `/achievements/${id}/evidence-file`,
		removeSupportingDocument: (id: string, fileIndex: number) =>
			`/achievements/${id}/file/supporting/${fileIndex}`,
		removeCertificateFile: (id: string, fileIndex: number) =>
			`/achievements/${id}/file/certificate/${fileIndex}`,
		removeEvidenceFile: (id: string, fileIndex: number) =>
			`/achievements/${id}/file/evidence/${fileIndex}`,
	},

	applications: {
		base: "/applications",
		application: (id: string) => `/applications/${id}`,
	},

	applicants: {
		base: "/recruitment/applicants",
		applicant: (id: string) => `/recruitment/applicants/${id}`,
	},
};

export default endPoints;
