/** @format */

import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
	Plus,
	Search,
	Trophy,
	Calendar,
	Award,
	AlertCircle,
	RefreshCw,
	X,
	Users,
	Eye,
	EyeOff,
} from "lucide-react";
import { Button } from "../../shared/components/Button";
import {
	useAchievements,
	useAchievementStats,
	useCreateAchievement,
	useCreateAchievementWithFile,
} from "../../shared/services/achievementService";
import { useUsers } from "../../shared/services/userService";
import usePermission from "../../shared/hooks/usePermission";
import Permissions from "../../shared/config/Permissions";
import { useAuth } from "../../shared/contexts/AuthContext";
import {
	Achievement,
	AchievementType,
	CreateAchievementData,
} from "../../shared/types/Achievement";
import { ApiError } from "../../shared/types";
import {
	achievementTypes,
	createAchievementYupSchema,
} from "../../shared/schemas/AchievementSchema";
import { GenericForm } from "../../shared/components/Form/GenericForm";
import Modal from "../../shared/components/Modal";
import { useTheme } from "../../shared/contexts/ThemeContext";

const Achievements: React.FC = () => {
	const navigate = useNavigate();
	const { theme } = useTheme();
	const { user: currentUser } = useAuth();
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedType, setSelectedType] = useState<AchievementType | "">("");
	const [sortBy, setSortBy] = useState<"createdAt" | "title" | "type">(
		"createdAt"
	);
	const [sortOrder] = useState<"asc" | "desc">("desc");

	// Permissions
	const { hasPermission } = usePermission();
	const canCreateAchievement = hasPermission(Permissions.CreateAchievement);
	const canViewAchievement = hasPermission(Permissions.ViewAchievement);

	// Data fetching
	const {
		data: achievements = [],
		isLoading,
		error,
		refetch,
	} = useAchievements();
	const { data: stats, isLoading: statsLoading } = useAchievementStats();
	const { data: users = [] } = useUsers();

	// Mutations
	const createAchievement = useCreateAchievement();
	const createAchievementWithFile = useCreateAchievementWithFile();

	// Loading state for creation
	const isCreating =
		createAchievement.isPending || createAchievementWithFile.isPending;

	// Role-based achievement filtering
	const filteredAchievementsByRole = useMemo(() => {
		if (!currentUser || !achievements.length) return [];

		const userRole = currentUser.role?.key;

		// President can see all achievements
		if (userRole === "President") {
			return achievements;
		}

		// Head and ViceHead can see achievements they awarded + their own
		if (userRole === "Head" || userRole === "ViceHead") {
			return achievements.filter(
				(achievement) =>
					achievement.awardedBy === currentUser.id ||
					achievement.user === currentUser.id ||
					(achievement.user &&
						typeof achievement.user === "object" &&
						achievement.user._id === currentUser.id)
			);
		}

		// Member and HrMember can only see their own achievements + achievements they awarded
		if (userRole === "Member" || userRole === "HrMember") {
			return achievements.filter(
				(achievement) =>
					achievement.user === currentUser.id ||
					(achievement.user &&
						typeof achievement.user === "object" &&
						achievement.user._id === currentUser.id) ||
					achievement.awardedBy === currentUser.id
			);
		}

		// Default: no access
		return [];
	}, [achievements, currentUser]);

	// Filter and sort achievements based on role
	const filteredAchievements = filteredAchievementsByRole
		.filter((achievement) => {
			const matchesSearch =
				achievement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				achievement.description
					.toLowerCase()
					.includes(searchTerm.toLowerCase()) ||
				(achievement.user &&
					typeof achievement.user === "object" &&
					`${achievement.user.firstName} ${achievement.user.lastName}`
						.toLowerCase()
						.includes(searchTerm.toLowerCase()));

			const matchesType =
				selectedType === "" || achievement.achievementType === selectedType;

			return matchesSearch && matchesType;
		})
		.sort((a, b) => {
			let aValue: Date | string | AchievementType | number;
			let bValue: Date | string | AchievementType | number;

			switch (sortBy) {
				case "createdAt":
					aValue = new Date(a.dateAwarded);
					bValue = new Date(b.dateAwarded);
					break;
				case "title":
					aValue = a.title.toLowerCase();
					bValue = b.title.toLowerCase();
					break;
				case "type":
					aValue = a.achievementType;
					bValue = b.achievementType;
					break;

				default:
					return 0;
			}

			if (sortOrder === "asc") {
				return aValue > bValue ? 1 : -1;
			} else {
				return aValue < bValue ? 1 : -1;
			}
		});

	// Get user's role display name
	const getUserRoleDisplay = () => {
		const role = currentUser?.role?.key;
		switch (role) {
			case "President":
				return "President";
			case "Head":
				return "Head";
			case "ViceHead":
				return "Vice Head";
			case "Member":
				return "Member";
			case "HrMember":
				return "HR Member";
			default:
				return "User";
		}
	};

	// Get access level description
	const getAccessLevelDescription = () => {
		const role = currentUser?.role?.key;
		switch (role) {
			case "President":
				return "You have full access to view and manage all achievements in the system.";
			case "Head":
			case "ViceHead":
				return "You can view achievements you awarded and your own achievements.";
			case "Member":
			case "HrMember":
				return "You can only view your own achievements and achievements you awarded to others.";
			default:
				return "You have limited access to achievements.";
		}
	};

	const handleCreateAchievement = async (data: CreateAchievementData) => {
		console.log("Form data received:", data);
		console.log("Certificate file:", data.certificateFile);

		// Check if certificate file is uploaded
		const hasFiles = data.certificateFile;

		console.log("Has files:", hasFiles);

		if (hasFiles) {
			console.log("Processing file upload for achievement");

			// Create FormData for file upload
			const formData = new FormData();

			// Add text fields
			formData.append("title", data.title);
			formData.append("description", data.description);
			formData.append("achievementType", data.achievementType);
			formData.append("userId", data.userId);

			// Add required awardedBy field (current user)
			formData.append("awardedBy", currentUser?.id || "");

			// Add certificate file
			if (data.certificateFile) {
				console.log("Adding certificate file:", data.certificateFile.name);
				formData.append("file", data.certificateFile);
			}

			// Log FormData contents for debugging
			for (let [key, value] of formData.entries()) {
				console.log(`FormData entry: ${key} =`, value);
			}

			console.log("Creating achievement with file upload using FormData");

			// Use the file upload hook for achievements with files
			createAchievementWithFile.mutate(formData, {
				onSuccess: () => {
					console.log("Achievement created successfully with file upload");
					setShowCreateModal(false);
				},
				onError: (error: ApiError) => {
					console.error("Failed to create achievement with file:", error);
				},
			});
		} else {
			// Create achievement without file
			createAchievement.mutate(data, {
				onSuccess: () => {
					console.log("Achievement created successfully without file");
					setShowCreateModal(false);
				},
				onError: (error: ApiError) => {
					console.error("Failed to create achievement:", error);
				},
			});
		}
	};

	const handleAchievementClick = (achievement: Achievement) => {
		navigate(`/dashboard/achievements/${achievement._id}`);
	};

	const getAchievementTypeColor = (type: AchievementType) => {
		const colors: Record<AchievementType, string> = {
			best_member_of_the_month:
				"bg-blue-100/80 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 backdrop-blur-sm",
			best_member_of_the_year:
				"bg-purple-100/80 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 backdrop-blur-sm",
			dedication:
				"bg-yellow-100/80 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400 backdrop-blur-sm",
		};
		return (
			colors[type] ||
			"bg-yellow-100/80 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400 backdrop-blur-sm"
		);
	};

	if (!canViewAchievement) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<div className='text-center'>
					<Trophy className='mx-auto h-12 w-12 text-gray-400' />
					<h3 className='mt-2 text-sm font-medium text-gray-900 dark:text-white'>
						Access Denied
					</h3>
					<p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
						You don't have permission to view achievements.
					</p>
				</div>
			</div>
		);
	}

	return (
		<>
			<div className='space-y-6'>
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}>
					<div className='flex items-center justify-between'>
						<div>
							<h1
								className={`text-3xl font-bold transition-colors duration-300 flex items-center ${
									theme === "dark" ? "text-white" : "text-black"
								}`}>
								<Trophy className='mr-3 h-8 w-8 text-yellow-500 dark:text-yellow-400' />
								Achievements
							</h1>
							<p
								className={`mt-2 text-lg transition-colors duration-300 ${
									theme === "dark" ? "text-gray-400" : "text-gray-600"
								}`}>
								Manage and track user achievements and accomplishments
							</p>
							{/* Role and Access Level Info */}
							<div className='mt-3 flex items-center gap-4'>
								<div className='flex items-center gap-2'>
									<span
										className={`text-sm font-medium transition-colors duration-300 ${
											theme === "dark" ? "text-gray-300" : "text-gray-500"
										}`}>
										Role:
									</span>
									<span
										className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-all duration-300 ${
											theme === "dark"
												? "bg-blue-900/30 text-blue-300 border border-blue-700/50"
												: "bg-blue-100 text-blue-800 border border-blue-200"
										}`}>
										{getUserRoleDisplay()}
									</span>
								</div>
								<div className='flex items-center gap-2'>
									<span
										className={`text-sm font-medium transition-colors duration-300 ${
											theme === "dark" ? "text-gray-300" : "text-gray-500"
										}`}>
										Access:
									</span>
									<span
										className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-all duration-300 ${
											theme === "dark"
												? "bg-green-900/30 text-green-300 border border-green-700/50"
												: "bg-green-100 text-green-800 border border-green-200"
										}`}>
										{currentUser?.role?.key === "President"
											? "Full Access"
											: "Restricted Access"}
									</span>
								</div>
							</div>
							{/* Access Level Description */}
							<p
								className={`mt-2 text-sm transition-colors duration-300 ${
									theme === "dark" ? "text-gray-500" : "text-gray-600"
								}`}>
								{getAccessLevelDescription()}
							</p>
						</div>
						{canCreateAchievement && (
							<Button
								onClick={() => setShowCreateModal(true)}
								disabled={isCreating}
								className='flex items-center space-x-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed'>
								<Plus className='h-4 w-4' />
								<span>{isCreating ? "Creating..." : "Create Achievement"}</span>
							</Button>
						)}
					</div>
				</motion.div>

				{/* Role-Based Access Notice */}
				{currentUser?.role?.key !== "President" && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.1 }}
						className={`p-4 rounded-lg border transition-all duration-300 ${
							theme === "dark"
								? "bg-blue-900/20 border-blue-700/50 text-blue-200"
								: "bg-blue-50 border-blue-200 text-blue-800"
						}`}>
						<div className='flex items-start gap-3'>
							<Eye className='h-5 w-5 mt-0.5 flex-shrink-0' />
							<div>
								<h4 className='font-medium mb-1'>Access Restricted</h4>
								<p className='text-sm'>
									{currentUser?.role?.key === "Head" ||
									currentUser?.role?.key === "ViceHead"
										? "You can only view achievements you awarded and your own achievements."
										: "You can only view your own achievements and achievements you awarded to others."}
								</p>
							</div>
						</div>
					</motion.div>
				)}

				{/* Statistics Cards */}
				{!statsLoading && stats && (
					<motion.div
						className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.1 }}>
						<motion.div
							className={`p-6 rounded-xl border transition-all duration-300 hover:scale-105 ${
								theme === "dark"
									? "bg-gray-900/30 backdrop-blur-2xl border-gray-700/50 shadow-2xl hover:shadow-3xl hover:border-gray-600/70"
									: "bg-white/40 backdrop-blur-2xl border-gray-200/60 shadow-2xl hover:shadow-3xl hover:border-gray-300/80"
							}`}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.1 }}>
							<div className='flex items-center justify-between'>
								<div>
									<p
										className={`text-sm font-medium transition-colors duration-300 ${
											theme === "dark" ? "text-gray-400" : "text-gray-600"
										}`}>
										{currentUser?.role?.key === "President"
											? "Total Achievements"
											: "Your Achievements"}
									</p>
									<p
										className={`text-2xl font-bold mt-1 transition-colors duration-300 ${
											theme === "dark" ? "text-white" : "text-black"
										}`}>
										{currentUser?.role?.key === "President"
											? stats.totalAchievements || 0
											: filteredAchievementsByRole.length}
									</p>
								</div>
								<div
									className={`p-3 rounded-xl transition-all duration-300 ${
										theme === "dark"
											? "bg-yellow-600/30 backdrop-blur-sm"
											: "bg-yellow-50/80 backdrop-blur-sm"
									}`}>
									<Trophy
										size={24}
										className={
											theme === "dark" ? "text-yellow-400" : "text-yellow-600"
										}
									/>
								</div>
							</div>
						</motion.div>

						<motion.div
							className={`p-6 rounded-xl border transition-all duration-300 hover:scale-105 ${
								theme === "dark"
									? "bg-gray-900/30 backdrop-blur-2xl border-gray-700/50 shadow-2xl hover:shadow-3xl hover:border-gray-600/70"
									: "bg-white/40 backdrop-blur-2xl border-gray-200/60 shadow-2xl hover:shadow-3xl hover:border-gray-300/80"
							}`}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.2 }}>
							<div className='flex items-center justify-between'>
								<div>
									<p
										className={`text-sm font-medium transition-colors duration-300 ${
											theme === "dark" ? "text-gray-400" : "text-gray-600"
										}`}>
										{currentUser?.role?.key === "President"
											? "Top Achievers"
											: "Awarded by You"}
									</p>
									<p
										className={`text-2xl font-bold mt-1 transition-colors duration-300 ${
											theme === "dark" ? "text-white" : "text-black"
										}`}>
										{currentUser?.role?.key === "President"
											? stats.topAchievers?.length || 0
											: filteredAchievementsByRole.filter(
													(a) => a.awardedBy === currentUser?.id
											  ).length}
									</p>
								</div>
								<div
									className={`p-3 rounded-xl transition-all duration-300 ${
										theme === "dark"
											? "bg-blue-600/30 backdrop-blur-sm"
											: "bg-blue-50/80 backdrop-blur-sm"
									}`}>
									<Users
										size={24}
										className={
											theme === "dark" ? "text-blue-400" : "text-blue-600"
										}
									/>
								</div>
							</div>
						</motion.div>

						<motion.div
							className={`p-6 rounded-xl border transition-all duration-300 hover:scale-105 ${
								theme === "dark"
									? "bg-gray-900/30 backdrop-blur-2xl border-gray-700/50 shadow-2xl hover:shadow-3xl hover:border-gray-600/70"
									: "bg-white/40 backdrop-blur-2xl border-gray-200/60 shadow-2xl hover:shadow-3xl hover:border-gray-300/80"
							}`}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.3 }}>
							<div className='flex items-center justify-between'>
								<div>
									<p
										className={`text-sm font-medium transition-colors duration-300 ${
											theme === "dark" ? "text-gray-400" : "text-gray-600"
										}`}>
										{currentUser?.role?.key === "President"
											? "Recent Achievements"
											: "Your Recent"}
									</p>
									<p
										className={`text-2xl font-bold mt-1 transition-colors duration-300 ${
											theme === "dark" ? "text-white" : "text-black"
										}`}>
										{currentUser?.role?.key === "President"
											? stats.recentAchievements || 0
											: filteredAchievementsByRole.filter((a) => {
													const achievementDate = new Date(a.dateAwarded);
													const thirtyDaysAgo = new Date();
													thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
													return achievementDate >= thirtyDaysAgo;
											  }).length}
									</p>
								</div>
								<div
									className={`p-3 rounded-xl transition-all duration-300 ${
										theme === "dark"
											? "bg-green-600/30 backdrop-blur-sm"
											: "bg-green-50/80 backdrop-blur-sm"
									}`}>
									<Calendar
										size={24}
										className={
											theme === "dark" ? "text-green-400" : "text-green-600"
										}
									/>
								</div>
							</div>
						</motion.div>

						<motion.div
							className={`p-6 rounded-xl border transition-all duration-300 hover:scale-105 ${
								theme === "dark"
									? "bg-gray-900/30 backdrop-blur-2xl border-gray-700/50 shadow-2xl hover:shadow-3xl hover:border-gray-600/70"
									: "bg-white/40 backdrop-blur-2xl border-gray-200/60 shadow-2xl hover:shadow-3xl hover:border-gray-300/80"
							}`}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.4 }}>
							<div className='flex items-center justify-between'>
								<div>
									<p
										className={`text-sm font-medium transition-colors duration-300 ${
											theme === "dark" ? "text-gray-400" : "text-gray-600"
										}`}>
										{currentUser?.role?.key === "President"
											? "Most Common Type"
											: "Your Top Type"}
									</p>
									<p
										className={`text-lg font-semibold mt-1 transition-colors duration-300 ${
											theme === "dark" ? "text-white" : "text-black"
										}`}>
										{currentUser?.role?.key === "President"
											? stats.achievementsByType &&
											  Object.keys(stats.achievementsByType).length > 0
												? Object.entries(stats.achievementsByType)
														.sort(([, a], [, b]) => (b || 0) - (a || 0))[0]?.[0]
														?.replace("_", " ") || "N/A"
												: "N/A"
											: (() => {
													const userAchievements = filteredAchievementsByRole;
													const typeCounts: Record<string, number> = {};
													userAchievements.forEach((a) => {
														typeCounts[a.achievementType] =
															(typeCounts[a.achievementType] || 0) + 1;
													});
													const topType = Object.entries(typeCounts).sort(
														([, a], [, b]) => (b || 0) - (a || 0)
													)[0]?.[0];
													return topType ? topType.replace("_", " ") : "N/A";
											  })()}
									</p>
								</div>
								<div
									className={`p-3 rounded-xl transition-all duration-300 ${
										theme === "dark"
											? "bg-purple-600/30 backdrop-blur-sm"
											: "bg-purple-50/80 backdrop-blur-sm"
									}`}>
									<Award
										size={24}
										className={
											theme === "dark" ? "text-purple-400" : "text-purple-600"
										}
									/>
								</div>
							</div>
						</motion.div>
					</motion.div>
				)}

				{/* Search and Filters */}
				<div className='mb-6 space-y-4'>
					<div className='flex flex-col sm:flex-row gap-4'>
						{/* Search Input */}
						<div className='flex-1 relative'>
							<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
							<input
								type='text'
								placeholder='Search achievements...'
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className={`w-full pl-10 pr-4 py-2 border rounded-lg transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
									theme === "dark"
										? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
										: "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
								}`}
							/>
						</div>

						{/* Type Filter */}
						<select
							value={selectedType}
							onChange={(e) =>
								setSelectedType(e.target.value as AchievementType | "")
							}
							className={`px-4 py-2 border rounded-lg transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
								theme === "dark"
									? "bg-gray-800 border-gray-700 text-white"
									: "bg-white border-gray-300 text-gray-900"
							}`}>
							<option value=''>All Types</option>
							<option value='best_member_of_the_month'>
								Best Member of the Month
							</option>
							<option value='best_member_of_the_year'>
								Best Member of the Year
							</option>
							<option value='dedication'>Dedication</option>
						</select>

						{/* Sort Options */}
						<select
							value={sortBy}
							onChange={(e) =>
								setSortBy(e.target.value as "createdAt" | "title" | "type")
							}
							className={`px-4 py-2 border rounded-lg transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
								theme === "dark"
									? "bg-gray-800 border-gray-700 text-white"
									: "bg-white border-gray-300 text-gray-900"
							}`}>
							<option value='createdAt'>Date Created</option>
							<option value='title'>Title</option>
							<option value='type'>Type</option>
						</select>
					</div>

					{/* Active Filters Display */}
					{(searchTerm || selectedType) && (
						<div className='flex flex-wrap items-center gap-2'>
							<span className='text-sm text-gray-600 dark:text-gray-400'>
								Active filters:
							</span>
							{searchTerm && (
								<span className='inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-sm rounded-full'>
									Search: "{searchTerm}"
									<button
										onClick={() => setSearchTerm("")}
										className='ml-1 hover:bg-blue-200 dark:hover:bg-blue-800/50 rounded-full p-0.5'>
										<X className='h-3 w-3' />
									</button>
								</span>
							)}
							{selectedType && (
								<span className='inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-sm rounded-full'>
									Type: {selectedType}
									<button
										onClick={() => setSelectedType("")}
										className='ml-1 hover:bg-green-200 dark:hover:bg-green-800/50 rounded-full p-0.5'>
										<X className='h-3 w-3' />
									</button>
								</span>
							)}
							<button
								onClick={() => {
									setSearchTerm("");
									setSelectedType("");
								}}
								className='text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 underline'>
								Clear all filters
							</button>
						</div>
					)}
				</div>

				{/* Achievements List */}
				<motion.div
					className={`p-6 rounded-xl border transition-all duration-300 hover:scale-[1.02] ${
						theme === "dark"
							? "bg-gray-900/30 backdrop-blur-2xl border-gray-700/50 shadow-2xl hover:shadow-3xl hover:border-gray-600/70"
							: "bg-white/40 backdrop-blur-2xl border-gray-200/60 shadow-2xl hover:shadow-3xl hover:border-gray-300/80"
					}`}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.6 }}>
					<div className='flex items-center justify-between mb-6'>
						<div>
							<h3
								className={`text-lg font-semibold transition-colors duration-300 ${
									theme === "dark" ? "text-white" : "text-black"
								}`}>
								{currentUser?.role?.key === "President"
									? "All Achievements"
									: "Your Achievements"}
							</h3>
							<p
								className={`text-sm transition-colors duration-300 ${
									theme === "dark" ? "text-gray-400" : "text-gray-600"
								}`}>
								Showing {filteredAchievements.length} of{" "}
								{filteredAchievementsByRole.length} achievements
								{currentUser?.role?.key !== "President" &&
									` (filtered by your role)`}
							</p>
						</div>
						<Trophy
							size={20}
							className={theme === "dark" ? "text-gray-400" : "text-gray-600"}
						/>
					</div>

					{isLoading ? (
						<div className='flex flex-col items-center justify-center py-12'>
							<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mb-4'></div>
							<p className='text-gray-600 dark:text-gray-400 text-lg font-medium'>
								Loading achievements...
							</p>
						</div>
					) : error ? (
						<div className='flex flex-col items-center justify-center py-12'>
							<div className='h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-4'>
								<AlertCircle className='h-8 w-8 text-red-600 dark:text-red-400' />
							</div>
							<h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
								Failed to load achievements
							</h3>
							<p className='text-gray-600 dark:text-gray-400 text-center mb-4 max-w-md'>
								{error.message ||
									"Something went wrong while loading achievements. Please try again."}
							</p>
							<Button
								onClick={() => refetch()}
								variant='outline'
								className='flex items-center gap-2'>
								<RefreshCw className='h-4 w-4' />
								Try Again
							</Button>
						</div>
					) : filteredAchievements.length === 0 ? (
						<div className='flex flex-col items-center justify-center py-12'>
							<div className='h-16 w-16 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center mb-4'>
								<Trophy className='h-8 w-8 text-yellow-600 dark:text-yellow-400' />
							</div>
							<h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
								{currentUser?.role?.key === "President"
									? "No achievements yet"
									: "No achievements found"}
							</h3>
							<p className='text-gray-600 dark:text-gray-400 text-center mb-4 max-w-md'>
								{currentUser?.role?.key === "President"
									? "Start creating achievements to recognize and celebrate team accomplishments."
									: "You don't have any achievements yet, or there are no achievements matching your current access level."}
							</p>
							{canCreateAchievement && (
								<Button
									onClick={() => setShowCreateModal(true)}
									className='flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white'>
									<Plus className='h-4 w-4' />
									{currentUser?.role?.key === "President"
										? "Create First Achievement"
										: "Create Achievement"}
								</Button>
							)}
						</div>
					) : (
						<div className='overflow-hidden'>
							<table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
								<thead
									className={`transition-colors duration-300 ${
										theme === "dark" ? "bg-gray-800/60" : "bg-gray-50/80"
									}`}>
									<tr>
										<th
											className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300 ${
												theme === "dark" ? "text-gray-300" : "text-gray-500"
											}`}>
											Achievement
										</th>
										<th
											className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300 ${
												theme === "dark" ? "text-gray-300" : "text-gray-500"
											}`}>
											User
										</th>
										<th
											className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300 ${
												theme === "dark" ? "text-gray-300" : "text-gray-500"
											}`}>
											Type
										</th>
										<th
											className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300 ${
												theme === "dark" ? "text-gray-300" : "text-gray-500"
											}`}>
											Date Awarded
										</th>
										<th
											className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300 ${
												theme === "dark" ? "text-gray-300" : "text-gray-500"
											}`}>
											{currentUser?.role?.key === "President"
												? "Status"
												: "Your Relation"}
										</th>
									</tr>
								</thead>
								<tbody
									className={`divide-y transition-colors duration-300 ${
										theme === "dark" ? "divide-gray-700" : "divide-gray-200"
									}`}>
									{filteredAchievements.map((achievement) => (
										<tr
											key={achievement._id}
											onClick={() => handleAchievementClick(achievement)}
											className={`transition-all duration-200 cursor-pointer hover:scale-[1.01] ${
												theme === "dark"
													? "hover:bg-gray-800/60"
													: "hover:bg-gray-50/80"
											}`}>
											<td className='px-6 py-4 whitespace-nowrap'>
												<div className='flex items-center'>
													<div className='h-10 w-10 rounded-full flex items-center justify-center bg-gradient-to-br from-yellow-400 to-orange-500 dark:from-yellow-500 dark:to-orange-600 border-2 border-white dark:border-gray-800 shadow-lg'>
														<Trophy className='h-5 w-5 text-white' />
													</div>
													<div className='ml-4'>
														<div
															className={`text-sm font-medium transition-colors duration-300 ${
																theme === "dark" ? "text-white" : "text-black"
															}`}>
															{achievement.title}
														</div>
														<div
															className={`text-sm transition-colors duration-300 line-clamp-2 ${
																theme === "dark"
																	? "text-gray-400"
																	: "text-gray-600"
															}`}>
															{achievement.description}
														</div>
													</div>
												</div>
											</td>
											<td className='px-6 py-4 whitespace-nowrap'>
												<div
													className={`text-sm transition-colors duration-300 ${
														theme === "dark" ? "text-white" : "text-black"
													}`}>
													{achievement.user &&
													typeof achievement.user === "object"
														? `${achievement.user.firstName} ${achievement.user.lastName}`
														: "Unknown User"}
												</div>
												<div
													className={`text-sm transition-colors duration-300 ${
														theme === "dark" ? "text-gray-400" : "text-gray-600"
													}`}>
													{achievement.user &&
													typeof achievement.user === "object"
														? achievement.user.email
														: ""}
												</div>
											</td>
											<td className='px-6 py-4 whitespace-nowrap'>
												<span
													className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getAchievementTypeColor(
														achievement.achievementType
													)}`}>
													{achievement.achievementType.replace("_", " ")}
												</span>
											</td>
											<td
												className={`px-6 py-4 whitespace-nowrap text-sm transition-colors duration-300 ${
													theme === "dark" ? "text-gray-400" : "text-gray-600"
												}`}>
												{new Date(achievement.dateAwarded).toLocaleDateString()}
											</td>
											<td className='px-6 py-4 whitespace-nowrap'>
												{currentUser?.role?.key === "President" ? (
													<span className='inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'>
														Active
													</span>
												) : (
													<span
														className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
															achievement.user === currentUser?.id ||
															(achievement.user &&
																typeof achievement.user === "object" &&
																achievement.user._id === currentUser?.id)
																? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
																: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200"
														}`}>
														{achievement.user === currentUser?.id ||
														(achievement.user &&
															typeof achievement.user === "object" &&
															achievement.user._id === currentUser?.id)
															? "Your Achievement"
															: "Awarded by You"}
													</span>
												)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</motion.div>
			</div>

			{/* Create Achievement Modal */}
			<Modal
				isOpen={showCreateModal}
				onClose={() => !isCreating && setShowCreateModal(false)}
				title='Create New Achievement'
				size='lg'>
				{isCreating && (
					<div className='mb-4 p-3 bg-blue-100 border border-blue-300 text-blue-700 rounded-lg dark:bg-blue-900/30 dark:border-blue-700/50 dark:text-blue-400'>
						Creating achievement...
					</div>
				)}
				{createAchievement.isSuccess && (
					<div className='mb-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded-lg dark:bg-green-900/30 dark:border-green-700/50 dark:text-green-400'>
						Achievement created successfully!
					</div>
				)}
				{createAchievement.isError && (
					<div className='mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg dark:bg-red-900/30 dark:border-blue-700/50 dark:text-red-400'>
						{createAchievement.error?.response?.data?.message ||
							"Failed to create achievement. Please try again."}
					</div>
				)}
				<GenericForm
					schema={createAchievementYupSchema}
					defaultValues={{
						title: "",
						description: "",
						achievementType: achievementTypes[0],
						userId: users.length > 0 ? users[0]._id : "",
						certificateFile: undefined,
					}}
					onSubmit={handleCreateAchievement}
					submitButtonText={isCreating ? "Creating..." : "Create Achievement"}
					selectOptions={{
						achievementType: achievementTypes.map((type) => ({
							value: type,
							label:
								type.charAt(0).toUpperCase() + type.slice(1).replace("_", " "),
						})),
						userId: users.map((user) => ({
							value: user._id,
							label: `${user.firstName} ${user.lastName} (${user.email})`,
						})),
					}}
					context={{
						showFilePreview: true,
					}}
				/>
			</Modal>
		</>
	);
};

export default Achievements;
