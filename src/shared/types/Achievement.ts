/** @format */

import { User } from "./User";

export type AchievementType =
	| "best_member_of_the_month"
	| "best_member_of_the_year"
	| "dedication";

export interface AchievementFile {
	_id: string;
	fileUrl: string;
	fileName: string;
	fileType: "certificate" | "supporting" | "evidence";
	description?: string;
	uploadedBy?: string;
	uploadedAt: string;
}

export interface Achievement {
	_id: string;
	title: string;
	description: string;
	achievementType: AchievementType;
	user: string | User;
	certificateFile?: AchievementFile;
	dateAwarded: string;
	awardedBy: string | User;
	createdAt: string;
	updatedAt: string;
	__v: number;
}

export interface CreateAchievementData {
	title: string;
	description: string;
	achievementType: AchievementType;
	userId: string;
	certificateFile?: File;
}

export interface UpdateAchievementData {
	title?: string;
	description?: string;
	achievementType?: AchievementType;
}

export interface AssignAchievementData {
	title: string;
	description: string;
	achievementType: AchievementType;
	userId: string;
}

export interface AchievementStats {
	totalAchievements: number;
	achievementsByType: Record<AchievementType, number>;
	recentAchievements: number;
	topAchievers: Array<{
		user: string | User;
		achievementCount: number;
	}>;
}

export interface AchievementsResponse {
	success: boolean;
	data: Achievement[];
	pagination?: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
}

export interface AchievementResponse {
	success: boolean;
	data: Achievement;
}

export interface AchievementStatsResponse {
	success: boolean;
	data: AchievementStats;
}
