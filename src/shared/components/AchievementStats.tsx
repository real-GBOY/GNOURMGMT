/** @format */

import React from "react";
import { Trophy, TrendingUp, Users, Calendar, Award } from "lucide-react";
import { AchievementStats } from "../types/Achievement";

interface AchievementStatsProps {
	stats: AchievementStats;
	isLoading?: boolean;
	className?: string;
}

export const AchievementStats: React.FC<AchievementStatsProps> = ({
	stats,
	isLoading = false,
	className = "",
}) => {
	if (isLoading) {
		return (
			<div className={`achievement-stats ${className}`}>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
					{[...Array(4)].map((_, index) => (
						<div
							key={index}
							className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md animate-pulse'>
							<div className='h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2'></div>
							<div className='h-4 bg-gray-200 dark:bg-gray-700 rounded'></div>
						</div>
					))}
				</div>
			</div>
		);
	}

	const getAchievementTypeColor = (type: string) => {
		const colors: Record<string, string> = {
			best_member_of_the_month: "bg-blue-500",
			best_member_of_the_year: "bg-purple-500",
			dedication: "bg-yellow-500",
		};
		return colors[type] || "bg-yellow-500";
	};

	const getAchievementTypeIcon = (type: string) => {
		const icons: Record<string, string> = {
			best_member_of_the_month: "👑",
			best_member_of_the_year: "🏆",
			dedication: "⭐",
		};
		return icons[type] || "🏆";
	};

	const formatNumber = (num: number) => {
		if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
		if (num >= 1000) return (num / 1000).toFixed(1) + "K";
		return num.toString();
	};

	const getTopAchievers = () => {
		return stats.topAchievers.slice(0, 3);
	};

	return (
		<div className={`achievement-stats ${className}`}>
			{/* Main Stats Cards */}
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
				<div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border-l-4 border-blue-500'>
					<div className='flex items-center justify-between'>
						<div>
							<p className='text-sm font-medium text-gray-600 dark:text-gray-400'>
								Total Achievements
							</p>
							<p className='text-2xl font-bold text-gray-900 dark:text-white'>
								{formatNumber(stats.totalAchievements)}
							</p>
						</div>
						<div className='p-3 bg-blue-100 dark:bg-blue-900 rounded-full'>
							<Trophy className='w-6 h-6 text-blue-600 dark:text-blue-400' />
						</div>
					</div>
				</div>

				<div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border-l-4 border-green-500'>
					<div className='flex items-center justify-between'>
						<div>
							<p className='text-sm font-medium text-gray-600 dark:text-gray-400'>
								Recent Achievements
							</p>
							<p className='text-2xl font-bold text-gray-900 dark:text-white'>
								{formatNumber(stats.recentAchievements)}
							</p>
						</div>
						<div className='p-3 bg-green-100 dark:bg-green-900 rounded-full'>
							<TrendingUp className='w-6 h-6 text-green-600 dark:text-green-400' />
						</div>
					</div>
				</div>

				<div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border-l-4 border-purple-500'>
					<div className='flex items-center justify-between'>
						<div>
							<p className='text-sm font-medium text-gray-600 dark:text-gray-400'>
								Active Achievers
							</p>
							<p className='text-2xl font-bold text-gray-900 dark:text-white'>
								{formatNumber(stats.topAchievers.length)}
							</p>
						</div>
						<div className='p-3 bg-purple-100 dark:bg-purple-900 rounded-full'>
							<Users className='w-6 h-6 text-purple-600 dark:text-purple-400' />
						</div>
					</div>
				</div>

				<div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border-l-4 border-yellow-500'>
					<div className='flex items-center justify-between'>
						<div>
							<p className='text-sm font-medium text-gray-600 dark:text-gray-400'>
								This Month
							</p>
							<p className='text-2xl font-bold text-gray-900 dark:text-white'>
								{formatNumber(stats.recentAchievements)}
							</p>
						</div>
						<div className='p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full'>
							<Calendar className='w-6 h-6 text-yellow-600 dark:text-yellow-400' />
						</div>
					</div>
				</div>
			</div>

			{/* Achievement Types Breakdown */}
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
				<div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md'>
					<h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center'>
						<Award className='w-5 h-5 mr-2 text-blue-600' />
						Achievement Types Breakdown
					</h3>
					<div className='space-y-3'>
						{Object.entries(stats.achievementsByType).map(([type, count]) => (
							<div key={type} className='flex items-center justify-between'>
								<div className='flex items-center space-x-2'>
									<span className='text-lg'>
										{getAchievementTypeIcon(type)}
									</span>
									<span className='text-sm font-medium text-gray-700 dark:text-gray-300 capitalize'>
										{type.replace("_", " ")}
									</span>
								</div>
								<div className='flex items-center space-x-2'>
									<div className='w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
										<div
											className={`h-2 rounded-full ${getAchievementTypeColor(
												type
											)}`}
											style={{
												width: `${(count / stats.totalAchievements) * 100}%`,
											}}></div>
									</div>
									<span className='text-sm font-semibold text-gray-900 dark:text-white min-w-[2rem] text-right'>
										{count}
									</span>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Top Achievers */}
				<div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md'>
					<h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center'>
						<Trophy className='w-5 h-5 mr-2 text-yellow-600' />
						Top Achievers
					</h3>
					<div className='space-y-3'>
						{getTopAchievers().map((achiever, index) => (
							<div
								key={index}
								className='flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg'>
								<div className='flex items-center space-x-3'>
									<div
										className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
											index === 0
												? "bg-yellow-500"
												: index === 1
												? "bg-gray-400"
												: "bg-orange-500"
										}`}>
										{index + 1}
									</div>
									<div>
										<p className='text-sm font-medium text-gray-900 dark:text-white'>
											{typeof achiever.user === "string"
												? achiever.user
												: `${achiever.user.firstName} ${achiever.user.lastName}`}
										</p>
										<p className='text-xs text-gray-500 dark:text-gray-400'>
											{achiever.achievementCount} achievement
											{achiever.achievementCount !== 1 ? "s" : ""}
										</p>
									</div>
								</div>
								<div className='flex items-center space-x-1 text-yellow-600'>
									<Trophy className='w-4 h-4' />
									<span className='text-sm font-semibold'>
										{achiever.achievementCount}
									</span>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};
