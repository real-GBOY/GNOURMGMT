/** @format */

import React, { useState, useEffect } from "react";
import { Search, Filter, X, Calendar, User, Award } from "lucide-react";
import { Button } from "./Button";
import { AchievementType } from "../types/Achievement";

interface AchievementFilterProps {
	filters: {
		search: string;
		type: AchievementType | "";
		dateFrom: string;
		dateTo: string;
		awardedBy: string;
		verified: boolean | null;
		hasFiles: boolean | null;
	};
	onFiltersChange: (filters: any) => void;
	onReset: () => void;
	className?: string;
}

export const AchievementFilter: React.FC<AchievementFilterProps> = ({
	filters,
	onFiltersChange,
	onReset,
	className = "",
}) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [localFilters, setLocalFilters] = useState(filters);

	useEffect(() => {
		setLocalFilters(filters);
	}, [filters]);

	const handleFilterChange = (key: string, value: any) => {
		const newFilters = { ...localFilters, [key]: value };
		setLocalFilters(newFilters);
		onFiltersChange(newFilters);
	};

	const handleReset = () => {
		const resetFilters = {
			search: "",
			type: "",
			dateFrom: "",
			dateTo: "",
			awardedBy: "",
			verified: null,
			hasFiles: null,
		};
		setLocalFilters(resetFilters);
		onReset();
	};

	const hasActiveFilters = Object.values(filters).some(
		(value) => value !== "" && value !== null && value !== false
	);

	const achievementTypes: AchievementType[] = [
		"best_member_of_the_month",
		"best_member_of_the_year",
		"dedication",
	];

	const getAchievementTypeLabel = (type: AchievementType) => {
		return type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
	};

	const getAchievementTypeIcon = (type: AchievementType) => {
		const icons: Record<AchievementType, string> = {
			leadership: "👑",
			innovation: "💡",
			excellence: "⭐",
			teamwork: "🤝",
			research: "🔬",
			community_service: "🌍",
			academic: "📚",
			sports: "🏃",
			arts: "🎨",
			technology: "💻",
		};
		return icons[type];
	};

	return (
		<div className={`achievement-filter ${className}`}>
			{/* Search Bar */}
			<div className='flex items-center space-x-3 mb-4'>
				<div className='relative flex-1'>
					<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
					<input
						type='text'
						placeholder='Search achievements by title, description, or user...'
						value={localFilters.search}
						onChange={(e) => handleFilterChange("search", e.target.value)}
						className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white'
					/>
				</div>

				<Button
					variant='outline'
					onClick={() => setIsExpanded(!isExpanded)}
					className='flex items-center space-x-2'>
					<Filter className='w-4 h-4' />
					<span>Filters</span>
					{hasActiveFilters && (
						<div className='w-2 h-2 bg-blue-500 rounded-full'></div>
					)}
				</Button>

				{hasActiveFilters && (
					<Button
						variant='ghost'
						onClick={handleReset}
						className='text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20'>
						<X className='w-4 h-4' />
						<span>Clear</span>
					</Button>
				)}
			</div>

			{/* Expanded Filters */}
			{isExpanded && (
				<div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700 mb-4'>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
						{/* Achievement Type */}
						<div>
							<label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
								Achievement Type
							</label>
							<select
								value={localFilters.type}
								onChange={(e) => handleFilterChange("type", e.target.value)}
								className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white'>
								<option value=''>All Types</option>
								{achievementTypes.map((type) => (
									<option key={type} value={type}>
										{getAchievementTypeIcon(type)}{" "}
										{getAchievementTypeLabel(type)}
									</option>
								))}
							</select>
						</div>

						{/* Date Range */}
						<div>
							<label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
								Date From
							</label>
							<input
								type='date'
								value={localFilters.dateFrom}
								onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
								className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white'
							/>
						</div>

						<div>
							<label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
								Date To
							</label>
							<input
								type='date'
								value={localFilters.dateTo}
								onChange={(e) => handleFilterChange("dateTo", e.target.value)}
								className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white'
							/>
						</div>

						{/* Awarded By */}
						<div>
							<label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
								Awarded By
							</label>
							<input
								type='text'
								placeholder='Search by awarder name...'
								value={localFilters.awardedBy}
								onChange={(e) =>
									handleFilterChange("awardedBy", e.target.value)
								}
								className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white'
							/>
						</div>

						{/* Verification Status */}
						<div>
							<label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
								Verification Status
							</label>
							<select
								value={
									localFilters.verified === null
										? ""
										: localFilters.verified.toString()
								}
								onChange={(e) =>
									handleFilterChange(
										"verified",
										e.target.value === "" ? null : e.target.value === "true"
									)
								}
								className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white'>
								<option value=''>All</option>
								<option value='true'>Verified Only</option>
								<option value='false'>Unverified Only</option>
							</select>
						</div>

						{/* File Status */}
						<div>
							<label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
								File Status
							</label>
							<select
								value={
									localFilters.hasFiles === null
										? ""
										: localFilters.hasFiles.toString()
								}
								onChange={(e) =>
									handleFilterChange(
										"hasFiles",
										e.target.value === "" ? null : e.target.value === "true"
									)
								}
								className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white'>
								<option value=''>All</option>
								<option value='true'>With Files</option>
								<option value='false'>Without Files</option>
							</select>
						</div>
					</div>

					{/* Active Filters Display */}
					{hasActiveFilters && (
						<div className='mt-4 pt-4 border-t border-gray-200 dark:border-gray-700'>
							<div className='flex flex-wrap gap-2'>
								{filters.search && (
									<span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'>
										Search: {filters.search}
										<button
											onClick={() => handleFilterChange("search", "")}
											className='ml-1 text-blue-600 hover:text-blue-800'>
											<X className='w-3 h-3' />
										</button>
									</span>
								)}

								{filters.type && (
									<span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'>
										Type:{" "}
										{getAchievementTypeLabel(filters.type as AchievementType)}
										<button
											onClick={() => handleFilterChange("type", "")}
											className='ml-1 text-purple-600 hover:text-purple-800'>
											<X className='w-3 h-3' />
										</button>
									</span>
								)}

								{filters.dateFrom && (
									<span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'>
										From: {filters.dateFrom}
										<button
											onClick={() => handleFilterChange("dateFrom", "")}
											className='ml-1 text-green-600 hover:text-green-800'>
											<X className='w-3 h-3' />
										</button>
									</span>
								)}

								{filters.dateTo && (
									<span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'>
										To: {filters.dateTo}
										<button
											onClick={() => handleFilterChange("dateTo", "")}
											className='ml-1 text-green-600 hover:text-green-800'>
											<X className='w-3 h-3' />
										</button>
									</span>
								)}

								{filters.awardedBy && (
									<span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'>
										Awarded by: {filters.awardedBy}
										<button
											onClick={() => handleFilterChange("awardedBy", "")}
											className='ml-1 text-yellow-600 hover:text-yellow-800'>
											<X className='w-3 h-3' />
										</button>
									</span>
								)}

								{filters.verified !== null && (
									<span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'>
										{filters.verified ? "Verified" : "Unverified"}
										<button
											onClick={() => handleFilterChange("verified", null)}
											className='ml-1 text-indigo-600 hover:text-indigo-800'>
											<X className='w-3 h-3' />
										</button>
									</span>
								)}

								{filters.hasFiles !== null && (
									<span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'>
										{filters.hasFiles ? "With Files" : "Without Files"}
										<button
											onClick={() => handleFilterChange("hasFiles", null)}
											className='ml-1 text-pink-600 hover:text-pink-800'>
											<X className='w-3 h-3' />
										</button>
									</span>
								)}
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
};
