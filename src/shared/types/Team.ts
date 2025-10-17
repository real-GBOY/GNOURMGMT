/** @format */

export interface TeamMember {
	_id: string;
	firstName: string;
	lastName: string;
	nationalID: string;
	dateOfBirth: string;
	email: string;
	password: string;
	phoneNumber: string;
	team: string;
	profilePicture: string;
	isActive: boolean;
	isVerified: boolean;
	authType: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
	refreshToken: string;
	role: string;
}

export interface TeamMembersResponse {
	success: boolean;
	data: {
		team: {
			_id: string;
			name: string;
			description: string;
		};
		members: TeamMember[];
	};
}

export interface Team {
	_id: string;
	name: string;
	description: string;
	teamViceHead: string[];
	createdAt: string;
	__v: number;
	members?: TeamMember[];
	id?: string;
}

export interface CreateTeamData {
	name: string;
	description: string;
}

export interface UpdateTeamData {
	name?: string;
	description?: string;
}

export interface TeamResponse {
	data: Team[];
}

export interface SingleTeamResponse {
	data: Team;
}
