/** @format */

const endPoints = {
	login: "/auth/login",
	register: "/auth/signup",
	teams: "/teams",
	team: (id: string) => `/teams/${id}`,
	teamMembers: (id: string) => `/teams/${id}/members`,
	tasks: "/tasks",
	task: (id: string) => `/tasks/${id}`,
	uploadFile: (id: string) => `/tasks/${id}/upload-file`,
	removeFile: (id: string, fileId: string) => `/tasks/${id}/files/${fileId}`,
	taskAssignment: (id: string) => `/tasks/${id}/assign`,
	events: "/events",
	event: (id: string) => `/events/${id}`,
	uploadEventFile: (id: string) => `/events/${id}/upload-file`,
	removeEventFile: (id: string) => `/events/${id}/file`,
	users: "/users",
	user: (id: string) => `/users/${id}`,
	unverifiedUsers: "/users/unverified",
	verifyUser: (id: string) => `/users/verify/${id}`,
	assignRole: (id: string) => `/users/assign-role/${id}`,
	profile: "/auth/profile",
	profileById: (id: string) => `/auth/profile/${id}`,
	changePassword: "/auth/profile/password",
	roles: "/roles",
	attendance: "/attendance",
	attendanceById: (id: string) => `/attendance/${id}`,
	attendanceByUser: (userId: string) => `/attendance/user/${userId}`,
	attendanceByEvent: (eventId: string) => `/attendance/event/${eventId}`,
	attendanceByUserAndEvent: (userId: string, eventId: string) =>
		`/attendance/user/${userId}/event/${eventId}`,
	verifyAttendance: (id: string) => {
		console.log("Constructing verify attendance endpoint with ID:", id);
		const endpoint = `/attendance/${id}/verify`;
		console.log("Constructed endpoint:", endpoint);
		return endpoint;
	},
	addFeedback: (id: string) => `/attendance/${id}/feedback`,
	addGuestsToEvent: (id: string) => `/events/${id}/guests`,
	removeGuestsFromEvent: (id: string) => `/events/${id}/guests`,

	// Feedback endpoints
	feedback: "/feedback",
	feedbackById: (id: string) => `/feedback/${id}`,
	feedbackByUser: (userId: string) => `/feedback/user/${userId}`,
	feedbackByCategory: (category: string) => `/feedback/category/${category}`,
	feedbackByTask: (taskId: string) => `/feedback/task/${taskId}`,
	feedbackByMeeting: (eventId: string) => `/feedback/meeting/${eventId}`,
	feedbackByAttendance: (attendanceId: string) =>
		`/feedback/attendance/${attendanceId}`,

	// Achievement endpoints
	achievements: "/achievements",
	achievement: (id: string) => `/achievements/${id}`,
	achievementStats: "/achievements/stats",
	achievementByUser: (userId: string) => `/achievements/user/${userId}`,
	assignAchievement: "/achievements/assign",

	uploadSupportingDocument: (id: string) =>
		`/achievements/${id}/supporting-document`,
	uploadEvidenceFile: (id: string) => `/achievements/${id}/evidence-file`,
	removeSupportingDocument: (id: string, fileIndex: number) =>
		`/achievements/${id}/file/supporting/${fileIndex}`,
	removeCertificateFile: (id: string, fileIndex: number) =>
		`/achievements/${id}/file/certificate/${fileIndex}`,
	removeEvidenceFile: (id: string, fileIndex: number) =>
		`/achievements/${id}/file/evidence/${fileIndex}`,

	// Applications endpoints
	applications: "/applications",
	application: (id: string) => `/applications/${id}`,

	// Applicants endpoints (align with backend router)
	applicants: "/recruitment/applicants",
	applicant: (id: string) => `/recruitment/applicants/${id}`,
};

export default endPoints;
