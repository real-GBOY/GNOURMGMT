/** @format */

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
	BarChart3,
	ArrowLeft,
	Users,
	TrendingUp,
	PieChart,
	Calendar,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	PieChart as RechartsPieChart,
	Pie,
	Cell,
	Area,
	AreaChart,
} from "recharts";
import { useTheme } from "../../shared/contexts/ThemeContext";
import {
	useGetAllApplicantsForAnalytics,
	Applicant,
} from "../../shared/services/applicationService";

const ApplicantsAnalytics: React.FC = () => {
	const { theme } = useTheme();
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 20;

	const { data: allApplicants = [], isLoading } =
		useGetAllApplicantsForAnalytics();

	// Use all applicants for analytics (no slicing/limiting)
	const typedAllApplicants = allApplicants as Applicant[];
	const totalPages = Math.ceil(typedAllApplicants.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const paginatedApplicants = typedAllApplicants.slice(startIndex, endIndex);

	// Use paginated data for analytics
	const applicants = paginatedApplicants;

	// Color palette for charts - theme-aware
	const COLORS = {
		blue: theme === "dark" ? "#3B82F6" : "#2563EB",
		green: theme === "dark" ? "#10B981" : "#059669",
		purple: theme === "dark" ? "#8B5CF6" : "#7C3AED",
		orange: theme === "dark" ? "#F59E0B" : "#D97706",
		red: theme === "dark" ? "#EF4444" : "#DC2626",
		yellow: theme === "dark" ? "#EAB308" : "#CA8A04",
		indigo: theme === "dark" ? "#6366F1" : "#4F46E5",
		pink: theme === "dark" ? "#EC4899" : "#DB2777",
	};

	const PIE_COLORS = [
		COLORS.blue,
		COLORS.green,
		COLORS.purple,
		COLORS.orange,
		COLORS.red,
		COLORS.yellow,
		COLORS.indigo,
		COLORS.pink,
	];

	// Calculate analytics data using all applicants for accurate statistics
	const analytics = React.useMemo(() => {
		if (
			!typedAllApplicants ||
			!Array.isArray(typedAllApplicants) ||
			!typedAllApplicants.length
		)
			return null;

		// Use the already typed applicants
		const typedApplicants = typedAllApplicants;

		// Team distribution
		const teamDistribution = typedApplicants.reduce((acc, applicant) => {
			acc[applicant.selectedTeam] = (acc[applicant.selectedTeam] || 0) + 1;
			return acc;
		}, {} as Record<string, number>);

		// Gender distribution
		const genderDistribution = typedApplicants.reduce((acc, applicant) => {
			const gender = applicant.gender || "Unknown";
			// Filter out "mickey mouse" entries
			if (gender.toLowerCase() !== "mickey mouse") {
				acc[gender] = (acc[gender] || 0) + 1;
			}
			return acc;
		}, {} as Record<string, number>);

		// Applications by day
		const dailyData = typedApplicants.reduce((acc, applicant) => {
			const date = new Date(applicant.createdAt);
			const day = date.toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
				year: "numeric",
			});
			acc[day] = (acc[day] || 0) + 1;
			return acc;
		}, {} as Record<string, number>);

		// Faculty distribution
		const facultyDistribution = typedApplicants.reduce((acc, applicant) => {
			acc[applicant.faculty] = (acc[applicant.faculty] || 0) + 1;
			return acc;
		}, {} as Record<string, number>);

		// Convert to Recharts format
		const teamChartData = Object.entries(teamDistribution)
			.map(([name, value]) => ({ name, value }))
			.sort((a, b) => b.value - a.value);

		const genderChartData = Object.entries(genderDistribution).map(
			([name, value]) => ({ name, value })
		);

		const facultyChartData = Object.entries(facultyDistribution)
			.map(([name, value]) => ({ name, value }))
			.sort((a, b) => b.value - a.value);

		const dailyChartData = Object.entries(dailyData)
			.map(([name, value]) => ({ name, value }))
			.sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());

		return {
			total: typedApplicants.length,
			teamDistribution,
			genderDistribution,
			dailyData,
			facultyDistribution,
			// Recharts data
			teamChartData,
			genderChartData,
			facultyChartData,
			dailyChartData,
		};
	}, [typedAllApplicants]);

	if (isLoading) {
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500'></div>
			</div>
		);
	}

	if (!analytics) {
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<div className='text-center'>
					<BarChart3 size={48} className='mx-auto mb-4 text-gray-400' />
					<p className='text-gray-500'>No data available for analytics</p>
				</div>
			</div>
		);
	}

	return (
		<div className='space-y-4 sm:space-y-6 p-3 sm:p-4 lg:p-6 xl:p-8'>
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className='flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0'>
				<div className='flex items-center space-x-3 sm:space-x-4'>
					<Link
						to='/dashboard/applicants'
						className={`p-2 rounded-lg transition-all duration-300 hover:scale-105 ${
							theme === "dark"
								? "hover:bg-gray-800/60 text-gray-400 hover:text-white"
								: "hover:bg-gray-100/80 text-gray-600 hover:text-black"
						}`}>
						<ArrowLeft size={18} className='sm:w-5 sm:h-5' />
					</Link>
					<div>
						<h1
							className={`text-2xl sm:text-3xl font-bold transition-colors duration-300 ${
								theme === "dark" ? "text-white" : "text-black"
							}`}>
							Applicants Analytics
						</h1>
						<p
							className={`mt-1 sm:mt-2 text-sm sm:text-lg transition-colors duration-300 ${
								theme === "dark" ? "text-gray-400" : "text-gray-600"
							}`}>
							Insights and statistics about applications
						</p>
					</div>
				</div>
				<div className='flex items-center space-x-2'>
					<BarChart3
						size={20}
						className={`${
							theme === "dark" ? "text-gray-400" : "text-gray-600"
						} sm:w-6 sm:h-6`}
					/>
				</div>
			</motion.div>

			{/* Pagination Controls */}
			<motion.div
				className={`p-4 sm:p-6 rounded-xl border transition-all duration-300 ${
					theme === "dark"
						? "bg-gray-900/30 backdrop-blur-2xl border-gray-700/50 shadow-2xl"
						: "bg-white/40 backdrop-blur-2xl border-gray-200/60 shadow-2xl"
				}`}
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.15 }}>
				<div className='flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0'>
					<div className='text-center sm:text-left'>
						<p
							className={`text-xs sm:text-sm font-medium transition-colors duration-300 ${
								theme === "dark" ? "text-gray-300" : "text-gray-700"
							}`}>
							Showing {startIndex + 1} to{" "}
							{Math.min(endIndex, typedAllApplicants.length)} of{" "}
							{typedAllApplicants.length} applicants
						</p>
						<p
							className={`text-xs transition-colors duration-300 ${
								theme === "dark" ? "text-gray-400" : "text-gray-500"
							}`}>
							Page {currentPage} of {totalPages}
						</p>
					</div>

					<div className='flex items-center justify-center space-x-2'>
						<button
							onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
							disabled={currentPage === 1}
							className={`p-2 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
								theme === "dark"
									? "hover:bg-gray-800/60 text-gray-400 hover:text-white disabled:hover:bg-transparent"
									: "hover:bg-gray-100/80 text-gray-600 hover:text-black disabled:hover:bg-transparent"
							}`}>
							<ChevronLeft size={16} className='sm:w-5 sm:h-5' />
						</button>

						<div className='flex items-center space-x-1'>
							{Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
								const pageNum = i + 1;
								const isActive = pageNum === currentPage;
								return (
									<button
										key={pageNum}
										onClick={() => setCurrentPage(pageNum)}
										className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${
											isActive
												? theme === "dark"
													? "bg-blue-600 text-white"
													: "bg-blue-600 text-white"
												: theme === "dark"
												? "text-gray-400 hover:text-white hover:bg-gray-800/60"
												: "text-gray-600 hover:text-black hover:bg-gray-100/80"
										}`}>
										{pageNum}
									</button>
								);
							})}
							{totalPages > 5 && (
								<>
									<span
										className={`px-1 sm:px-2 text-xs ${
											theme === "dark" ? "text-gray-500" : "text-gray-400"
										}`}>
										...
									</span>
									<button
										onClick={() => setCurrentPage(totalPages)}
										className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${
											currentPage === totalPages
												? theme === "dark"
													? "bg-blue-600 text-white"
													: "bg-blue-600 text-white"
												: theme === "dark"
												? "text-gray-400 hover:text-white hover:bg-gray-800/60"
												: "text-gray-600 hover:text-black hover:bg-gray-100/80"
										}`}>
										{totalPages}
									</button>
								</>
							)}
						</div>

						<button
							onClick={() =>
								setCurrentPage((prev) => Math.min(prev + 1, totalPages))
							}
							disabled={currentPage === totalPages}
							className={`p-2 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
								theme === "dark"
									? "hover:bg-gray-800/60 text-gray-400 hover:text-white disabled:hover:bg-transparent"
									: "hover:bg-gray-100/80 text-gray-600 hover:text-black disabled:hover:bg-transparent"
							}`}>
							<ChevronRight size={16} className='sm:w-5 sm:h-5' />
						</button>
					</div>
				</div>
			</motion.div>

			{/* Overview Cards */}
			<motion.div
				className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.1 }}>
				{[
					{
						name: "Total Applications",
						value: analytics.total,
						icon: Users,
						color: "blue",
					},
					{
						name: "Teams",
						value: Object.keys(analytics.teamDistribution).length,
						icon: PieChart,
						color: "green",
					},
					{
						name: "Faculties",
						value: Object.keys(analytics.facultyDistribution).length,
						icon: TrendingUp,
						color: "purple",
					},
					{
						name: "Days",
						value: Object.keys(analytics.dailyData).length,
						icon: Calendar,
						color: "orange",
					},
				].map((stat, index) => (
					<motion.div
						key={stat.name}
						className={`p-4 sm:p-6 rounded-xl border transition-all duration-300 hover:scale-105 ${
							theme === "dark"
								? "bg-gray-900/30 backdrop-blur-2xl border-gray-700/50 shadow-2xl hover:shadow-3xl hover:border-gray-600/70"
								: "bg-white/40 backdrop-blur-2xl border-gray-200/60 shadow-2xl hover:shadow-3xl hover:border-gray-300/80"
						}`}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}>
						<div className='flex items-center justify-between'>
							<div>
								<p
									className={`text-xs sm:text-sm font-medium transition-colors duration-300 ${
										theme === "dark" ? "text-gray-400" : "text-gray-600"
									}`}>
									{stat.name}
								</p>
								<p
									className={`text-xl sm:text-2xl font-bold mt-1 transition-colors duration-300 ${
										theme === "dark" ? "text-white" : "text-black"
									}`}>
									{stat.value}
								</p>
							</div>
							<div
								className={`p-2 sm:p-3 rounded-xl transition-all duration-300 ${
									stat.color === "blue"
										? "bg-blue-600/30 backdrop-blur-sm"
										: stat.color === "green"
										? "bg-green-600/30 backdrop-blur-sm"
										: stat.color === "purple"
										? "bg-purple-600/30 backdrop-blur-sm"
										: "bg-orange-600/30 backdrop-blur-sm"
								}`}>
								<stat.icon
									size={20}
									className={`sm:w-6 sm:h-6 ${
										stat.color === "blue"
											? "text-blue-400"
											: stat.color === "green"
											? "text-green-400"
											: stat.color === "purple"
											? "text-purple-400"
											: "text-orange-400"
									}`}
								/>
							</div>
						</div>
					</motion.div>
				))}
			</motion.div>

			{/* Recharts Grid */}
			<div className='space-y-4 sm:space-y-6 mb-6 sm:mb-8'>
				{/* First Row - Team and Faculty Charts */}
				<div className='grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6'>
					{/* Team Distribution - Bar Chart */}
					<motion.div
						className={`p-4 sm:p-6 rounded-xl border transition-all duration-300 lg:col-span-1 ${
							theme === "dark"
								? "bg-gray-900/30 backdrop-blur-2xl border-gray-700/50 shadow-2xl"
								: "bg-white/40 backdrop-blur-2xl border-gray-200/60 shadow-2xl"
						}`}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}>
						<h3
							className={`text-base sm:text-xl font-semibold mb-3 sm:mb-4 transition-colors duration-300 ${
								theme === "dark" ? "text-white" : "text-black"
							}`}>
							Applications by Team
						</h3>
						<div className='h-64 sm:h-80'>
							<ResponsiveContainer width='100%' height='100%'>
								<BarChart data={analytics.teamChartData}>
									<CartesianGrid
										strokeDasharray='3 3'
										stroke={theme === "dark" ? "#374151" : "#E5E7EB"}
									/>
									<XAxis
										dataKey='name'
										tick={{
											fill: theme === "dark" ? "#D1D5DB" : "#374151",
											fontSize: 10,
										}}
										axisLine={{
											stroke: theme === "dark" ? "#374151" : "#E5E7EB",
										}}
									/>
									<YAxis
										tick={{
											fill: theme === "dark" ? "#D1D5DB" : "#374151",
											fontSize: 10,
										}}
										axisLine={{
											stroke: theme === "dark" ? "#374151" : "#E5E7EB",
										}}
									/>
									<Tooltip
										contentStyle={{
											backgroundColor: theme === "dark" ? "#1F2937" : "#FFFFFF",
											border:
												theme === "dark"
													? "1px solid #374151"
													: "1px solid #E5E7EB",
											borderRadius: "8px",
											color: theme === "dark" ? "#F9FAFB" : "#111827",
											fontSize: "12px",
										}}
									/>
									<Bar
										dataKey='value'
										fill={COLORS.blue}
										radius={[4, 4, 0, 0]}
									/>
								</BarChart>
							</ResponsiveContainer>
						</div>
					</motion.div>
					<motion.div
						className={`p-4 sm:p-6 rounded-xl border transition-all duration-300 ${
							theme === "dark"
								? "bg-gray-900/30 backdrop-blur-2xl border-gray-700/50 shadow-2xl"
								: "bg-white/40 backdrop-blur-2xl border-gray-200/60 shadow-2xl"
						}`}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.8 }}>
						<h3
							className={`text-base sm:text-xl font-semibold mb-3 sm:mb-4 transition-colors duration-300 ${
								theme === "dark" ? "text-white" : "text-black"
							}`}>
							Gender Distribution (Progress View)
						</h3>
						<div className='space-y-3'>
							{Object.entries(analytics.genderDistribution)
								.sort(([, a], [, b]) => b - a)
								.map(([gender, count]) => {
									const percentage = (count / analytics.total) * 100;
									const genderColor =
										gender === "Male"
											? "blue"
											: gender === "Female"
											? "pink"
											: "purple";
									return (
										<div key={gender} className='space-y-2'>
											<div className='flex justify-between items-center'>
												<span
													className={`text-xs sm:text-sm font-medium transition-colors duration-300 ${
														theme === "dark" ? "text-gray-300" : "text-gray-700"
													}`}>
													{gender}
												</span>
												<span
													className={`text-xs sm:text-sm font-bold transition-colors duration-300 ${
														theme === "dark" ? "text-white" : "text-black"
													}`}>
													{count} ({percentage.toFixed(1)}%)
												</span>
											</div>
											<div
												className={`w-full rounded-full h-2 ${
													theme === "dark" ? "bg-gray-800" : "bg-gray-200"
												}`}>
												<div
													className={`h-2 rounded-full ${
														genderColor === "blue"
															? theme === "dark"
																? "bg-blue-500"
																: "bg-blue-600"
															: genderColor === "pink"
															? theme === "dark"
																? "bg-pink-500"
																: "bg-pink-600"
															: theme === "dark"
															? "bg-purple-500"
															: "bg-purple-600"
													}`}
													style={{ width: `${percentage}%` }}
												/>
											</div>
										</div>
									);
								})}
						</div>
					</motion.div>
				</div>

				{/* Second Row - Applications Over Time (Full Width) */}
				<motion.div
					className={`p-4 sm:p-6 rounded-xl border transition-all duration-300 w-full ${
						theme === "dark"
							? "bg-gray-900/30 backdrop-blur-2xl border-gray-700/50 shadow-2xl"
							: "bg-white/40 backdrop-blur-2xl border-gray-200/60 shadow-2xl"
					}`}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.4 }}>
					<h3
						className={`text-base sm:text-xl font-semibold mb-3 sm:mb-4 transition-colors duration-300 ${
							theme === "dark" ? "text-white" : "text-black"
						}`}>
						Applications Over Time (Daily)
					</h3>
					<div className='h-64 sm:h-80'>
						<ResponsiveContainer width='100%' height='100%'>
							<AreaChart data={analytics.dailyChartData}>
								<CartesianGrid
									strokeDasharray='3 3'
									stroke={theme === "dark" ? "#374151" : "#E5E7EB"}
								/>
								<XAxis
									dataKey='name'
									tick={{
										fill: theme === "dark" ? "#D1D5DB" : "#374151",
										fontSize: 10,
									}}
									axisLine={{
										stroke: theme === "dark" ? "#374151" : "#E5E7EB",
									}}
								/>
								<YAxis
									tick={{
										fill: theme === "dark" ? "#D1D5DB" : "#374151",
										fontSize: 10,
									}}
									axisLine={{
										stroke: theme === "dark" ? "#374151" : "#E5E7EB",
									}}
								/>
								<Tooltip
									contentStyle={{
										backgroundColor: theme === "dark" ? "#1F2937" : "#FFFFFF",
										border:
											theme === "dark"
												? "1px solid #374151"
												: "1px solid #E5E7EB",
										borderRadius: "8px",
										color: theme === "dark" ? "#F9FAFB" : "#111827",
										fontSize: "12px",
									}}
								/>
								<Area
									type='monotone'
									dataKey='value'
									stroke={COLORS.purple}
									fill={COLORS.purple}
									fillOpacity={0.3}
									strokeWidth={2}
								/>
							</AreaChart>
						</ResponsiveContainer>
					</div>
				</motion.div>
			</div>

			{/* Original Progress Bar Charts */}
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6'>
				{/* Team Distribution - Progress Bars */}
				<motion.div
					className={`p-4 sm:p-6 rounded-xl border transition-all duration-300 ${
						theme === "dark"
							? "bg-gray-900/30 backdrop-blur-2xl border-gray-700/50 shadow-2xl"
							: "bg-white/40 backdrop-blur-2xl border-gray-200/60 shadow-2xl"
					}`}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.6 }}>
					<h3
						className={`text-base sm:text-xl font-semibold mb-3 sm:mb-4 transition-colors duration-300 ${
							theme === "dark" ? "text-white" : "text-black"
						}`}>
						Team Distribution (Progress View)
					</h3>
					<div className='space-y-3'>
						{Object.entries(analytics.teamDistribution)
							.sort(([, a], [, b]) => b - a)
							.map(([team, count]) => {
								const percentage = (count / analytics.total) * 100;
								return (
									<div key={team} className='space-y-2'>
										<div className='flex justify-between items-center'>
											<span
												className={`text-xs sm:text-sm font-medium transition-colors duration-300 ${
													theme === "dark" ? "text-gray-300" : "text-gray-700"
												}`}>
												{team}
											</span>
											<span
												className={`text-xs sm:text-sm font-bold transition-colors duration-300 ${
													theme === "dark" ? "text-white" : "text-black"
												}`}>
												{count} ({percentage.toFixed(1)}%)
											</span>
										</div>
										<div
											className={`w-full rounded-full h-2 ${
												theme === "dark" ? "bg-gray-800" : "bg-gray-200"
											}`}>
											<div
												className={`h-2 rounded-full ${
													theme === "dark" ? "bg-blue-500" : "bg-blue-600"
												}`}
												style={{ width: `${percentage}%` }}
											/>
										</div>
									</div>
								);
							})}
					</div>
				</motion.div>

				{/* Status Distribution - Progress Bars */}

				{/* Monthly Applications - Progress Bars */}
				<motion.div
					className={`p-4 sm:p-6 rounded-xl border transition-all duration-300 ${
						theme === "dark"
							? "bg-gray-900/30 backdrop-blur-2xl border-gray-700/50 shadow-2xl"
							: "bg-white/40 backdrop-blur-2xl border-gray-200/60 shadow-2xl"
					}`}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.9 }}>
					<h3
						className={`text-base sm:text-xl font-semibold mb-3 sm:mb-4 transition-colors duration-300 ${
							theme === "dark" ? "text-white" : "text-black"
						}`}>
						Applications Over Time (Daily Progress View)
					</h3>
					<div className='space-y-3 max-h-80 sm:max-h-96 overflow-y-auto'>
						{Object.entries(analytics.dailyData)
							.sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
							.map(([day, count]) => {
								const maxCount = Math.max(
									...Object.values(analytics.dailyData)
								);
								const percentage = (count / maxCount) * 100;
								return (
									<div key={day} className='space-y-2'>
										<div className='flex justify-between items-center'>
											<span
												className={`text-xs sm:text-sm font-medium transition-colors duration-300 ${
													theme === "dark" ? "text-gray-300" : "text-gray-700"
												}`}>
												{day}
											</span>
											<span
												className={`text-xs sm:text-sm font-bold transition-colors duration-300 ${
													theme === "dark" ? "text-white" : "text-black"
												}`}>
												{count}
											</span>
										</div>
										<div
											className={`w-full rounded-full h-2 ${
												theme === "dark" ? "bg-gray-800" : "bg-gray-200"
											}`}>
											<div
												className={`h-2 rounded-full ${
													theme === "dark" ? "bg-purple-500" : "bg-purple-600"
												}`}
												style={{ width: `${percentage}%` }}
											/>
										</div>
									</div>
								);
							})}
					</div>
				</motion.div>
			</div>
		</div>
	);
};

export default ApplicantsAnalytics;
