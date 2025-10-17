/** @format */

import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
	ArrowLeft,
	Edit,
	Trash2,
	Upload,
	Download,
	X,
	Trophy,
	Calendar,
	User,
	Award,
	FileText,
} from "lucide-react";
import { Button } from "../../../shared/components/Button";
import {
	useAchievement,
	useUpdateAchievement,
	useDeleteAchievement,
	useRemoveCertificateFile,
} from "../../../shared/services/achievementService";
import usePermission from "../../../shared/hooks/usePermission";
import Permissions from "../../../shared/config/Permissions";
import { Achievement } from "../../../shared/types/Achievement";
import { achievementTypes } from "../../../shared/schemas/AchievementSchema";
import AchievementForm from "../../../shared/components/Form/AchievementForm";
import Modal from "../../../shared/components/Modal";
import { toastService } from "../../../shared/services/toastService";
import { useTheme } from "../../../shared/contexts/ThemeContext";

const AchievementDetail: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const { theme } = useTheme();
	const [showEditModal, setShowEditModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	// Permissions
	const { hasPermission } = usePermission();
	const canEditAchievement = hasPermission(Permissions.EditAchievement);
	const canDeleteAchievement = hasPermission(Permissions.DeleteAchievement);
	const canViewAchievement = hasPermission(Permissions.ViewAchievement);

	// Data fetching
	const { data: achievement, isLoading, error } = useAchievement(id!);
	const updateAchievement = useUpdateAchievement();
	const deleteAchievement = useDeleteAchievement();
	const removeCertificateFile = useRemoveCertificateFile();

	// Debug logging
	console.log("AchievementDetail - ID:", id);
	console.log("AchievementDetail - Achievement data:", achievement);
	console.log("AchievementDetail - Loading:", isLoading);
	console.log("AchievementDetail - Error:", error);
	console.log("AchievementDetail - Permissions:", {
		canViewAchievement,
		canEditAchievement,
		canDeleteAchievement,
	});

	const handleUpdateAchievement = (data: any) => {
		if (id) {
			updateAchievement.mutate(
				{ id, data },
				{
					onSuccess: () => {
						setShowEditModal(false);
					},
				}
			);
		}
	};

	const handleDeleteAchievement = () => {
		if (id) {
			deleteAchievement.mutate(id, {
				onSuccess: () => {
					navigate("/dashboard/achievements");
				},
			});
		}
	};

	const handleFileRemove = (fileType: "certificate", fileIndex: number) => {
		if (!id) return;

		if (fileType === "certificate") {
			removeCertificateFile.mutate({ id, fileIndex });
		}
	};

	const getAchievementTypeColor = (type: string) => {
		const colors: Record<string, string> = {
			leadership:
				"bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
			innovation:
				"bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
			excellence:
				"bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
			teamwork:
				"bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
			research:
				"bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
			community_service:
				"bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
			academic: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
			sports:
				"bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
			arts: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
			technology:
				"bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
		};
		return (
			colors[type] ||
			"bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
		);
	};

	if (!canViewAchievement) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<div className='text-center'>
					<Trophy
						className={`mx-auto h-12 w-12 transition-colors duration-300 ${
							theme === "dark" ? "text-gray-500" : "text-gray-400"
						}`}
					/>
					<h3
						className={`mt-2 text-sm font-medium transition-colors duration-300 ${
							theme === "dark" ? "text-white" : "text-gray-900"
						}`}>
						Access Denied
					</h3>
					<p
						className={`mt-1 text-sm transition-colors duration-300 ${
							theme === "dark" ? "text-gray-400" : "text-gray-500"
						}`}>
						You don't have permission to view this achievement.
					</p>
				</div>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<div className='text-center'>
					<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4'></div>
					<h3
						className={`text-lg font-medium mb-2 transition-colors duration-300 ${
							theme === "dark" ? "text-white" : "text-gray-900"
						}`}>
						Loading Achievement...
					</h3>
					<p
						className={`transition-colors duration-300 ${
							theme === "dark" ? "text-gray-400" : "text-gray-500"
						}`}>
						Please wait while we fetch the achievement details.
					</p>
				</div>
			</div>
		);
	}

	if (error || !achievement) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<div className='text-center'>
					<Trophy
						className={`mx-auto h-12 w-12 mb-4 transition-colors duration-300 ${
							theme === "dark" ? "text-gray-500" : "text-gray-400"
						}`}
					/>
					<h3
						className={`text-lg font-medium mb-2 transition-colors duration-300 ${
							theme === "dark" ? "text-white" : "text-gray-900"
						}`}>
						{error ? "Error Loading Achievement" : "Achievement not found"}
					</h3>
					<p
						className={`mb-4 transition-colors duration-300 ${
							theme === "dark" ? "text-gray-400" : "text-gray-500"
						}`}>
						{error
							? "There was an error loading the achievement. Please try again."
							: "The achievement you're looking for doesn't exist or may have been removed."}
					</p>
					{error && (
						<div
							className={`border rounded-md p-3 mb-4 transition-all duration-300 ${
								theme === "dark"
									? "bg-red-900/20 border-red-800"
									: "bg-red-50 border-red-200"
							}`}>
							<p
								className={`text-sm transition-colors duration-300 ${
									theme === "dark" ? "text-red-400" : "text-red-600"
								}`}>
								Error:{" "}
								{error instanceof Error
									? error.message
									: "Unknown error occurred"}
							</p>
						</div>
					)}
					<Button
						onClick={() => navigate("/dashboard/achievements")}
						className='mt-4'>
						Back to Achievements
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div
			className={`min-h-screen transition-all duration-300 ${
				theme === "dark" ? "bg-black text-white" : "bg-gray-50 text-black"
			}`}
			style={{
				backgroundImage: `
				linear-gradient(${
					theme === "dark" ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.05)"
				} 1px, transparent 1px),
				linear-gradient(90deg, ${
					theme === "dark" ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.05)"
				} 1px, transparent 1px)
			`,
				backgroundSize: "24px 24px",
				backgroundAttachment: "fixed",
			}}>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				{/* Header */}
				<div className='mb-8'>
					<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
						<div className='flex items-center space-x-4'>
							<Button
								onClick={() => navigate("/dashboard/achievements")}
								variant='outline'
								className='flex items-center space-x-2'>
								<ArrowLeft className='h-4 w-4' />
								<span>Back</span>
							</Button>
							<div className='flex-1 min-w-0'>
								<h1
									className={`text-2xl sm:text-3xl font-bold flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 transition-colors duration-300 ${
										theme === "dark" ? "text-white" : "text-gray-900"
									}`}>
									<div className='flex items-center'>
										<Trophy className='mr-3 h-6 w-6 sm:h-8 sm:w-8 text-yellow-500' />
										<span className='break-words'>{achievement.title}</span>
									</div>
									<div className='bg-yellow-500 text-white p-2 rounded-full shadow-lg self-start'>
										<Trophy className='h-5 w-5 sm:h-6 sm:w-6' />
									</div>
								</h1>
								<p
									className={`mt-2 transition-colors duration-300 ${
										theme === "dark" ? "text-gray-400" : "text-gray-600"
									}`}>
									Achievement Details
								</p>
							</div>
						</div>
						<div className='flex items-center space-x-3 self-start sm:self-auto'>
							{canEditAchievement && (
								<Button
									onClick={() => setShowEditModal(true)}
									variant='outline'
									className='flex items-center space-x-2'>
									<Edit className='h-4 w-4' />
									<span>Edit</span>
								</Button>
							)}
							{canDeleteAchievement && (
								<Button
									onClick={() => setShowDeleteModal(true)}
									variant='outline'
									className='flex items-center space-x-2 text-red-600 hover:text-red-700'>
									<Trash2 className='h-4 w-4' />
									<span>Delete</span>
								</Button>
							)}
						</div>
					</div>
				</div>

				<div className='grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8'>
					{/* Main Content */}
					<div className='xl:col-span-2 space-y-6'>
						{/* Achievement Info */}
						<div
							className={`rounded-lg shadow-lg p-4 sm:p-6 transition-all duration-300 ${
								theme === "dark"
									? "bg-gray-800/30 backdrop-blur-xl border border-gray-700/50"
									: "bg-white/40 backdrop-blur-xl border border-gray-200/60"
							}`}>
							<div className='flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6'>
								<div className='relative flex-shrink-0'>
									<div className='w-16 h-16 sm:w-20 sm:h-20 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center'>
										<Trophy className='w-8 h-8 sm:w-10 sm:h-10 text-yellow-600 dark:text-yellow-400' />
									</div>
									{achievement.isVerified && (
										<div className='absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-green-500 text-white rounded-full p-1'>
											<svg
												className='w-3 h-3 sm:w-4 sm:h-4'
												fill='currentColor'
												viewBox='0 0 20 20'>
												<path
													fillRule='evenodd'
													d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
													clipRule='evenodd'
												/>
											</svg>
										</div>
									)}
								</div>
								<div className='flex-1 min-w-0'>
									<div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4'>
										<h2
											className={`text-xl sm:text-2xl font-bold transition-colors duration-300 ${
												theme === "dark" ? "text-white" : "text-gray-900"
											}`}>
											{achievement.title}
										</h2>
										<div className='flex items-center gap-2'>
											<div className='bg-yellow-500 text-white p-1.5 sm:p-2 rounded-full shadow-lg'>
												<Trophy className='h-4 w-4 sm:h-5 sm:w-5' />
											</div>
											{achievement.isVerified && (
												<div className='bg-green-500 text-white p-1.5 sm:p-2 rounded-full shadow-lg'>
													<svg
														className='h-4 w-4 sm:h-5 sm:w-5'
														fill='currentColor'
														viewBox='0 0 20 20'>
														<path
															fillRule='evenodd'
															d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
															clipRule='evenodd'
														/>
													</svg>
												</div>
											)}
										</div>
									</div>
									<p
										className={`mb-4 text-base sm:text-lg leading-relaxed transition-colors duration-300 ${
											theme === "dark" ? "text-gray-300" : "text-gray-600"
										}`}>
										{achievement.description}
									</p>
									<div className='flex flex-wrap items-center gap-2 sm:gap-3'>
										<span
											className={`inline-flex px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold rounded-full ${getAchievementTypeColor(
												achievement.achievementType
											)}`}>
											{achievement.achievementType.replace("_", " ")}
										</span>
										{achievement.isVerified && (
											<span
												className={`inline-flex px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold rounded-full transition-all duration-300 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300`}>
												✓ Verified
											</span>
										)}
										<span
											className={`inline-flex items-center px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-full transition-all duration-300 ${
												theme === "dark"
													? "text-gray-300 bg-gray-700/50"
													: "text-gray-600 bg-gray-100"
											}`}>
											<Calendar className='w-3 h-3 sm:w-4 sm:h-4 mr-1' />
											Awarded{" "}
											{new Date(achievement.dateAwarded).toLocaleDateString()}
										</span>
									</div>
								</div>
							</div>
						</div>

						{/* Files Section */}
						{achievement.certificateFile ? (
							<div
								className={`rounded-lg shadow-lg p-4 sm:p-6 transition-all duration-300 ${
									theme === "dark"
										? "bg-gray-800/30 backdrop-blur-xl border border-gray-700/50"
										: "bg-white/40 backdrop-blur-xl border border-gray-200/60"
								}`}>
								<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4'>
									<h3
										className={`text-lg font-medium flex items-center transition-colors duration-300 ${
											theme === "dark" ? "text-white" : "text-gray-900"
										}`}>
										<Award className='h-5 w-5 mr-2 text-yellow-500' />
										Certificate
									</h3>
									{canEditAchievement && (
										<Button
											onClick={() => handleFileRemove("certificate", 0)}
											variant='outline'
											size='sm'
											className='text-red-600 hover:text-red-700 self-start sm:self-auto'>
											<X className='h-4 w-4 mr-2' />
											Remove
										</Button>
									)}
								</div>
								<div
									className={`p-3 sm:p-4 border rounded-md transition-all duration-300 ${
										theme === "dark"
											? "bg-yellow-900/20 border-yellow-800"
											: "bg-yellow-50 border-yellow-200"
									}`}>
									<div className='flex flex-col sm:flex-row sm:items-center gap-3'>
										<FileText className='h-6 w-6 text-yellow-500 flex-shrink-0' />
										<div className='flex-1 min-w-0'>
											<p
												className={`text-sm font-medium transition-colors duration-300 ${
													theme === "dark" ? "text-white" : "text-gray-900"
												}`}>
												{achievement.certificateFile.fileName}
											</p>
											{achievement.certificateFile.description && (
												<p
													className={`text-xs mt-1 transition-colors duration-300 ${
														theme === "dark" ? "text-gray-400" : "text-gray-500"
													}`}>
													{achievement.certificateFile.description}
												</p>
											)}
											<p
												className={`text-xs mt-1 transition-colors duration-300 ${
													theme === "dark" ? "text-gray-500" : "text-gray-400"
												}`}>
												Uploaded{" "}
												{new Date(
													achievement.certificateFile.uploadedAt
												).toLocaleDateString()}
											</p>
										</div>
										<a
											href={achievement.certificateFile.fileUrl}
											download
											className={`p-2 text-yellow-500 hover:text-yellow-600 dark:hover:text-yellow-400 rounded-md transition-all duration-300 self-start ${
												theme === "dark"
													? "bg-yellow-900/30 hover:bg-yellow-900/50"
													: "bg-yellow-100 hover:bg-yellow-200"
											}`}>
											<Download className='h-4 w-4' />
										</a>
									</div>
								</div>
							</div>
						) : (
							<div
								className={`rounded-lg shadow-lg p-4 sm:p-6 transition-all duration-300 ${
									theme === "dark"
										? "bg-gray-800/30 backdrop-blur-xl border border-gray-700/50"
										: "bg-white/40 backdrop-blur-xl border border-gray-200/60"
								}`}>
								<div className='flex items-center justify-between mb-4'>
									<h3
										className={`text-lg font-medium flex items-center transition-colors duration-300 ${
											theme === "dark" ? "text-white" : "text-gray-900"
										}`}>
										<Award className='h-5 w-5 mr-2 text-yellow-500' />
										Certificate
									</h3>
								</div>
								<div className='text-center py-8'>
									<Award
										className={`mx-auto h-12 w-12 mb-3 transition-colors duration-300 ${
											theme === "dark" ? "text-gray-500" : "text-gray-400"
										}`}
									/>
									<p
										className={`text-sm mb-2 transition-colors duration-300 ${
											theme === "dark" ? "text-gray-400" : "text-gray-500"
										}`}>
										No certificate uploaded yet.
									</p>
									{canEditAchievement && (
										<p
											className={`text-xs transition-colors duration-300 ${
												theme === "dark" ? "text-gray-500" : "text-gray-400"
											}`}>
											Click the upload button above to add a certificate.
										</p>
									)}
								</div>
							</div>
						)}
					</div>

					{/* Sidebar */}
					<div className='space-y-6'>
						{/* User Info */}
						<div
							className={`rounded-lg shadow-lg p-4 sm:p-6 transition-all duration-300 ${
								theme === "dark"
									? "bg-gray-800/30 backdrop-blur-xl border border-gray-700/50"
									: "bg-white/40 backdrop-blur-xl border border-gray-200/60"
							}`}>
							<h3
								className={`text-lg font-medium mb-4 flex items-center transition-colors duration-300 ${
									theme === "dark" ? "text-white" : "text-gray-900"
								}`}>
								<User className='h-5 w-5 mr-2 text-blue-500' />
								Awarded To
							</h3>
							{typeof achievement.user === "object" ? (
								<div className='text-center'>
									<div className='relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4'>
										<img
											src={
												achievement.user.profilePicture ||
												"https://via.placeholder.com/80x80?text=👤"
											}
											alt={`${achievement.user.firstName} ${achievement.user.lastName}`}
											className={`w-full h-full rounded-full object-cover border-2 transition-all duration-300 ${
												theme === "dark" ? "border-gray-600" : "border-gray-200"
											}`}
										/>
										<div className='absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-1'>
											<Award className='w-3 h-3' />
										</div>
									</div>
									<h4
										className={`font-semibold text-base sm:text-lg mb-1 transition-colors duration-300 ${
											theme === "dark" ? "text-white" : "text-gray-900"
										}`}>
										{achievement.user.firstName} {achievement.user.lastName}
									</h4>
									<p
										className={`text-xs sm:text-sm mb-2 transition-colors duration-300 ${
											theme === "dark" ? "text-gray-400" : "text-gray-500"
										}`}>
										{achievement.user.email}
									</p>
									{achievement.user.role && (
										<span className='inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full'>
											{typeof achievement.user.role === "string"
												? achievement.user.role
												: achievement.user.role.key || "Unknown Role"}
										</span>
									)}
								</div>
							) : (
								<div className='text-center py-4'>
									<User
										className={`mx-auto h-12 w-12 mb-3 transition-colors duration-300 ${
											theme === "dark" ? "text-gray-500" : "text-gray-400"
										}`}
									/>
									<p
										className={`transition-colors duration-300 ${
											theme === "dark" ? "text-gray-400" : "text-gray-500"
										}`}>
										User information not available
									</p>
								</div>
							)}
						</div>

						{/* Achievement Details */}
						<div
							className={`rounded-lg shadow-lg p-4 sm:p-6 transition-all duration-300 ${
								theme === "dark"
									? "bg-gray-800/30 backdrop-blur-xl border border-gray-700/50"
									: "bg-white/40 backdrop-blur-xl border border-gray-200/60"
							}`}>
							<h3
								className={`text-lg font-medium mb-4 flex items-center transition-colors duration-300 ${
									theme === "dark" ? "text-white" : "text-gray-900"
								}`}>
								<Award className='h-5 w-5 mr-2' />
								Details
							</h3>
							<div className='space-y-3'>
								<div className='flex items-center justify-between'>
									<span
										className={`text-xs sm:text-sm transition-colors duration-300 ${
											theme === "dark" ? "text-gray-400" : "text-gray-500"
										}`}>
										Date Awarded
									</span>
									<span
										className={`text-xs sm:text-sm font-medium transition-colors duration-300 ${
											theme === "dark" ? "text-white" : "text-gray-900"
										}`}>
										{new Date(achievement.dateAwarded).toLocaleDateString()}
									</span>
								</div>
								<div className='flex items-center justify-between'>
									<span
										className={`text-xs sm:text-sm transition-colors duration-300 ${
											theme === "dark" ? "text-gray-400" : "text-gray-500"
										}`}>
										Created
									</span>
									<span
										className={`text-xs sm:text-sm font-medium transition-colors duration-300 ${
											theme === "dark" ? "text-white" : "text-gray-900"
										}`}>
										{new Date(achievement.createdAt).toLocaleDateString()}
									</span>
								</div>
								<div className='flex items-center justify-between'>
									<span
										className={`text-xs sm:text-sm transition-colors duration-300 ${
											theme === "dark" ? "text-gray-400" : "text-gray-500"
										}`}>
										Last Updated
									</span>
									<span
										className={`text-xs sm:text-sm font-medium transition-colors duration-300 ${
											theme === "dark" ? "text-white" : "text-gray-900"
										}`}>
										{new Date(achievement.updatedAt).toLocaleDateString()}
									</span>
								</div>
								{achievement.verifiedAt && (
									<div className='flex items-center justify-between'>
										<span
											className={`text-xs sm:text-sm transition-colors duration-300 ${
												theme === "dark" ? "text-gray-400" : "text-gray-500"
											}`}>
											Verified
										</span>
										<span
											className={`text-xs sm:text-sm font-medium transition-colors duration-300 ${
												theme === "dark" ? "text-white" : "text-gray-900"
											}`}>
											{new Date(achievement.verifiedAt).toLocaleDateString()}
										</span>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Edit Modal */}
			<Modal
				isOpen={showEditModal}
				onClose={() => setShowEditModal(false)}
				title='Edit Achievement'
				size='lg'>
				<AchievementForm
					mode='edit'
					initialData={{
						title: achievement.title,
						description: achievement.description,
						achievementType: achievement.achievementType,
					}}
					onSubmit={handleUpdateAchievement}
					onCancel={() => setShowEditModal(false)}
					isLoading={updateAchievement.isPending}
				/>
			</Modal>

			{/* Delete Confirmation Modal */}
			<Modal
				isOpen={showDeleteModal}
				onClose={() => setShowDeleteModal(false)}
				title='Delete Achievement'
				size='md'>
				<div className='text-center'>
					<Trophy className='mx-auto h-12 w-12 text-red-500 mb-4' />
					<h3
						className={`text-lg font-medium mb-2 transition-colors duration-300 ${
							theme === "dark" ? "text-white" : "text-gray-900"
						}`}>
						Delete Achievement
					</h3>
					<p
						className={`mb-6 transition-colors duration-300 ${
							theme === "dark" ? "text-gray-400" : "text-gray-500"
						}`}>
						Are you sure you want to delete "{achievement.title}"? This action
						cannot be undone.
					</p>
					<div className='flex justify-center space-x-3'>
						<Button onClick={() => setShowDeleteModal(false)} variant='outline'>
							Cancel
						</Button>
						<Button
							onClick={handleDeleteAchievement}
							className='bg-red-600 hover:bg-red-700'
							disabled={deleteAchievement.isPending}>
							{deleteAchievement.isPending ? "Deleting..." : "Delete"}
						</Button>
					</div>
				</div>
			</Modal>
		</div>
	);
};

export default AchievementDetail;
