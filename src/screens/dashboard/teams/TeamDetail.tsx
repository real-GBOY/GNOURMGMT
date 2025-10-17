/** @format */

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import {
	Users,
	Edit,
	Trash2,
	Calendar,
	ArrowLeft,
	UserPlus,
	Settings,
} from "lucide-react";
import { useTheme } from "../../../shared/contexts/ThemeContext";
import {
	useTeam,
	useUpdateTeam,
	useDeleteTeam,
} from "../../../shared/services/teamService";
import { GenericForm } from "../../../shared/components/Form/GenericForm";
import TeamMembers from "../../../shared/components/TeamMembers";
import { updateTeamSchema } from "../../../shared/schemas/TeamSchema";
import { UpdateTeamData } from "../../../shared/types/Team";
import PermissionGate from "../../../shared/Secure/PermissionGate";
import Permissions from "../../../shared/config/Permissions";

const TeamDetail: React.FC = () => {
	const { theme } = useTheme();
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [showEditModal, setShowEditModal] = useState(false);

	// React Query hooks
	const { data: team, isLoading, error } = useTeam(id!);
	const updateTeamMutation = useUpdateTeam();
	const deleteTeamMutation = useDeleteTeam();

	const handleUpdateTeam = async (data: UpdateTeamData) => {
		if (!team) return;

		try {
			await updateTeamMutation.mutateAsync({ id: team._id, data });
			setShowEditModal(false);
		} catch {
			// Error is handled by the mutation
		}
	};

	const handleDeleteTeam = async () => {
		if (!team) return;

		if (window.confirm("Are you sure you want to delete this team?")) {
			try {
				await deleteTeamMutation.mutateAsync(team._id);
				navigate("/dashboard/teams");
			} catch {
				// Error is handled by the mutation
			}
		}
	};

	if (isLoading) {
		return (
			<div className='flex items-center justify-center h-64'>
				<div className='text-lg'>Loading team...</div>
			</div>
		);
	}

	if (error || !team) {
		return (
			<div className='flex items-center justify-center h-64'>
				<div className='text-red-500'>
					Error loading team:{" "}
					{(error as { message?: string })?.message || "Team not found"}
				</div>
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className='flex items-center justify-between'>
				<div className='flex items-center space-x-4'>
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={() => window.history.back()}
						className={`p-2 rounded-lg transition-colors duration-300 ${
							theme === "dark"
								? "hover:bg-gray-800 text-gray-400 hover:text-white"
								: "hover:bg-gray-100 text-gray-600 hover:text-black"
						}`}
						aria-label='Go back'
						title='Go back'></motion.button>
					<div>
						<h1
							className={`text-3xl font-bold transition-colors duration-300 ${
								theme === "dark" ? "text-white" : "text-black"
							}`}>
							{team.name}
						</h1>
						<p
							className={`mt-2 text-lg transition-colors duration-300 ${
								theme === "dark" ? "text-gray-400" : "text-gray-600"
							}`}>
							Team Details
						</p>
					</div>
				</div>

				<div className='flex items-center space-x-3'>
					<PermissionGate permission={Permissions.EditTeam}>
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={() => setShowEditModal(true)}
							className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 ${
								theme === "dark"
									? "bg-blue-600 hover:bg-blue-700 text-white"
									: "bg-blue-600 hover:bg-blue-700 text-white"
							}`}>
							<Edit size={20} className='mr-2' />
							Edit Team
						</motion.button>
					</PermissionGate>

					<PermissionGate permission={Permissions.DeleteTeam}>
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={handleDeleteTeam}
							className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 ${
								theme === "dark"
									? "bg-red-600 hover:bg-red-700 text-white"
									: "bg-red-600 hover:bg-red-700 text-white"
							}`}>
							<Trash2 size={20} className='mr-2' />
							Delete Team
						</motion.button>
					</PermissionGate>
				</div>
			</motion.div>

			{/* Team Information */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.1 }}
				className={`p-6 rounded-xl transition-all duration-300 ${
					theme === "dark"
						? "bg-gray-900/60 backdrop-blur-xl border-gray-800/50 shadow-xl"
						: "bg-white/60 backdrop-blur-xl border-gray-200/50 shadow-xl"
				}`}>
				<div className='flex items-start justify-between mb-6'>
					<div className='flex items-center space-x-4'>
						<div
							className={`p-3 rounded-lg ${
								theme === "dark" ? "bg-blue-600/20" : "bg-blue-100"
							}`}>
							<Users
								className={`w-8 h-8 ${
									theme === "dark" ? "text-blue-400" : "text-blue-600"
								}`}
							/>
						</div>
						<div>
							<h2
								className={`text-2xl font-bold transition-colors duration-300 ${
									theme === "dark" ? "text-white" : "text-black"
								}`}>
								{team.name}
							</h2>
							<p
								className={`text-sm transition-colors duration-300 ${
									theme === "dark" ? "text-gray-400" : "text-gray-600"
								}`}>
								{team.members?.length || 0} members
							</p>
						</div>
					</div>

					<div
						className={`flex items-center space-x-1 text-sm transition-colors duration-300 ${
							theme === "dark" ? "text-gray-400" : "text-gray-500"
						}`}>
						<Calendar size={16} />
						<span>Created {new Date(team.createdAt).toLocaleDateString()}</span>
					</div>
				</div>

				<div className='space-y-4'>
					<div>
						<h3
							className={`font-semibold mb-2 transition-colors duration-300 ${
								theme === "dark" ? "text-white" : "text-black"
							}`}>
							Description
						</h3>
						<p
							className={`text-sm transition-colors duration-300 ${
								theme === "dark" ? "text-gray-300" : "text-gray-700"
							}`}>
							{team.description}
						</p>
					</div>

					<TeamMembers members={team.members || []} isLoading={isLoading} />
				</div>
			</motion.div>

			{/* Team Actions */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.2 }}
				className='grid grid-cols-1 md:grid-cols-3 gap-4'>
				<PermissionGate permission={Permissions.EditTeam}>
					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						className={`p-4 rounded-xl transition-all duration-300 ${
							theme === "dark"
								? "bg-gray-800/60 backdrop-blur-xl border-gray-700/50 hover:bg-gray-700/60"
								: "bg-white/60 backdrop-blur-xl border-gray-200/50 hover:bg-gray-50/60"
						}`}>
						<div className='flex items-center space-x-3'>
							<UserPlus
								className={`w-6 h-6 ${
									theme === "dark" ? "text-blue-400" : "text-blue-600"
								}`}
							/>
							<div className='text-left'>
								<h3
									className={`font-semibold transition-colors duration-300 ${
										theme === "dark" ? "text-white" : "text-black"
									}`}>
									Add Members
								</h3>
								<p
									className={`text-sm transition-colors duration-300 ${
										theme === "dark" ? "text-gray-400" : "text-gray-600"
									}`}>
									Invite new team members
								</p>
							</div>
						</div>
					</motion.button>
				</PermissionGate>

				<PermissionGate permission={Permissions.EditTeam}>
					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						className={`p-4 rounded-xl transition-all duration-300 ${
							theme === "dark"
								? "bg-gray-800/60 backdrop-blur-xl border-gray-700/50 hover:bg-gray-700/60"
								: "bg-white/60 backdrop-blur-xl border-gray-200/50 hover:bg-gray-50/60"
						}`}>
						<div className='flex items-center space-x-3'>
							<Settings
								className={`w-6 h-6 ${
									theme === "dark" ? "text-green-400" : "text-green-600"
								}`}
							/>
							<div className='text-left'>
								<h3
									className={`font-semibold transition-colors duration-300 ${
										theme === "dark" ? "text-white" : "text-black"
									}`}>
									Team Settings
								</h3>
								<p
									className={`text-sm transition-colors duration-300 ${
										theme === "dark" ? "text-gray-400" : "text-gray-600"
									}`}>
									Manage team preferences
								</p>
							</div>
						</div>
					</motion.button>
				</PermissionGate>

				<PermissionGate permission={Permissions.DeleteTeam}>
					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						onClick={handleDeleteTeam}
						className={`p-4 rounded-xl transition-all duration-300 ${
							theme === "dark"
								? "bg-red-900/20 backdrop-blur-xl border-red-800/50 hover:bg-red-800/20"
								: "bg-red-50/60 backdrop-blur-xl border-red-200/50 hover:bg-red-100/60"
						}`}>
						<div className='flex items-center space-x-3'>
							<Trash2
								className={`w-6 h-6 ${
									theme === "dark" ? "text-red-400" : "text-red-600"
								}`}
							/>
							<div className='text-left'>
								<h3
									className={`font-semibold transition-colors duration-300 ${
										theme === "dark" ? "text-white" : "text-black"
									}`}>
									Delete Team
								</h3>
								<p
									className={`text-sm transition-colors duration-300 ${
										theme === "dark" ? "text-gray-400" : "text-gray-600"
									}`}>
									Permanently remove team
								</p>
							</div>
						</div>
					</motion.button>
				</PermissionGate>
			</motion.div>

			{/* Edit Team Modal */}
			{showEditModal && team && (
				<div className='fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]'>
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						className={`w-full max-w-md p-6 rounded-xl ${
							theme === "dark"
								? "bg-gray-900 border border-gray-800"
								: "bg-white border border-gray-200"
						}`}>
						<h2
							className={`text-xl font-semibold mb-4 transition-colors duration-300 ${
								theme === "dark" ? "text-white" : "text-black"
							}`}>
							Edit Team
						</h2>
						<GenericForm
							schema={updateTeamSchema}
							onSubmit={handleUpdateTeam}
							submitButtonText={
								updateTeamMutation.isPending ? "Updating..." : "Update Team"
							}
							defaultValues={{
								name: team.name,
								description: team.description,
							}}
							className='space-y-4'
						/>
						<button
							onClick={() => setShowEditModal(false)}
							className={`mt-4 w-full py-2 px-4 rounded-lg transition-colors duration-300 ${
								theme === "dark"
									? "bg-gray-800 hover:bg-gray-700 text-white"
									: "bg-gray-200 hover:bg-gray-300 text-black"
							}`}>
							Cancel
						</button>
					</motion.div>
				</div>
			)}
		</div>
	);
};

export default TeamDetail;
