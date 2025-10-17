/** @format */

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
	Users,
	Search,
	Filter,
	Eye,
	Trash2,
	CheckCircle,
	XCircle,
	Clock,
	Mail,
	Phone,
	Calendar,
	GraduationCap,
	Briefcase,
	ExternalLink,
	UserPlus,
} from "lucide-react";
import { useTheme } from "../../shared/contexts/ThemeContext";
import {
	useGetApplicants,
	useUpdateApplicant,
	useDeleteApplicant,
	Applicant,
} from "../../shared/services/applicationService";
import Modal from "../../shared/components/Modal";

const DashBoard_Applicants: React.FC = () => {
	const { theme } = useTheme();
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState<
		"all" | "pending" | "approved" | "rejected"
	>("all");
	const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(
		null
	);
	const [isViewModalOpen, setIsViewModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [applicantToDelete, setApplicantToDelete] = useState<Applicant | null>(
		null
	);

	const { data: applicants = [], isLoading } = useGetApplicants();
	const updateApplicantMutation = useUpdateApplicant();
	const deleteApplicantMutation = useDeleteApplicant();

	// Filter and search applicants
	const filteredApplicants = applicants.filter((applicant) => {
		const matchesSearch =
			applicant.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			applicant.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			applicant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
			applicant.selectedTeam.toLowerCase().includes(searchTerm.toLowerCase());

		const matchesStatus =
			statusFilter === "all" || applicant.status === statusFilter;

		return matchesSearch && matchesStatus;
	});

	// Statistics
	const stats = {
		total: applicants.length,
		pending: applicants.filter((app) => app.status === "pending" || !app.status)
			.length,
		approved: applicants.filter((app) => app.status === "approved").length,
		rejected: applicants.filter((app) => app.status === "rejected").length,
	};

	const handleViewApplicant = (applicant: Applicant) => {
		setSelectedApplicant(applicant);
		setIsViewModalOpen(true);
	};

	const handleDeleteApplicant = (applicant: Applicant) => {
		setApplicantToDelete(applicant);
		setIsDeleteModalOpen(true);
	};

	const handleStatusUpdate = (
		applicantId: string,
		status: "approved" | "rejected"
	) => {
		updateApplicantMutation.mutate({
			id: applicantId,
			data: { status },
		});
	};

	const handleDeleteConfirm = () => {
		if (applicantToDelete) {
			deleteApplicantMutation.mutate(applicantToDelete._id);
			setIsDeleteModalOpen(false);
			setApplicantToDelete(null);
		}
	};

	const getStatusColor = (status?: string) => {
		switch (status) {
			case "approved":
				return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30";
			case "rejected":
				return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30";
			default:
				return "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30";
		}
	};

	const getStatusIcon = (status?: string) => {
		switch (status) {
			case "approved":
				return <CheckCircle size={16} />;
			case "rejected":
				return <XCircle size={16} />;
			default:
				return <Clock size={16} />;
		}
	};

	const getStatusText = (status?: string) => {
		switch (status) {
			case "approved":
				return "Approved";
			case "rejected":
				return "Rejected";
			default:
				return "Pending";
		}
	};

	return (
		<div className='space-y-6'>
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}>
				<div className='flex items-center justify-between'>
					<div>
						<h1
							className={`text-3xl font-bold transition-colors duration-300 ${
								theme === "dark" ? "text-white" : "text-black"
							}`}>
							Applicants Management
						</h1>
						<p
							className={`mt-2 text-lg transition-colors duration-300 ${
								theme === "dark" ? "text-gray-400" : "text-gray-600"
							}`}>
							Manage and review job applications
						</p>
					</div>
					<div className='flex items-center space-x-2'>
						<UserPlus
							size={24}
							className={theme === "dark" ? "text-gray-400" : "text-gray-600"}
						/>
					</div>
				</div>
			</motion.div>

			{/* Stats Grid */}
			<motion.div
				className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.1 }}>
				{[
					{
						name: "Total Applicants",
						value: stats.total,
						icon: Users,
						color: "blue",
					},
					{
						name: "Pending Review",
						value: stats.pending,
						icon: Clock,
						color: "yellow",
					},
					{
						name: "Approved",
						value: stats.approved,
						icon: CheckCircle,
						color: "green",
					},
					{
						name: "Rejected",
						value: stats.rejected,
						icon: XCircle,
						color: "red",
					},
				].map((stat, index) => (
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
									stat.color === "blue"
										? "bg-blue-600/30 backdrop-blur-sm"
										: stat.color === "yellow"
										? "bg-yellow-600/30 backdrop-blur-sm"
										: stat.color === "green"
										? "bg-green-600/30 backdrop-blur-sm"
										: "bg-red-600/30 backdrop-blur-sm"
								}`}>
								<stat.icon
									size={24}
									className={
										stat.color === "blue"
											? "text-blue-400"
											: stat.color === "yellow"
											? "text-yellow-400"
											: stat.color === "green"
											? "text-green-400"
											: "text-red-400"
									}
								/>
							</div>
						</div>
					</motion.div>
				))}
			</motion.div>

			{/* Filters and Search */}
			<motion.div
				className={`p-6 rounded-xl border transition-all duration-300 ${
					theme === "dark"
						? "bg-gray-900/30 backdrop-blur-2xl border-gray-700/50 shadow-2xl"
						: "bg-white/40 backdrop-blur-2xl border-gray-200/60 shadow-2xl"
				}`}
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.2 }}>
				<div className='flex flex-col sm:flex-row gap-4'>
					{/* Search */}
					<div className='flex-1 relative'>
						<Search
							size={20}
							className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
								theme === "dark" ? "text-gray-400" : "text-gray-500"
							}`}
						/>
						<input
							type='text'
							placeholder='Search applicants...'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2 ${
								theme === "dark"
									? "bg-gray-800/60 border-gray-700/50 text-white placeholder-gray-400 focus:ring-blue-500/50 focus:border-blue-500/50"
									: "bg-white/60 border-gray-200/60 text-black placeholder-gray-500 focus:ring-blue-500/50 focus:border-blue-500/50"
							}`}
						/>
					</div>

					{/* Status Filter */}
					<div className='flex items-center space-x-2'>
						<Filter
							size={20}
							className={theme === "dark" ? "text-gray-400" : "text-gray-500"}
						/>
						<select
							value={statusFilter}
							onChange={(e) => setStatusFilter(e.target.value as any)}
							className={`px-4 py-3 rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2 ${
								theme === "dark"
									? "bg-gray-800/60 border-gray-700/50 text-white focus:ring-blue-500/50 focus:border-blue-500/50"
									: "bg-white/60 border-gray-200/60 text-black focus:ring-blue-500/50 focus:border-blue-500/50"
							}`}>
							<option value='all'>All Status</option>
							<option value='pending'>Pending</option>
							<option value='approved'>Approved</option>
							<option value='rejected'>Rejected</option>
						</select>
					</div>
				</div>
			</motion.div>

			{/* Applicants Table */}
			<motion.div
				className={`rounded-xl border transition-all duration-300 ${
					theme === "dark"
						? "bg-gray-900/30 backdrop-blur-2xl border-gray-700/50 shadow-2xl"
						: "bg-white/40 backdrop-blur-2xl border-gray-200/60 shadow-2xl"
				}`}
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.3 }}>
				{isLoading ? (
					<div className='p-8 text-center'>
						<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto'></div>
						<p
							className={`mt-2 text-sm transition-colors duration-300 ${
								theme === "dark" ? "text-gray-400" : "text-gray-600"
							}`}>
							Loading applicants...
						</p>
					</div>
				) : filteredApplicants.length === 0 ? (
					<div className='p-8 text-center'>
						<Users
							size={48}
							className={`mx-auto mb-4 opacity-50 ${
								theme === "dark" ? "text-gray-400" : "text-gray-500"
							}`}
						/>
						<p
							className={`text-lg font-medium transition-colors duration-300 ${
								theme === "dark" ? "text-gray-400" : "text-gray-600"
							}`}>
							No applicants found
						</p>
						<p
							className={`text-sm transition-colors duration-300 ${
								theme === "dark" ? "text-gray-500" : "text-gray-500"
							}`}>
							{searchTerm || statusFilter !== "all"
								? "Try adjusting your search or filter criteria"
								: "No applications have been submitted yet"}
						</p>
					</div>
				) : (
					<div className='overflow-x-auto'>
						<table className='w-full'>
							<thead>
								<tr
									className={`border-b transition-colors duration-300 ${
										theme === "dark"
											? "border-gray-700/50"
											: "border-gray-200/60"
									}`}>
									<th
										className={`px-6 py-4 text-left text-sm font-medium transition-colors duration-300 ${
											theme === "dark" ? "text-gray-300" : "text-gray-700"
										}`}>
										Applicant
									</th>
									<th
										className={`px-6 py-4 text-left text-sm font-medium transition-colors duration-300 ${
											theme === "dark" ? "text-gray-300" : "text-gray-700"
										}`}>
										Team
									</th>
									<th
										className={`px-6 py-4 text-left text-sm font-medium transition-colors duration-300 ${
											theme === "dark" ? "text-gray-300" : "text-gray-700"
										}`}>
										Status
									</th>
									<th
										className={`px-6 py-4 text-left text-sm font-medium transition-colors duration-300 ${
											theme === "dark" ? "text-gray-300" : "text-gray-700"
										}`}>
										Applied
									</th>
									<th
										className={`px-6 py-4 text-right text-sm font-medium transition-colors duration-300 ${
											theme === "dark" ? "text-gray-300" : "text-gray-700"
										}`}>
										Actions
									</th>
								</tr>
							</thead>
							<tbody className='divide-y divide-gray-200/60 dark:divide-gray-700/50'>
								{filteredApplicants.map((applicant) => (
									<tr
										key={applicant._id}
										className={`transition-colors duration-300 hover:${
											theme === "dark" ? "bg-gray-800/30" : "bg-gray-50/50"
										}`}>
										<td className='px-6 py-4'>
											<div className='flex items-center space-x-3'>
												<div
													className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
														theme === "dark"
															? "bg-gray-800/60 text-gray-300"
															: "bg-gray-100/80 text-gray-700"
													}`}>
													{applicant.firstName[0]}
													{applicant.lastName[0]}
												</div>
												<div>
													<p
														className={`text-sm font-medium transition-colors duration-300 ${
															theme === "dark" ? "text-white" : "text-black"
														}`}>
														{applicant.firstName} {applicant.lastName}
													</p>
													<p
														className={`text-xs transition-colors duration-300 ${
															theme === "dark"
																? "text-gray-400"
																: "text-gray-600"
														}`}>
														{applicant.email}
													</p>
												</div>
											</div>
										</td>
										<td className='px-6 py-4'>
											<span
												className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
													theme === "dark"
														? "bg-blue-900/30 text-blue-300"
														: "bg-blue-100/80 text-blue-700"
												}`}>
												{applicant.selectedTeam}
											</span>
										</td>
										<td className='px-6 py-4'>
											<span
												className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
													applicant.status
												)}`}>
												{getStatusIcon(applicant.status)}
												<span className='ml-1'>
													{getStatusText(applicant.status)}
												</span>
											</span>
										</td>
										<td className='px-6 py-4'>
											<p
												className={`text-sm transition-colors duration-300 ${
													theme === "dark" ? "text-gray-400" : "text-gray-600"
												}`}>
												{new Date(applicant.createdAt).toLocaleDateString()}
											</p>
										</td>
										<td className='px-6 py-4 text-right'>
											<div className='flex items-center justify-end space-x-2'>
												<button
													onClick={() => handleViewApplicant(applicant)}
													className={`p-2 rounded-lg transition-all duration-300 hover:scale-105 ${
														theme === "dark"
															? "hover:bg-gray-800/60 text-gray-400 hover:text-white"
															: "hover:bg-gray-100/80 text-gray-600 hover:text-black"
													}`}
													title='View Details'>
													<Eye size={16} />
												</button>
												{applicant.status !== "approved" && (
													<button
														onClick={() =>
															handleStatusUpdate(applicant._id, "approved")
														}
														className={`p-2 rounded-lg transition-all duration-300 hover:scale-105 ${
															theme === "dark"
																? "hover:bg-green-900/30 text-green-400 hover:text-green-300"
																: "hover:bg-green-100/80 text-green-600 hover:text-green-700"
														}`}
														title='Approve'>
														<CheckCircle size={16} />
													</button>
												)}
												{applicant.status !== "rejected" && (
													<button
														onClick={() =>
															handleStatusUpdate(applicant._id, "rejected")
														}
														className={`p-2 rounded-lg transition-all duration-300 hover:scale-105 ${
															theme === "dark"
																? "hover:bg-red-900/30 text-red-400 hover:text-red-300"
																: "hover:bg-red-100/80 text-red-600 hover:text-red-700"
														}`}
														title='Reject'>
														<XCircle size={16} />
													</button>
												)}
												<button
													onClick={() => handleDeleteApplicant(applicant)}
													className={`p-2 rounded-lg transition-all duration-300 hover:scale-105 ${
														theme === "dark"
															? "hover:bg-red-900/30 text-red-400 hover:text-red-300"
															: "hover:bg-red-100/80 text-red-600 hover:text-red-700"
													}`}
													title='Delete'>
													<Trash2 size={16} />
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</motion.div>

			{/* View Applicant Modal */}
			<Modal
				isOpen={isViewModalOpen}
				onClose={() => setIsViewModalOpen(false)}
				title='Applicant Details'
				size='lg'>
				{selectedApplicant && (
					<div className='space-y-6'>
						{/* Basic Info */}
						<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
							<div>
								<h3
									className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
										theme === "dark" ? "text-white" : "text-black"
									}`}>
									Personal Information
								</h3>
								<div className='space-y-3'>
									<div className='flex items-center space-x-3'>
										<Users
											size={16}
											className={
												theme === "dark" ? "text-gray-400" : "text-gray-600"
											}
										/>
										<span
											className={`text-sm transition-colors duration-300 ${
												theme === "dark" ? "text-gray-300" : "text-gray-700"
											}`}>
											{selectedApplicant.firstName} {selectedApplicant.lastName}
										</span>
									</div>
									<div className='flex items-center space-x-3'>
										<Mail
											size={16}
											className={
												theme === "dark" ? "text-gray-400" : "text-gray-600"
											}
										/>
										<span
											className={`text-sm transition-colors duration-300 ${
												theme === "dark" ? "text-gray-300" : "text-gray-700"
											}`}>
											{selectedApplicant.email}
										</span>
									</div>
									<div className='flex items-center space-x-3'>
										<Phone
											size={16}
											className={
												theme === "dark" ? "text-gray-400" : "text-gray-600"
											}
										/>
										<span
											className={`text-sm transition-colors duration-300 ${
												theme === "dark" ? "text-gray-300" : "text-gray-700"
											}`}>
											{selectedApplicant.phone}
										</span>
									</div>
									<div className='flex items-center space-x-3'>
										<Calendar
											size={16}
											className={
												theme === "dark" ? "text-gray-400" : "text-gray-600"
											}
										/>
										<span
											className={`text-sm transition-colors duration-300 ${
												theme === "dark" ? "text-gray-300" : "text-gray-700"
											}`}>
											{new Date(
												selectedApplicant.dateOfBirth
											).toLocaleDateString()}
										</span>
									</div>
								</div>
							</div>

							<div>
								<h3
									className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
										theme === "dark" ? "text-white" : "text-black"
									}`}>
									Academic Information
								</h3>
								<div className='space-y-3'>
									<div className='flex items-center space-x-3'>
										<GraduationCap
											size={16}
											className={
												theme === "dark" ? "text-gray-400" : "text-gray-600"
											}
										/>
										<span
											className={`text-sm transition-colors duration-300 ${
												theme === "dark" ? "text-gray-300" : "text-gray-700"
											}`}>
											{selectedApplicant.faculty}
										</span>
									</div>
									<div className='flex items-center space-x-3'>
										<Briefcase
											size={16}
											className={
												theme === "dark" ? "text-gray-400" : "text-gray-600"
											}
										/>
										<span
											className={`text-sm transition-colors duration-300 ${
												theme === "dark" ? "text-gray-300" : "text-gray-700"
											}`}>
											{selectedApplicant.academicYear}
										</span>
									</div>
									<div className='flex items-center space-x-3'>
										<Users
											size={16}
											className={
												theme === "dark" ? "text-gray-400" : "text-gray-600"
											}
										/>
										<span
											className={`text-sm transition-colors duration-300 ${
												theme === "dark" ? "text-gray-300" : "text-gray-700"
											}`}>
											{selectedApplicant.selectedTeam}
										</span>
									</div>
								</div>
							</div>
						</div>

						{/* Skills */}
						<div>
							<h3
								className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
									theme === "dark" ? "text-white" : "text-black"
								}`}>
								Skills
							</h3>
							<div className='flex flex-wrap gap-2'>
								{selectedApplicant.skills.map((skill, index) => (
									<span
										key={index}
										className={`px-3 py-1 rounded-full text-xs font-medium ${
											theme === "dark"
												? "bg-blue-900/30 text-blue-300"
												: "bg-blue-100/80 text-blue-700"
										}`}>
										{skill}
									</span>
								))}
							</div>
						</div>

						{/* Experience */}
						{selectedApplicant.relevantExperience && (
							<div>
								<h3
									className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
										theme === "dark" ? "text-white" : "text-black"
									}`}>
									Relevant Experience
								</h3>
								<p
									className={`text-sm transition-colors duration-300 ${
										theme === "dark" ? "text-gray-300" : "text-gray-700"
									}`}>
									{selectedApplicant.relevantExperience}
								</p>
							</div>
						)}

						{/* Social Links */}
						{selectedApplicant.socialLinks &&
							selectedApplicant.socialLinks.length > 0 && (
								<div>
									<h3
										className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
											theme === "dark" ? "text-white" : "text-black"
										}`}>
										Social Links
									</h3>
									<div className='space-y-2'>
										{selectedApplicant.socialLinks.map((link, index) => (
											<a
												key={index}
												href={link}
												target='_blank'
												rel='noopener noreferrer'
												className={`inline-flex items-center space-x-2 text-sm transition-colors duration-300 hover:underline ${
													theme === "dark"
														? "text-blue-400 hover:text-blue-300"
														: "text-blue-600 hover:text-blue-700"
												}`}>
												<ExternalLink size={14} />
												<span>{link}</span>
											</a>
										))}
									</div>
								</div>
							)}
					</div>
				)}
			</Modal>

			{/* Delete Confirmation Modal */}
			<Modal
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				title='Delete Applicant'
				size='sm'>
				{applicantToDelete && (
					<div className='space-y-4'>
						<p
							className={`text-sm transition-colors duration-300 ${
								theme === "dark" ? "text-gray-300" : "text-gray-700"
							}`}>
							Are you sure you want to delete the application for{" "}
							<strong>
								{applicantToDelete.firstName} {applicantToDelete.lastName}
							</strong>
							? This action cannot be undone.
						</p>
						<div className='flex justify-end space-x-3'>
							<button
								onClick={() => setIsDeleteModalOpen(false)}
								className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
									theme === "dark"
										? "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
										: "bg-gray-200/60 text-gray-700 hover:bg-gray-300/60"
								}`}>
								Cancel
							</button>
							<button
								onClick={handleDeleteConfirm}
								disabled={deleteApplicantMutation.isPending}
								className='px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300'>
								{deleteApplicantMutation.isPending ? "Deleting..." : "Delete"}
							</button>
						</div>
					</div>
				)}
			</Modal>
		</div>
	);
};

export default DashBoard_Applicants;
