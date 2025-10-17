/** @format */

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
	Users, 
	Plus, 
	Edit, 
	Trash2, 
	Search,
	Calendar,
	Eye
} from "lucide-react";
import { useTheme } from "../../../shared/contexts/ThemeContext";
import { useTeams, useCreateTeam, useUpdateTeam, useDeleteTeam } from "../../../shared/services/teamService";
import { GenericForm } from "../../../shared/components/Form/GenericForm";
import { teamSchema, updateTeamSchema } from "../../../shared/schemas/TeamSchema";
import { CreateTeamData, UpdateTeamData, Team } from "../../../shared/types/Team";
import PermissionGate from "../../../shared/Secure/PermissionGate";
import Permissions from "../../../shared/config/Permissions";
import { useNavigate } from "react-router-dom";


const Teams: React.FC = () => {
	const { theme } = useTheme();
	const navigate = useNavigate();
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);

	// React Query hooks
	const { data: teams, isLoading, error } = useTeams();
	const createTeamMutation = useCreateTeam();
	const updateTeamMutation = useUpdateTeam();
	const deleteTeamMutation = useDeleteTeam();

	// Filter teams based on search term
	const filteredTeams = (teams || []).filter(team =>
		team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
		team.description.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handleCreateTeam = async (data: CreateTeamData) => {
		try {
			await createTeamMutation.mutateAsync(data);
			setShowCreateModal(false);
		} catch {
			// Error is handled by the mutation
		}
	};

	const handleUpdateTeam = async (data: UpdateTeamData) => {
		if (!selectedTeam) return;
		
		try {
			await updateTeamMutation.mutateAsync({ id: selectedTeam._id, data });
			setShowEditModal(false);
			setSelectedTeam(null);
		} catch {
			// Error is handled by the mutation
		}
	};

	const handleDeleteTeam = async (teamId: string) => {
		if (window.confirm("Are you sure you want to delete this team?")) {
			try {
				await deleteTeamMutation.mutateAsync(teamId);
			} catch {
				// Error is handled by the mutation
			}
		}
	};

	const openEditModal = (team: Team) => {
		setSelectedTeam(team);
		setShowEditModal(true);
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="text-lg">Loading teams...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="text-red-500">
					Error loading teams: {(error as { message?: string })?.message || "Unknown error"}
				</div>
			</div>
		);
	}

		return (
		<div className="space-y-6">

			{/* Header */}
			<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0"
				>
					<div>
						<h1 className={`text-2xl sm:text-3xl font-bold transition-colors duration-300 ${
							theme === "dark" ? "text-white" : "text-black"
						}`}>
							Teams
						</h1>
						<p className={`mt-2 text-base sm:text-lg transition-colors duration-300 ${
							theme === "dark" ? "text-gray-400" : "text-gray-600"
						}`}>
							Manage your organization's teams
						</p>
					</div>

					<PermissionGate 
						permission={Permissions.CreateTeam}
					>
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={() => setShowCreateModal(true)}
							className={`flex items-center px-3 sm:px-4 py-2 rounded-lg transition-all duration-300 text-sm sm:text-base ${
								theme === "dark"
									? "bg-blue-600 hover:bg-blue-700 text-white"
									: "bg-blue-600 hover:bg-blue-700 text-white"
							}`}
						>
							<Plus size={18} className="mr-2" />
							Create Team
						</motion.button>
					</PermissionGate>
				</motion.div>

			{/* Search Bar */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.1 }}
				className={`relative ${
					theme === "dark" ? "text-white" : "text-black"
				}`}
			>
				<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
				<input
					type="text"
					placeholder="Search teams..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className={`w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 rounded-lg border transition-colors duration-300 text-sm sm:text-base ${
						theme === "dark"
							? "bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
							: "bg-white border-gray-300 text-black placeholder-gray-500 focus:border-blue-500"
					}`}
				/>
			</motion.div>

			{/* Teams Grid */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.2 }}
				className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-6"
			>
				{filteredTeams.map((team, index) => (
					<motion.div
						key={team._id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.1 * index }}
						className={`group relative flex flex-col h-full min-w-[320px] max-w-2xl w-full p-5 sm:p-6 rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${
							theme === "dark"
								? "bg-gray-900/60 backdrop-blur-xl border border-gray-800/50 shadow-xl hover:border-gray-700/50"
								: "bg-white/60 backdrop-blur-xl border border-gray-200/50 shadow-xl hover:border-gray-300/50"
						}`}
					>
						{/* Header Section */}
						<div className="flex items-start justify-between mb-4">
							<div className="flex items-center space-x-3 flex-1 min-w-0">
								<div className={`p-2.5 rounded-lg flex-shrink-0 ${theme === "dark" ? "bg-blue-600/20" : "bg-blue-100"}`}>
									<Users className={`w-5 h-5 ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`} />
								</div>
								<div className="min-w-0 flex-1">
									<h3 
										className={`font-semibold text-sm sm:text-base transition-colors duration-300 break-words line-clamp-2 ${theme === "dark" ? "text-white" : "text-black"}`}
										title={team.name}
									>
										{team.name}
									</h3>
									<div className="flex items-center space-x-2 mt-2">
										<span className={`px-3 py-1 rounded-full text-xs font-medium ${
											theme === "dark" ? "bg-blue-600/20 text-blue-400" : "bg-blue-100 text-blue-700"
										}`}>
											{team.teamViceHead.length} member{team.teamViceHead.length !== 1 ? 's' : ''}
										</span>
									</div>
								</div>
							</div>

							{/* Action Buttons */}
							<div className="flex items-center space-x-1 flex-shrink-0">
								<button
									onClick={() => navigate(`/dashboard/teams/${team._id}`)}
									className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
										theme === "dark"
											? "hover:bg-gray-800 text-gray-400 hover:text-white"
											: "hover:bg-gray-100 text-gray-600 hover:text-black"
									}`}
									title="View Team Details"
								>
									<Eye size={16} />
								</button>
								<PermissionGate permission={Permissions.EditTeam}>
									<button
										onClick={() => openEditModal(team)}
										className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
											theme === "dark"
												? "hover:bg-gray-800 text-gray-400 hover:text-white"
												: "hover:bg-gray-100 text-gray-600 hover:text-black"
										}`}
										title="Edit Team"
									>
										<Edit size={16} />
									</button>
								</PermissionGate>
								<PermissionGate permission={Permissions.DeleteTeam}>
									<button
										onClick={() => handleDeleteTeam(team._id)}
										className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
											theme === "dark"
												? "hover:bg-red-900/30 text-red-400 hover:text-red-300"
												: "hover:bg-red-50 text-red-600 hover:text-red-700"
										}`}
										title="Delete Team"
									>
										<Trash2 size={16} />
									</button>
								</PermissionGate>
							</div>
						</div>

						{/* Description */}
						<div className="flex-1 mb-4">
							<p className={`text-sm leading-relaxed transition-colors duration-300 line-clamp-3 break-words ${
								theme === "dark" ? "text-gray-300" : "text-gray-700"
							}`}>
								{team.description}
							</p>
						</div>

						{/* Team Stats */}
						<div className="grid grid-cols-2 gap-3 mb-4">
							{/* Member Count */}
							<div className="flex items-center space-x-2 text-xs">
								<Users size={14} className={`flex-shrink-0 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`} />
								<div className="min-w-0">
									<div className={`font-medium transition-colors duration-300 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
										Members
									</div>
									<div className={`transition-colors duration-300 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
										{team.teamViceHead.length} member{team.teamViceHead.length !== 1 ? 's' : ''}
									</div>
								</div>
							</div>

							{/* Team Status */}
							<div className="flex items-center space-x-2 text-xs">
								<div className={`w-3 h-3 rounded-full flex-shrink-0 ${
									team.teamViceHead.length > 0 
										? theme === "dark" ? "bg-green-400" : "bg-green-500"
										: theme === "dark" ? "bg-yellow-400" : "bg-yellow-500"
								}`} />
								<div className="min-w-0">
									<div className={`font-medium transition-colors duration-300 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
										Status
									</div>
									<div className={`transition-colors duration-300 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
										{team.teamViceHead.length > 0 ? 'Active' : 'Empty'}
									</div>
								</div>
							</div>
						</div>

						{/* Footer */}
						<div className="mt-auto pt-3 border-t border-gray-200 dark:border-gray-700">
							<div className="flex items-center justify-between">
								<div className="flex items-center space-x-2 text-xs">
									<Calendar size={14} className={`flex-shrink-0 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`} />
									<span className={`transition-colors duration-300 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
										Created {new Date(team.createdAt).toLocaleDateString()}
									</span>
								</div>
								
								{/* Team ID (shortened) */}
								<div className="text-xs">
									<span className={`transition-colors duration-300 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
										ID: {team._id.slice(-6)}
									</span>
								</div>
							</div>
						</div>
					</motion.div>
				))}
			</motion.div>

			{/* Empty State */}
			{filteredTeams.length === 0 && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="text-center py-12"
				>
					<Users className={`w-16 h-16 mx-auto mb-4 ${
						theme === "dark" ? "text-gray-600" : "text-gray-400"
					}`} />
					<h3 className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
						theme === "dark" ? "text-white" : "text-black"
					}`}>
						No teams found
					</h3>
					<p className={`transition-colors duration-300 ${
						theme === "dark" ? "text-gray-400" : "text-gray-600"
					}`}>
						{searchTerm ? "Try adjusting your search terms" : "Get started by creating your first team"}
					</p>
				</motion.div>
			)}

			{/* Create Team Modal */}
			{showCreateModal && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						className={`w-full max-w-md p-4 sm:p-6 rounded-xl ${
							theme === "dark"
								? "bg-gray-900 border border-gray-800"
								: "bg-white border border-gray-200"
						}`}
					>
						<h2 className={`text-lg sm:text-xl font-semibold mb-3 sm:mb-4 transition-colors duration-300 ${
							theme === "dark" ? "text-white" : "text-black"
						}`}>
							Create New Team
						</h2>
						<GenericForm
							schema={teamSchema}
							onSubmit={handleCreateTeam}
							submitButtonText={createTeamMutation.isPending ? "Creating..." : "Create Team"}
							className="space-y-4"
						/>
						<button
							onClick={() => setShowCreateModal(false)}
							className={`mt-3 sm:mt-4 w-full py-2 px-4 rounded-lg transition-colors duration-300 text-sm sm:text-base ${
								theme === "dark"
									? "bg-gray-800 hover:bg-gray-700 text-white"
									: "bg-gray-200 hover:bg-gray-300 text-black"
							}`}
						>
							Cancel
						</button>
					</motion.div>
				</div>
			)}

			{/* Edit Team Modal */}
			{showEditModal && selectedTeam && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						className={`w-full max-w-md p-4 sm:p-6 rounded-xl ${
							theme === "dark"
								? "bg-gray-900 border border-gray-800"
								: "bg-white border border-gray-200"
						}`}
					>
						<h2 className={`text-lg sm:text-xl font-semibold mb-3 sm:mb-4 transition-colors duration-300 ${
							theme === "dark" ? "text-white" : "text-black"
						}`}>
							Edit Team
						</h2>
						<GenericForm
							schema={updateTeamSchema}
							onSubmit={handleUpdateTeam}
							submitButtonText={updateTeamMutation.isPending ? "Updating..." : "Update Team"}
							defaultValues={{
								name: selectedTeam.name,
								description: selectedTeam.description,
							}}
							className="space-y-4"
						/>
						<button
							onClick={() => setShowEditModal(false)}
							className={`mt-3 sm:mt-4 w-full py-2 px-4 rounded-lg transition-colors duration-300 text-sm sm:text-base ${
								theme === "dark"
									? "bg-gray-800 hover:bg-gray-700 text-white"
									: "bg-gray-200 hover:bg-gray-300 text-black"
							}`}
						>
							Cancel
						</button>
					</motion.div>
				</div>
			)}
			</div>
		);
	};

	export default Teams; 