/** @format */

import React from "react";
import { motion } from "framer-motion";
import {
	Users,
	FileText,
	DollarSign,
	BarChart3,
	TrendingUp,
	Activity,
	Calendar,
	Clock,
	MessageCircleMore,
	Eye,
} from "lucide-react";
import { useTheme } from "../../shared/contexts/ThemeContext";
import { useState } from "react";
import Modal from "../../shared/components/Modal";
import {
	useFeedback,
	useFeedbackById,
} from "../../shared/services/feedbackService";

const Dashboard: React.FC = () => {
	const { theme } = useTheme();
	const [viewingFeedbackId, setViewingFeedbackId] = useState<string | null>(
		null
	);
	const { data: feedbackList = [] } = useFeedback();
	const { data: viewingFeedback } = useFeedbackById(viewingFeedbackId || "");

	console.log("Dashboard component rendered!");

	const stats = [
		{
			name: "Total Members",
			value: "1,234",
			change: "+12%",
			changeType: "positive",
			icon: Users,
		},
		{
			name: "Active Projects",
			value: "56",
			change: "+8%",
			changeType: "positive",
			icon: FileText,
		},
		{
			name: "Monthly Payroll",
			value: "$234,567",
			change: "+15%",
			changeType: "positive",
			icon: DollarSign,
		},
		{
			name: "Performance",
			value: "94%",
			change: "+2%",
			changeType: "positive",
			icon: BarChart3,
		},
	];

	const recentActivities = [
		{
			id: 1,
			title: "New member added",
			description: "John Doe joined the team",
			time: "2 hours ago",
			icon: Users,
		},
		{
			id: 2,
			title: "Project completed",
			description: "Website redesign finished",
			time: "4 hours ago",
			icon: FileText,
		},
		{
			id: 3,
			title: "Payroll processed",
			description: "Monthly payroll completed",
			time: "1 day ago",
			icon: DollarSign,
		},
		{
			id: 4,
			title: "Performance review",
			description: "Q4 performance review started",
			time: "2 days ago",
			icon: BarChart3,
		},
	];

	return (
		<div className='space-y-6'>
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}>
				<h1
					className={`text-3xl font-bold transition-colors duration-300 ${
						theme === "dark" ? "text-white" : "text-black"
					}`}>
					Dashboard
				</h1>
				<p
					className={`mt-2 text-lg transition-colors duration-300 ${
						theme === "dark" ? "text-gray-400" : "text-gray-600"
					}`}>
					Welcome to your GNOUR dashboard
				</p>
			</motion.div>

			{/* Stats Grid */}
			<motion.div
				className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.1 }}>
				{stats.map((stat, index) => (
					<motion.div
						key={stat.name}
						className={`p-6 rounded-xl border transition-all duration-300 hover:scale-105 ${
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
									className={`text-sm font-medium transition-colors duration-300 ${
										theme === "dark" ? "text-gray-400" : "text-gray-600"
									}`}>
									{stat.name}
								</p>
								<p
									className={`text-2xl font-bold mt-1 transition-colors duration-300 ${
										theme === "dark" ? "text-white" : "text-black"
									}`}>
									{stat.value}
								</p>
							</div>
							<div
								className={`p-3 rounded-xl transition-all duration-300 ${
									theme === "dark"
										? "bg-blue-600/30 backdrop-blur-sm"
										: "bg-blue-50/80 backdrop-blur-sm"
								}`}>
								<stat.icon
									size={24}
									className={
										theme === "dark" ? "text-blue-400" : "text-blue-600"
									}
								/>
							</div>
						</div>
						<div className='mt-4 flex items-center'>
							<TrendingUp
								size={16}
								className={`mr-1 ${
									stat.changeType === "positive"
										? "text-green-500"
										: "text-red-500"
								}`}
							/>
							<span
								className={`text-sm font-medium ${
									stat.changeType === "positive"
										? "text-green-600 dark:text-green-400"
										: "text-red-600 dark:text-red-400"
								}`}>
								{stat.change}
							</span>
							<span
								className={`text-sm ml-1 transition-colors duration-300 ${
									theme === "dark" ? "text-gray-400" : "text-gray-600"
								}`}>
								from last month
							</span>
						</div>
					</motion.div>
				))}
			</motion.div>

			{/* Content Grid */}
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
				{/* Recent Activity */}
				<motion.div
					className={`p-6 rounded-xl border transition-all duration-300 hover:scale-[1.02] ${
						theme === "dark"
							? "bg-gray-900/30 backdrop-blur-2xl border-gray-700/50 shadow-2xl hover:shadow-3xl hover:border-gray-600/70"
							: "bg-white/40 backdrop-blur-2xl border-gray-200/60 shadow-2xl hover:shadow-3xl hover:border-gray-300/80"
					}`}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.3 }}>
					<div className='flex items-center justify-between mb-6'>
						<h3
							className={`text-lg font-semibold transition-colors duration-300 ${
								theme === "dark" ? "text-white" : "text-black"
							}`}>
							Recent Activity
						</h3>
						<Activity
							size={20}
							className={theme === "dark" ? "text-gray-400" : "text-gray-600"}
						/>
					</div>
					<div className='space-y-4'>
						{recentActivities.map((activity) => (
							<div key={activity.id} className='flex items-start space-x-3'>
								<div
									className={`p-2 rounded-lg transition-all duration-300 ${
										theme === "dark"
											? "bg-gray-800/60 backdrop-blur-sm"
											: "bg-gray-100/80 backdrop-blur-sm"
									}`}>
									<activity.icon
										size={16}
										className={
											theme === "dark" ? "text-gray-400" : "text-gray-600"
										}
									/>
								</div>
								<div className='flex-1 min-w-0'>
									<p
										className={`text-sm font-medium transition-colors duration-300 ${
											theme === "dark" ? "text-white" : "text-black"
										}`}>
										{activity.title}
									</p>
									<p
										className={`text-sm transition-colors duration-300 ${
											theme === "dark" ? "text-gray-400" : "text-gray-600"
										}`}>
										{activity.description}
									</p>
									<p
										className={`text-xs transition-colors duration-300 ${
											theme === "dark" ? "text-gray-500" : "text-gray-500"
										}`}>
										{activity.time}
									</p>
								</div>
							</div>
						))}
					</div>
				</motion.div>

				{/* Latest Feedbacks */}
				<motion.div
					className={`p-6 rounded-xl border transition-all duration-300 hover:scale-[1.02] ${
						theme === "dark"
							? "bg-gray-900/30 backdrop-blur-2xl border-gray-700/50 shadow-2xl hover:shadow-3xl hover:border-gray-600/70"
							: "bg-white/40 backdrop-blur-2xl border-gray-200/60 shadow-2xl hover:shadow-3xl hover:border-gray-300/80"
					}`}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.35 }}>
					<div className='flex items-center justify-between mb-6'>
						<h3
							className={`text-lg font-semibold transition-colors duration-300 ${
								theme === "dark" ? "text-white" : "text-black"
							}`}>
							Latest Feedbacks
						</h3>
						<MessageCircleMore
							size={20}
							className={theme === "dark" ? "text-gray-400" : "text-gray-600"}
						/>
					</div>
					<div className='space-y-4'>
						{(feedbackList || []).slice(0, 5).map((f: any) => (
							<div key={f._id} className='flex items-start justify-between'>
								<div>
									<p
										className={`text-sm font-medium ${
											theme === "dark" ? "text-white" : "text-black"
										}`}>
										{f.title}
									</p>
									<p
										className={`text-xs ${
											theme === "dark" ? "text-gray-400" : "text-gray-600"
										}`}>
										{f.category}
									</p>
								</div>
								<button
									className={`p-2 rounded-lg ${
										theme === "dark"
											? "hover:bg-gray-800 text-gray-400 hover:text-white"
											: "hover:bg-gray-100 text-gray-600 hover:text-black"
									}`}
									title='View'
									onClick={() => setViewingFeedbackId(f._id)}>
									<Eye size={16} />
								</button>
							</div>
						))}
						{(feedbackList || []).length === 0 && (
							<div
								className={`text-sm ${
									theme === "dark" ? "text-gray-400" : "text-gray-600"
								}`}>
								No feedbacks yet
							</div>
						)}
					</div>
				</motion.div>

				{/* Quick Actions */}
				<motion.div
					className={`p-6 rounded-xl border transition-all duration-300 hover:scale-[1.02] ${
						theme === "dark"
							? "bg-gray-900/30 backdrop-blur-2xl border-gray-700/50 shadow-2xl hover:shadow-3xl hover:border-gray-600/70"
							: "bg-white/40 backdrop-blur-2xl border-gray-200/60 shadow-2xl hover:shadow-3xl hover:border-gray-300/80"
					}`}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.4 }}>
					<div className='flex items-center justify-between mb-6'>
						<h3
							className={`text-lg font-semibold transition-colors duration-300 ${
								theme === "dark" ? "text-white" : "text-black"
							}`}>
							Quick Actions
						</h3>
						<Clock
							size={20}
							className={theme === "dark" ? "text-gray-400" : "text-gray-600"}
						/>
					</div>
					<div className='grid grid-cols-2 gap-4'>
						{[
							{ name: "Add Member", icon: Users, color: "blue" },
							{ name: "Create Project", icon: FileText, color: "green" },
							{ name: "Process Payroll", icon: DollarSign, color: "purple" },
							{ name: "View Reports", icon: BarChart3, color: "orange" },
						].map((action) => (
							<button
								key={action.name}
								className={`p-4 rounded-xl border transition-all duration-300 hover:scale-105 hover:shadow-lg ${
									theme === "dark"
										? "border-gray-700/50 hover:border-gray-600/70 bg-gray-800/40 backdrop-blur-sm hover:bg-gray-800/60"
										: "border-gray-200/60 hover:border-gray-300/80 bg-gray-50/60 backdrop-blur-sm hover:bg-gray-100/80"
								}`}>
								<div
									className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${
										action.color === "blue"
											? "bg-blue-100/80 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 backdrop-blur-sm"
											: action.color === "green"
											? "bg-green-100/80 text-green-600 dark:bg-green-900/30 dark:text-green-400 backdrop-blur-sm"
											: action.color === "purple"
											? "bg-purple-100/80 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 backdrop-blur-sm"
											: "bg-orange-100/80 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 backdrop-blur-sm"
									}`}>
									<action.icon size={16} />
								</div>
								<p
									className={`text-sm font-medium transition-colors duration-300 ${
										theme === "dark" ? "text-white" : "text-black"
									}`}>
									{action.name}
								</p>
							</button>
						))}
					</div>
				</motion.div>
			</div>

			{/* Calendar Section */}
			<motion.div
				className={`p-6 rounded-xl border transition-all duration-300 hover:scale-[1.02] ${
					theme === "dark"
						? "bg-gray-900/30 backdrop-blur-2xl border-gray-700/50 shadow-2xl hover:shadow-3xl hover:border-gray-600/70"
						: "bg-white/40 backdrop-blur-2xl border-gray-200/60 shadow-2xl hover:shadow-3xl hover:border-gray-300/80"
				}`}
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.5 }}>
				<div className='flex items-center justify-between mb-6'>
					<h3
						className={`text-lg font-semibold transition-colors duration-300 ${
							theme === "dark" ? "text-white" : "text-black"
						}`}>
						Upcoming Events
					</h3>
					<Calendar
						size={20}
						className={theme === "dark" ? "text-gray-400" : "text-gray-600"}
					/>
				</div>
				<div
					className={`text-center py-8 transition-colors duration-300 ${
						theme === "dark" ? "text-gray-400" : "text-gray-600"
					}`}>
					<Calendar size={48} className='mx-auto mb-4 opacity-50' />
					<p className='text-lg font-medium'>No upcoming events</p>
					<p className='text-sm'>Your calendar is clear for now</p>
				</div>
			</motion.div>

			{/* View Feedback Modal */}
			<Modal
				isOpen={!!viewingFeedbackId}
				onClose={() => setViewingFeedbackId(null)}
				title='Feedback Details'
				size='md'>
				{!viewingFeedback ? (
					<div className='p-4 text-sm'>Loading...</div>
				) : (
					<div className='space-y-3 text-sm'>
						<div>
							<span className='font-semibold'>Title:</span>{" "}
							{viewingFeedback.title}
						</div>
						<div>
							<span className='font-semibold'>Category:</span>{" "}
							{viewingFeedback.category}
						</div>
						<div>
							<span className='font-semibold'>Content:</span>
							<p className='mt-1 whitespace-pre-wrap'>
								{viewingFeedback.content}
							</p>
						</div>
						<div className='text-xs text-gray-500'>
							<span>
								Created: {new Date(viewingFeedback.createdAt).toLocaleString()}
							</span>
							<br />
							<span>
								Updated: {new Date(viewingFeedback.updatedAt).toLocaleString()}
							</span>
						</div>
					</div>
				)}
			</Modal>
		</div>
	);
};

export default Dashboard;
