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
	BarChart3,
	Download,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";
import { useTheme } from "../../shared/contexts/ThemeContext";
import {
	useGetApplicants,
	useUpdateApplicant,
	useDeleteApplicant,
	Applicant,
} from "../../shared/services/applicationService";
import Modal from "../../shared/components/Modal";
import { Link } from "react-router-dom";

const DashBoard_Applicants: React.FC = () => {
	const { theme } = useTheme();
	const [searchTerm, setSearchTerm] = useState("");
	const [teamFilter, setTeamFilter] = useState<string>("all");
	const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(
		null
	);
	const [isViewModalOpen, setIsViewModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [applicantToDelete, setApplicantToDelete] = useState<Applicant | null>(
		null
	);
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 30;

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

		const matchesTeam =
			teamFilter === "all" || applicant.selectedTeam === teamFilter;

		return matchesSearch && matchesTeam;
	});

	// Pagination logic
	const totalPages = Math.ceil(filteredApplicants.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const paginatedApplicants = filteredApplicants.slice(startIndex, endIndex);

	// Reset to first page when filters change
	React.useEffect(() => {
		setCurrentPage(1);
	}, [searchTerm, teamFilter]);

	// Statistics
	const stats = {
		total: applicants.length,
		pending: applicants.filter((app) => app.status === "pending" || !app.status)
			.length,
		approved: applicants.filter((app) => app.status === "approved").length,
		rejected: applicants.filter((app) => app.status === "rejected").length,
	};

	// Get unique teams for filter
	const uniqueTeams = Array.from(
		new Set(applicants.map((app) => app.selectedTeam))
	).sort();

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

	// Pagination handlers
	const handlePageChange = (page: number) => {
		setCurrentPage(page);
		// Scroll to top when page changes
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const handlePreviousPage = () => {
		if (currentPage > 1) {
			handlePageChange(currentPage - 1);
		}
	};

	const handleNextPage = () => {
		if (currentPage < totalPages) {
			handlePageChange(currentPage + 1);
		}
	};

	// CSV Download functionality with Arabic data support
	const downloadCSV = () => {
		const csvData = filteredApplicants.map((applicant) => ({
			"First Name": applicant.firstName,
			"Last Name": applicant.lastName,
			Email: applicant.email,
			Phone: applicant.phone,
			Gender: applicant.gender,
			Faculty: applicant.faculty,
			"Academic Year": applicant.academicYear,
			"Selected Team": applicant.selectedTeam,
			Skills: applicant.skills.join(", "),
			"Relevant Experience": applicant.relevantExperience || "",
			Facebook: applicant.facebook || "",
			Instagram: applicant.instagram || "",
			LinkedIn: applicant.linkedin || "",
			"Date of Birth": new Date(applicant.dateOfBirth).toLocaleDateString(
				"ar-EG",
				{
					year: "numeric",
					month: "2-digit",
					day: "2-digit",
				}
			),
			Status: getStatusText(applicant.status),
			"Applied Date": new Date(applicant.createdAt).toLocaleDateString(
				"ar-EG",
				{
					year: "numeric",
					month: "2-digit",
					day: "2-digit",
				}
			),
		}));

		// Convert to CSV string with proper Arabic text support
		const headers = Object.keys(csvData[0] || {});
		const csvContent = [
			headers.join(","),
			...csvData.map((row) =>
				headers
					.map((header) => {
						const value = row[header as keyof typeof row];
						// Escape commas, quotes, and newlines in CSV, handle Arabic text properly
						return typeof value === "string" &&
							(value.includes(",") ||
								value.includes('"') ||
								value.includes("\n") ||
								value.includes("\r"))
							? `"${value.replace(/"/g, '""')}"`
							: value;
					})
					.join(",")
			),
		].join("\n");

		// Add UTF-8 BOM for proper Arabic text support in Excel
		const BOM = "\uFEFF";
		const csvWithBOM = BOM + csvContent;

		// Create and download file with proper UTF-8 encoding
		const blob = new Blob([csvWithBOM], { type: "text/csv;charset=utf-8;" });
		const link = document.createElement("a");
		const url = URL.createObjectURL(blob);
		link.setAttribute("href", url);
		link.setAttribute(
			"download",
			`applicants_${new Date().toISOString().split("T")[0]}.csv`
		);
		link.style.visibility = "hidden";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	return (
		<div className='space-y-4 sm:space-y-6 p-3 sm:p-4 lg:p-6 xl:p-8'>
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}>
				<div className='flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0'>
					<div className='flex-1'>
						<h1
							className={`text-2xl sm:text-3xl font-bold transition-colors duration-300 ${
								theme === "dark" ? "text-white" : "text-black"
							}`}>
							Applicants Management
						</h1>
						<p
							className={`mt-1 sm:mt-2 text-sm sm:text-lg transition-colors duration-300 ${
								theme === "dark" ? "text-gray-400" : "text-gray-600"
							}`}>
							Manage and review job applications • Showing 30 per page
						</p>
					</div>
					<div className='flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3'>
						<button
							onClick={downloadCSV}
							disabled={filteredApplicants.length === 0}
							className={`inline-flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base ${
								theme === "dark"
									? "bg-green-600/20 text-green-400 hover:bg-green-600/30 hover:text-green-300 border border-green-500/30"
									: "bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 border border-green-200"
							}`}
							title={
								filteredApplicants.length === 0
									? "No applicants to download"
									: `Download all ${filteredApplicants.length} filtered applicants`
							}>
							<Download size={16} className='sm:w-[18px] sm:h-[18px]' />
							<span className='hidden xs:inline'>Download CSV</span>
							<span className='xs:hidden'>CSV</span>
						</button>
						<Link
							to='/dashboard/applicants/analytics'
							className={`inline-flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 text-sm sm:text-base ${
								theme === "dark"
									? "bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 hover:text-blue-300 border border-blue-500/30"
									: "bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 border border-blue-200"
							}`}>
							<BarChart3 size={16} className='sm:w-[18px] sm:h-[18px]' />
							<span className='hidden xs:inline'>Analytics</span>
							<span className='xs:hidden'>Stats</span>
						</Link>
						<div className='flex justify-center sm:justify-start'>
							<UserPlus
								size={20}
								className={`sm:w-6 sm:h-6 ${
									theme === "dark" ? "text-gray-400" : "text-gray-600"
								}`}
							/>
						</div>
					</div>
				</div>
			</motion.div>

			{/* Total Applicants Stats */}
			<motion.div
				className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.1 }}>
				{/* Total Applicants */}
				<motion.div
					className={`p-4 sm:p-6 rounded-xl border transition-all duration-300 hover:scale-105 ${
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
								className={`text-xs sm:text-sm font-medium transition-colors duration-300 ${
									theme === "dark" ? "text-gray-400" : "text-gray-600"
								}`}>
								Total Applicants
							</p>
							<p
								className={`text-xl sm:text-2xl font-bold mt-1 transition-colors duration-300 ${
									theme === "dark" ? "text-white" : "text-black"
								}`}>
								{stats.total}
							</p>
						</div>
						<div className='p-2 sm:p-3 rounded-xl transition-all duration-300 bg-blue-600/30 backdrop-blur-sm'>
							<Users size={20} className='text-blue-400 sm:w-6 sm:h-6' />
						</div>
					</div>
				</motion.div>

				{/* Pending Applicants */}
				<motion.div
					className={`p-4 sm:p-6 rounded-xl border transition-all duration-300 hover:scale-105 ${
						theme === "dark"
							? "bg-gray-900/30 backdrop-blur-2xl border-gray-700/50 shadow-2xl hover:shadow-3xl hover:border-gray-600/70"
							: "bg-white/40 backdrop-blur-2xl border-gray-200/60 shadow-2xl hover:shadow-3xl hover:border-gray-300/80"
					}`}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.15 }}>
					<div className='flex items-center justify-between'>
						<div>
							<p
								className={`text-xs sm:text-sm font-medium transition-colors duration-300 ${
									theme === "dark" ? "text-gray-400" : "text-gray-600"
								}`}>
								Pending
							</p>
							<p
								className={`text-xl sm:text-2xl font-bold mt-1 transition-colors duration-300 ${
									theme === "dark" ? "text-white" : "text-black"
								}`}>
								{stats.pending}
							</p>
						</div>
						<div className='p-2 sm:p-3 rounded-xl transition-all duration-300 bg-yellow-600/30 backdrop-blur-sm'>
							<Clock size={20} className='text-yellow-400 sm:w-6 sm:h-6' />
						</div>
					</div>
				</motion.div>

				{/* Approved Applicants */}
				<motion.div
					className={`p-4 sm:p-6 rounded-xl border transition-all duration-300 hover:scale-105 ${
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
								className={`text-xs sm:text-sm font-medium transition-colors duration-300 ${
									theme === "dark" ? "text-gray-400" : "text-gray-600"
								}`}>
								Approved
							</p>
							<p
								className={`text-xl sm:text-2xl font-bold mt-1 transition-colors duration-300 ${
									theme === "dark" ? "text-white" : "text-black"
								}`}>
								{stats.approved}
							</p>
						</div>
						<div className='p-2 sm:p-3 rounded-xl transition-all duration-300 bg-green-600/30 backdrop-blur-sm'>
							<CheckCircle size={20} className='text-green-400 sm:w-6 sm:h-6' />
						</div>
					</div>
				</motion.div>

				{/* Rejected Applicants */}
				<motion.div
					className={`p-4 sm:p-6 rounded-xl border transition-all duration-300 hover:scale-105 ${
						theme === "dark"
							? "bg-gray-900/30 backdrop-blur-2xl border-gray-700/50 shadow-2xl hover:shadow-3xl hover:border-gray-600/70"
							: "bg-white/40 backdrop-blur-2xl border-gray-200/60 shadow-2xl hover:shadow-3xl hover:border-gray-300/80"
					}`}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.25 }}>
					<div className='flex items-center justify-between'>
						<div>
							<p
								className={`text-xs sm:text-sm font-medium transition-colors duration-300 ${
									theme === "dark" ? "text-gray-400" : "text-gray-600"
								}`}>
								Rejected
							</p>
							<p
								className={`text-xl sm:text-2xl font-bold mt-1 transition-colors duration-300 ${
									theme === "dark" ? "text-white" : "text-black"
								}`}>
								{stats.rejected}
							</p>
						</div>
						<div className='p-2 sm:p-3 rounded-xl transition-all duration-300 bg-red-600/30 backdrop-blur-sm'>
							<XCircle size={20} className='text-red-400 sm:w-6 sm:h-6' />
						</div>
					</div>
				</motion.div>
			</motion.div>

			{/* Filters and Search */}
			<motion.div
				className={`p-4 sm:p-6 rounded-xl border transition-all duration-300 ${
					theme === "dark"
						? "bg-gray-900/30 backdrop-blur-2xl border-gray-700/50 shadow-2xl"
						: "bg-white/40 backdrop-blur-2xl border-gray-200/60 shadow-2xl"
				}`}
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.2 }}>
				<div className='flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:gap-4'>
					{/* Search */}
					<div className='flex-1 relative'>
						<Search
							size={18}
							className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
								theme === "dark" ? "text-gray-400" : "text-gray-500"
							} sm:w-5 sm:h-5`}
						/>
						<input
							type='text'
							placeholder='Search applicants...'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className={`w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2 text-sm sm:text-base ${
								theme === "dark"
									? "bg-gray-800/60 border-gray-700/50 text-white placeholder-gray-400 focus:ring-blue-500/50 focus:border-blue-500/50"
									: "bg-white/60 border-gray-200/60 text-black placeholder-gray-500 focus:ring-blue-500/50 focus:border-blue-500/50"
							}`}
						/>
					</div>

					{/* Team Filter */}
					<div className='flex items-center space-x-2'>
						<Filter
							size={18}
							className={`${
								theme === "dark" ? "text-gray-400" : "text-gray-500"
							} sm:w-5 sm:h-5`}
						/>
						<select
							value={teamFilter}
							onChange={(e) => setTeamFilter(e.target.value)}
							className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2 text-sm sm:text-base min-w-0 flex-1 sm:flex-none ${
								theme === "dark"
									? "bg-gray-800/60 border-gray-700/50 text-white focus:ring-blue-500/50 focus:border-blue-500/50"
									: "bg-white/60 border-gray-200/60 text-black focus:ring-blue-500/50 focus:border-blue-500/50"
							}`}>
							<option value='all'>All Teams</option>
							{uniqueTeams.map((team) => (
								<option key={team} value={team}>
									{team}
								</option>
							))}
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
				) : paginatedApplicants.length === 0 ? (
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
							{searchTerm || teamFilter !== "all"
								? "Try adjusting your search or filter criteria"
								: "No applications have been submitted yet"}
						</p>
					</div>
				) : (
					<div className='overflow-x-auto'>
						<table className='w-full min-w-[600px]'>
							<thead>
								<tr
									className={`border-b transition-colors duration-300 ${
										theme === "dark"
											? "border-gray-700/50"
											: "border-gray-200/60"
									}`}>
									<th
										className={`px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium transition-colors duration-300 ${
											theme === "dark" ? "text-gray-300" : "text-gray-700"
										}`}>
										Applicant
									</th>
									<th
										className={`px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium transition-colors duration-300 ${
											theme === "dark" ? "text-gray-300" : "text-gray-700"
										}`}>
										Team
									</th>
									<th
										className={`px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium transition-colors duration-300 ${
											theme === "dark" ? "text-gray-300" : "text-gray-700"
										}`}>
										Status
									</th>
									<th
										className={`px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium transition-colors duration-300 ${
											theme === "dark" ? "text-gray-300" : "text-gray-700"
										}`}>
										Applied
									</th>
									<th
										className={`px-3 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm font-medium transition-colors duration-300 ${
											theme === "dark" ? "text-gray-300" : "text-gray-700"
										}`}>
										Actions
									</th>
								</tr>
							</thead>
							<tbody className='divide-y divide-gray-200/60 dark:divide-gray-700/50'>
								{paginatedApplicants.map((applicant) => (
									<tr
										key={applicant._id}
										className={`transition-colors duration-300 hover:${
											theme === "dark" ? "bg-gray-800/30" : "bg-gray-50/50"
										}`}>
										<td className='px-3 sm:px-6 py-3 sm:py-4'>
											<div className='flex items-center space-x-2 sm:space-x-3'>
												<div
													className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium ${
														theme === "dark"
															? "bg-gray-800/60 text-gray-300"
															: "bg-gray-100/80 text-gray-700"
													}`}>
													{applicant.firstName[0]}
													{applicant.lastName[0]}
												</div>
												<div className='min-w-0 flex-1'>
													<p
														className={`text-xs sm:text-sm font-medium transition-colors duration-300 truncate ${
															theme === "dark" ? "text-white" : "text-black"
														}`}>
														{applicant.firstName} {applicant.lastName}
													</p>
													<p
														className={`text-xs transition-colors duration-300 truncate ${
															theme === "dark"
																? "text-gray-400"
																: "text-gray-600"
														}`}>
														{applicant.email}
													</p>
												</div>
											</div>
										</td>
										<td className='px-3 sm:px-6 py-3 sm:py-4'>
											<span
												className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${
													theme === "dark"
														? "bg-blue-900/30 text-blue-300"
														: "bg-blue-100/80 text-blue-700"
												}`}>
												<span className='hidden sm:inline'>
													{applicant.selectedTeam}
												</span>
												<span className='sm:hidden'>
													{applicant.selectedTeam.split(" ")[0]}
												</span>
											</span>
										</td>
										<td className='px-3 sm:px-6 py-3 sm:py-4'>
											<span
												className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
													applicant.status
												)}`}>
												{getStatusIcon(applicant.status)}
												<span className='ml-1 hidden sm:inline'>
													{getStatusText(applicant.status)}
												</span>
											</span>
										</td>
										<td className='px-3 sm:px-6 py-3 sm:py-4'>
											<p
												className={`text-xs sm:text-sm transition-colors duration-300 ${
													theme === "dark" ? "text-gray-400" : "text-gray-600"
												}`}>
												<span className='hidden sm:inline'>
													{new Date(applicant.createdAt).toLocaleDateString()}
												</span>
												<span className='sm:hidden'>
													{new Date(applicant.createdAt).toLocaleDateString(
														"en-US",
														{
															month: "short",
															day: "numeric",
														}
													)}
												</span>
											</p>
										</td>
										<td className='px-3 sm:px-6 py-3 sm:py-4 text-right'>
											<div className='flex items-center justify-end space-x-1 sm:space-x-2'>
												<button
													onClick={() => handleViewApplicant(applicant)}
													className={`p-1.5 sm:p-2 rounded-lg transition-all duration-300 hover:scale-105 ${
														theme === "dark"
															? "hover:bg-gray-800/60 text-gray-400 hover:text-white"
															: "hover:bg-gray-100/80 text-gray-600 hover:text-black"
													}`}
													title='View Details'>
													<Eye size={14} className='sm:w-4 sm:h-4' />
												</button>
												<button
													onClick={() => handleDeleteApplicant(applicant)}
													className={`p-1.5 sm:p-2 rounded-lg transition-all duration-300 hover:scale-105 ${
														theme === "dark"
															? "hover:bg-red-900/30 text-red-400 hover:text-red-300"
															: "hover:bg-red-100/80 text-red-600 hover:text-red-700"
													}`}
													title='Delete'>
													<Trash2 size={14} className='sm:w-4 sm:h-4' />
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

			{/* Pagination Controls */}
			{totalPages > 1 && (
				<motion.div
					className={`p-4 sm:p-6 rounded-xl border transition-all duration-300 ${
						theme === "dark"
							? "bg-gray-900/30 backdrop-blur-2xl border-gray-700/50 shadow-2xl"
							: "bg-white/40 backdrop-blur-2xl border-gray-200/60 shadow-2xl"
					}`}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.4 }}>
					<div className='flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0'>
						{/* Results info */}
						<div className='text-center sm:text-left'>
							<p
								className={`text-xs sm:text-sm transition-colors duration-300 ${
									theme === "dark" ? "text-gray-400" : "text-gray-600"
								}`}>
								Showing {startIndex + 1} to{" "}
								{Math.min(endIndex, filteredApplicants.length)} of{" "}
								{filteredApplicants.length} results
							</p>
						</div>

						{/* Pagination controls */}
						<div className='flex items-center space-x-2'>
							{/* Previous button */}
							<button
								onClick={handlePreviousPage}
								disabled={currentPage === 1}
								className={`p-2 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
									theme === "dark"
										? "hover:bg-gray-800/60 text-gray-400 hover:text-white disabled:hover:bg-transparent"
										: "hover:bg-gray-100/80 text-gray-600 hover:text-black disabled:hover:bg-transparent"
								}`}>
								<ChevronLeft size={16} />
							</button>

							{/* Page numbers */}
							<div className='flex items-center space-x-1'>
								{/* Show first page if not in range */}
								{totalPages > 5 && currentPage > 3 && (
									<>
										<button
											onClick={() => handlePageChange(1)}
											className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
												theme === "dark"
													? "hover:bg-gray-800/60 text-gray-400 hover:text-white"
													: "hover:bg-gray-100/80 text-gray-600 hover:text-black"
											}`}>
											1
										</button>
										{currentPage > 4 && (
											<span
												className={`px-2 text-sm ${
													theme === "dark" ? "text-gray-500" : "text-gray-400"
												}`}>
												...
											</span>
										)}
									</>
								)}

								{Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
									let pageNumber;
									if (totalPages <= 5) {
										pageNumber = i + 1;
									} else if (currentPage <= 3) {
										pageNumber = i + 1;
									} else if (currentPage >= totalPages - 2) {
										pageNumber = totalPages - 4 + i;
									} else {
										pageNumber = currentPage - 2 + i;
									}

									return (
										<button
											key={pageNumber}
											onClick={() => handlePageChange(pageNumber)}
											className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
												currentPage === pageNumber
													? theme === "dark"
														? "bg-blue-600 text-white"
														: "bg-blue-600 text-white"
													: theme === "dark"
													? "hover:bg-gray-800/60 text-gray-400 hover:text-white"
													: "hover:bg-gray-100/80 text-gray-600 hover:text-black"
											}`}>
											{pageNumber}
										</button>
									);
								})}

								{/* Show last page if not in range */}
								{totalPages > 5 && currentPage < totalPages - 2 && (
									<>
										{currentPage < totalPages - 3 && (
											<span
												className={`px-2 text-sm ${
													theme === "dark" ? "text-gray-500" : "text-gray-400"
												}`}>
												...
											</span>
										)}
										<button
											onClick={() => handlePageChange(totalPages)}
											className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
												theme === "dark"
													? "hover:bg-gray-800/60 text-gray-400 hover:text-white"
													: "hover:bg-gray-100/80 text-gray-600 hover:text-black"
											}`}>
											{totalPages}
										</button>
									</>
								)}
							</div>

							{/* Next button */}
							<button
								onClick={handleNextPage}
								disabled={currentPage === totalPages}
								className={`p-2 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
									theme === "dark"
										? "hover:bg-gray-800/60 text-gray-400 hover:text-white disabled:hover:bg-transparent"
										: "hover:bg-gray-100/80 text-gray-600 hover:text-black disabled:hover:bg-transparent"
								}`}>
								<ChevronRight size={16} />
							</button>
						</div>
					</div>
				</motion.div>
			)}

			{/* View Applicant Modal */}
			<Modal
				isOpen={isViewModalOpen}
				onClose={() => setIsViewModalOpen(false)}
				title='Applicant Details'
				size='lg'>
				{selectedApplicant && (
					<div className='space-y-4 sm:space-y-6 max-h-[80vh] overflow-y-auto'>
						{/* Basic Info */}
						<div className='grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6'>
							<div>
								<h3
									className={`text-base sm:text-lg font-semibold mb-3 sm:mb-4 transition-colors duration-300 ${
										theme === "dark" ? "text-white" : "text-black"
									}`}>
									Personal Information
								</h3>
								<div className='space-y-2 sm:space-y-3'>
									<div className='flex items-center space-x-2 sm:space-x-3'>
										<Users
											size={14}
											className={`${
												theme === "dark" ? "text-gray-400" : "text-gray-600"
											} sm:w-4 sm:h-4`}
										/>
										<span
											className={`text-xs sm:text-sm transition-colors duration-300 ${
												theme === "dark" ? "text-gray-300" : "text-gray-700"
											}`}>
											{selectedApplicant.firstName} {selectedApplicant.lastName}
										</span>
									</div>
									<div className='flex items-center space-x-2 sm:space-x-3'>
										<Mail
											size={14}
											className={`${
												theme === "dark" ? "text-gray-400" : "text-gray-600"
											} sm:w-4 sm:h-4`}
										/>
										<span
											className={`text-xs sm:text-sm transition-colors duration-300 break-all ${
												theme === "dark" ? "text-gray-300" : "text-gray-700"
											}`}>
											{selectedApplicant.email}
										</span>
									</div>
									<div className='flex items-center space-x-2 sm:space-x-3'>
										<Phone
											size={14}
											className={`${
												theme === "dark" ? "text-gray-400" : "text-gray-600"
											} sm:w-4 sm:h-4`}
										/>
										<span
											className={`text-xs sm:text-sm transition-colors duration-300 ${
												theme === "dark" ? "text-gray-300" : "text-gray-700"
											}`}>
											{selectedApplicant.phone}
										</span>
									</div>
									<div className='flex items-center space-x-2 sm:space-x-3'>
										<Calendar
											size={14}
											className={`${
												theme === "dark" ? "text-gray-400" : "text-gray-600"
											} sm:w-4 sm:h-4`}
										/>
										<span
											className={`text-xs sm:text-sm transition-colors duration-300 ${
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
									className={`text-base sm:text-lg font-semibold mb-3 sm:mb-4 transition-colors duration-300 ${
										theme === "dark" ? "text-white" : "text-black"
									}`}>
									Academic Information
								</h3>
								<div className='space-y-2 sm:space-y-3'>
									<div className='flex items-center space-x-2 sm:space-x-3'>
										<GraduationCap
											size={14}
											className={`${
												theme === "dark" ? "text-gray-400" : "text-gray-600"
											} sm:w-4 sm:h-4`}
										/>
										<span
											className={`text-xs sm:text-sm transition-colors duration-300 ${
												theme === "dark" ? "text-gray-300" : "text-gray-700"
											}`}>
											{selectedApplicant.faculty}
										</span>
									</div>
									<div className='flex items-center space-x-2 sm:space-x-3'>
										<Briefcase
											size={14}
											className={`${
												theme === "dark" ? "text-gray-400" : "text-gray-600"
											} sm:w-4 sm:h-4`}
										/>
										<span
											className={`text-xs sm:text-sm transition-colors duration-300 ${
												theme === "dark" ? "text-gray-300" : "text-gray-700"
											}`}>
											{selectedApplicant.academicYear}
										</span>
									</div>
									<div className='flex items-center space-x-2 sm:space-x-3'>
										<Users
											size={14}
											className={`${
												theme === "dark" ? "text-gray-400" : "text-gray-600"
											} sm:w-4 sm:h-4`}
										/>
										<span
											className={`text-xs sm:text-sm transition-colors duration-300 ${
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
								className={`text-base sm:text-lg font-semibold mb-3 sm:mb-4 transition-colors duration-300 ${
									theme === "dark" ? "text-white" : "text-black"
								}`}>
								Skills
							</h3>
							<div className='flex flex-wrap gap-1.5 sm:gap-2'>
								{selectedApplicant.skills.map((skill, index) => (
									<span
										key={index}
										className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
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
									className={`text-base sm:text-lg font-semibold mb-3 sm:mb-4 transition-colors duration-300 ${
										theme === "dark" ? "text-white" : "text-black"
									}`}>
									Relevant Experience
								</h3>
								<p
									className={`text-xs sm:text-sm transition-colors duration-300 leading-relaxed ${
										theme === "dark" ? "text-gray-300" : "text-gray-700"
									}`}>
									{selectedApplicant.relevantExperience}
								</p>
							</div>
						)}

						{/* Social Links */}
						{(selectedApplicant.facebook ||
							selectedApplicant.instagram ||
							selectedApplicant.linkedin ||
							(selectedApplicant.otherSocialLinks &&
								selectedApplicant.otherSocialLinks.length > 0)) && (
							<div>
								<h3
									className={`text-base sm:text-lg font-semibold mb-3 sm:mb-4 transition-colors duration-300 ${
										theme === "dark" ? "text-white" : "text-black"
									}`}>
									Social Links
								</h3>
								<div className='space-y-2'>
									{selectedApplicant.facebook && (
										<a
											href={selectedApplicant.facebook}
											target='_blank'
											rel='noopener noreferrer'
											className={`inline-flex items-center space-x-2 text-xs sm:text-sm transition-colors duration-300 hover:underline break-all ${
												theme === "dark"
													? "text-blue-400 hover:text-blue-300"
													: "text-blue-600 hover:text-blue-700"
											}`}>
											<ExternalLink
												size={12}
												className='sm:w-3.5 sm:h-3.5 flex-shrink-0'
											/>
											<span className='truncate'>
												Facebook: {selectedApplicant.facebook}
											</span>
										</a>
									)}
									{selectedApplicant.instagram && (
										<a
											href={selectedApplicant.instagram}
											target='_blank'
											rel='noopener noreferrer'
											className={`inline-flex items-center space-x-2 text-xs sm:text-sm transition-colors duration-300 hover:underline break-all ${
												theme === "dark"
													? "text-blue-400 hover:text-blue-300"
													: "text-blue-600 hover:text-blue-700"
											}`}>
											<ExternalLink
												size={12}
												className='sm:w-3.5 sm:h-3.5 flex-shrink-0'
											/>
											<span className='truncate'>
												Instagram: {selectedApplicant.instagram}
											</span>
										</a>
									)}
									{selectedApplicant.linkedin && (
										<a
											href={selectedApplicant.linkedin}
											target='_blank'
											rel='noopener noreferrer'
											className={`inline-flex items-center space-x-2 text-xs sm:text-sm transition-colors duration-300 hover:underline break-all ${
												theme === "dark"
													? "text-blue-400 hover:text-blue-300"
													: "text-blue-600 hover:text-blue-700"
											}`}>
											<ExternalLink
												size={12}
												className='sm:w-3.5 sm:h-3.5 flex-shrink-0'
											/>
											<span className='truncate'>
												LinkedIn: {selectedApplicant.linkedin}
											</span>
										</a>
									)}
									{selectedApplicant.otherSocialLinks &&
										selectedApplicant.otherSocialLinks.map((link, index) => (
											<a
												key={index}
												href={link}
												target='_blank'
												rel='noopener noreferrer'
												className={`inline-flex items-center space-x-2 text-xs sm:text-sm transition-colors duration-300 hover:underline break-all ${
													theme === "dark"
														? "text-blue-400 hover:text-blue-300"
														: "text-blue-600 hover:text-blue-700"
												}`}>
												<ExternalLink
													size={12}
													className='sm:w-3.5 sm:h-3.5 flex-shrink-0'
												/>
												<span className='truncate'>{link}</span>
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
							className={`text-xs sm:text-sm transition-colors duration-300 leading-relaxed ${
								theme === "dark" ? "text-gray-300" : "text-gray-700"
							}`}>
							Are you sure you want to delete the application for{" "}
							<strong>
								{applicantToDelete.firstName} {applicantToDelete.lastName}
							</strong>
							? This action cannot be undone.
						</p>
						<div className='flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3'>
							<button
								onClick={() => setIsDeleteModalOpen(false)}
								className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${
									theme === "dark"
										? "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
										: "bg-gray-200/60 text-gray-700 hover:bg-gray-300/60"
								}`}>
								Cancel
							</button>
							<button
								onClick={handleDeleteConfirm}
								disabled={deleteApplicantMutation.isPending}
								className='px-4 py-2 rounded-lg text-xs sm:text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300'>
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
