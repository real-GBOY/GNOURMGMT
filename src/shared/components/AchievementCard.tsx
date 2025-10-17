/** @format */

import React, { useState } from "react";
import {
	Trophy,
	Calendar,
	User,
	Award,
	FileText,
	Image,
	Download,
	Eye,
	Edit,
	Trash2,
} from "lucide-react";
import { Button } from "./Button";
import { Achievement } from "../types/Achievement";
import { useAuth } from "../contexts/AuthContext";
import usePermission from "../hooks/usePermission";
import Permissions from "../config/Permissions";

interface AchievementCardProps {
	achievement: Achievement;
	onEdit?: (achievement: Achievement) => void;
	onDelete?: (achievementId: string) => void;
	onView?: (achievement: Achievement) => void;
	className?: string;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({
	achievement,
	onEdit,
	onDelete,
	onView,
	className = "",
}) => {
	const { user } = useAuth();
	const { hasPermission } = usePermission();

	const [showFiles, setShowFiles] = useState(false);

	const canEdit = hasPermission(Permissions.EditAchievement);
	const canDelete = hasPermission(Permissions.DeleteAchievement);
	const canView = hasPermission(Permissions.ViewAchievement);

	const getAchievementTypeColor = (type: string) => {
		const colors: Record<string, string> = {
			best_member_of_the_month:
				"bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
			best_member_of_the_year:
				"bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
			dedication:
				"bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
		};
		return colors[type] || colors.dedication;
	};

	const getAchievementTypeIcon = (type: string) => {
		const icons: Record<string, string> = {
			best_member_of_the_month: "👑",
			best_member_of_the_year: "🏆",
			dedication: "⭐",
		};
		return icons[type] || "🏆";
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const getUserName = (user: string | any) => {
		if (typeof user === "string") return user;
		return `${user.firstName} ${user.lastName}`;
	};

	const handleFileDownload = (fileUrl: string, fileName: string) => {
		const link = document.createElement("a");
		link.href = fileUrl;
		link.download = fileName;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const hasFiles = achievement.certificateFile;

	return (
		<div
			className={`achievement-card bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 ${className}`}>
			{/* Header */}
			<div className='p-6 border-b border-gray-200 dark:border-gray-700'>
				<div className='flex items-start justify-between mb-4'>
					<div className='flex items-center space-x-3'>
						<div className='text-3xl'>
							{getAchievementTypeIcon(achievement.achievementType)}
						</div>
						<div>
							<h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
								{achievement.title}
							</h3>
							<span
								className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getAchievementTypeColor(
									achievement.achievementType
								)}`}>
								{achievement.achievementType
									.replace("_", " ")
									.replace(/\b\w/g, (l) => l.toUpperCase())}
							</span>
						</div>
					</div>
				</div>

				<p className='text-gray-600 dark:text-gray-300 text-sm leading-relaxed'>
					{achievement.description}
				</p>
			</div>

			{/* Details */}
			<div className='p-6 space-y-3'>
				<div className='flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400'>
					<Calendar className='w-4 h-4' />
					<span>Awarded: {formatDate(achievement.dateAwarded)}</span>
				</div>

				<div className='flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400'>
					<User className='w-4 h-4' />
					<span>Awarded to: {getUserName(achievement.user)}</span>
				</div>

				{achievement.awardedBy && (
					<div className='flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400'>
						<Award className='w-4 h-4' />
						<span>Awarded by: {getUserName(achievement.awardedBy)}</span>
					</div>
				)}
			</div>

			{/* Files Section */}
			{hasFiles && (
				<div className='px-6 pb-4'>
					<button
						onClick={() => setShowFiles(!showFiles)}
						className='flex items-center space-x-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors'>
						<span>{showFiles ? "Hide" : "Show"} Files</span>
						<span className='text-xs'>
							({achievement.certificateFile ? 1 : 0})
						</span>
					</button>

					{showFiles && (
						<div className='mt-3 space-y-2'>
							{achievement.certificateFile && (
								<div className='flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded'>
									<div className='flex items-center space-x-2'>
										<FileText className='w-4 h-4 text-blue-600' />
										<span className='text-sm text-gray-700 dark:text-gray-300'>
											Certificate: {achievement.certificateFile.fileName}
										</span>
									</div>
									<Button
										variant='ghost'
										size='sm'
										onClick={() =>
											handleFileDownload(
												achievement.certificateFile!.fileUrl,
												achievement.certificateFile!.fileName
											)
										}>
										<Download className='w-4 h-4' />
									</Button>
								</div>
							)}
						</div>
					)}
				</div>
			)}

			{/* Actions */}
			<div className='px-6 py-4 border-t border-gray-200 dark:border-gray-700'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center space-x-2'>
						{onView && canView && (
							<Button
								variant='outline'
								size='sm'
								onClick={() => onView(achievement)}
								className='flex items-center space-x-1'>
								<Eye className='w-4 h-4' />
								<span>View</span>
							</Button>
						)}
					</div>

					<div className='flex items-center space-x-2'>
						{onEdit && canEdit && (
							<Button
								variant='outline'
								size='sm'
								onClick={() => onEdit(achievement)}
								className='flex items-center space-x-1'>
								<Edit className='w-4 h-4' />
								<span>Edit</span>
							</Button>
						)}

						{onDelete && canDelete && (
							<Button
								variant='outline'
								size='sm'
								onClick={() => onDelete(achievement._id)}
								className='flex items-center space-x-1 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20'>
								<Trash2 className='w-4 h-4' />
								<span>Delete</span>
							</Button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};
