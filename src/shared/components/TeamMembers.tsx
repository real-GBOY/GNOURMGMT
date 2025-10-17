/** @format */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	Mail,
	Shield,
	Phone,
	Eye,
	Award,
	Plus,
	ChevronDown,
	ChevronRight,
	FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { TeamMember } from "../types/Team";
import { Achievement } from "../types/Achievement";
import usePermission from "../hooks/usePermission";
import Permissions from "../config/Permissions";
import Modal from "./Modal";
import CertificateForm from "./CertificateForm";
import { useUserAchievements } from "../services/achievementService";

interface TeamMembersProps {
	members: TeamMember[];
	isLoading?: boolean;
	showHeader?: boolean;
	className?: string;
}

const TeamMembers: React.FC<TeamMembersProps> = ({
	members,
	isLoading = false,
	showHeader = true,
	className = "",
}) => {
	const { theme } = useTheme();
	const navigate = useNavigate();
	const { hasPermission } = usePermission();
	const canAssignAchievement = hasPermission(Permissions.AssignAchievement);

	// Certificate modal state
	const [showCertificateModal, setShowCertificateModal] = useState(false);
	const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

	// Expanded members state for showing certificates
	const [expandedMembers, setExpandedMembers] = useState<Set<string>>(
		new Set()
	);

	const handleAddCertificate = (member: TeamMember) => {
		setSelectedMember(member);
		setShowCertificateModal(true);
	};

	const handleCertificateSubmit = (data: any) => {
		// This will be handled by the CertificateForm component
		setShowCertificateModal(false);
		setSelectedMember(null);
	};

	const handleCloseCertificateModal = () => {
		setShowCertificateModal(false);
		setSelectedMember(null);
	};

	const toggleMemberExpansion = (memberId: string) => {
		const newExpanded = new Set(expandedMembers);
		if (newExpanded.has(memberId)) {
			newExpanded.delete(memberId);
		} else {
			newExpanded.add(memberId);
		}
		setExpandedMembers(newExpanded);
	};

	if (isLoading) {
		return (
			<div className={`flex items-center justify-center py-4 ${className}`}>
				<div className='text-sm text-gray-500'>Loading members...</div>
			</div>
		);
	}

	if (!members || members.length === 0) {
		return (
			<div className={`${className}`}>
				{showHeader && (
					<h3
						className={`font-semibold mb-2 transition-colors duration-300 ${
							theme === "dark" ? "text-white" : "text-black"
						}`}>
						Team Members (0)
					</h3>
				)}
				<p
					className={`text-sm transition-colors duration-300 ${
						theme === "dark" ? "text-gray-400" : "text-gray-500"
					}`}>
					No members assigned yet
				</p>
			</div>
		);
	}

	return (
		<div className={`${className}`}>
			{showHeader && (
				<h3
					className={`font-semibold mb-2 transition-colors duration-300 ${
						theme === "dark" ? "text-white" : "text-black"
					}`}>
					Team Members ({members.length})
				</h3>
			)}
			<div className='space-y-3'>
				{members.map((member, index) => (
					<div key={member._id} className='space-y-2'>
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3, delay: index * 0.1 }}
							onClick={() => navigate(`/dashboard/users/${member._id}`)}
							className={`flex items-center space-x-3 p-4 rounded-xl transition-all duration-300 cursor-pointer group hover:scale-[1.02] ${
								theme === "dark"
									? "bg-gray-900/40 backdrop-blur-xl border border-gray-800/50 hover:bg-gray-800/50 hover:border-gray-700/50 shadow-lg hover:shadow-xl"
									: "bg-white/40 backdrop-blur-xl border border-gray-200/50 hover:bg-white/60 hover:border-gray-300/50 shadow-lg hover:shadow-xl"
							}`}>
							<div className='flex-shrink-0'>
								{member.profilePicture ? (
									<img
										src={member.profilePicture}
										alt={`${member.firstName} ${member.lastName}`}
										className='w-12 h-12 rounded-full object-cover ring-2 ring-white/20 shadow-md'
									/>
								) : (
									<div
										className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium ring-2 ring-white/20 shadow-md ${
											theme === "dark"
												? "bg-gradient-to-br from-blue-600 to-blue-700 text-white"
												: "bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700"
										}`}>
										{member.firstName.charAt(0).toUpperCase()}
										{member.lastName.charAt(0).toUpperCase()}
									</div>
								)}
							</div>
							<div className='flex-1 min-w-0'>
								<div className='flex items-center space-x-2'>
									<p
										className={`font-medium transition-colors duration-300 ${
											theme === "dark" ? "text-white" : "text-black"
										}`}>
										{member.firstName} {member.lastName}
									</p>
									{member.isVerified && (
										<div className='p-1 rounded-full bg-green-500/20 backdrop-blur-sm'>
											<Shield size={12} className='text-green-400' />
										</div>
									)}
								</div>
								<div className='flex items-center space-x-4 text-sm'>
									<div className='flex items-center space-x-1'>
										<Mail
											size={12}
											className={`transition-colors duration-300 ${
												theme === "dark" ? "text-blue-400" : "text-blue-500"
											}`}
										/>
										<span
											className={`transition-colors duration-300 ${
												theme === "dark" ? "text-gray-300" : "text-gray-700"
											}`}>
											{member.email}
										</span>
									</div>
									<div className='flex items-center space-x-1'>
										<Phone
											size={12}
											className={`transition-colors duration-300 ${
												theme === "dark" ? "text-green-400" : "text-green-500"
											}`}
										/>
										<span
											className={`transition-colors duration-300 ${
												theme === "dark" ? "text-gray-300" : "text-gray-700"
											}`}>
											{member.phoneNumber}
										</span>
									</div>
								</div>
							</div>
							{/* View Profile Icon */}
							<div className='flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-300'>
								<Eye
									size={16}
									className={`transition-colors duration-300 ${
										theme === "dark" ? "text-blue-400" : "text-blue-600"
									}`}
								/>
							</div>

							{/* Add Certificate Button */}
							{canAssignAchievement && (
								<div className='flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-300'>
									<button
										onClick={(e) => {
											e.stopPropagation();
											handleAddCertificate(member);
										}}
										className={`p-2 rounded-lg transition-all duration-300 ${
											theme === "dark"
												? "bg-green-600/20 hover:bg-green-500/30 text-green-400 hover:text-green-300"
												: "bg-green-100 hover:bg-green-200 text-green-600 hover:text-green-700"
										}`}
										title='Add Certificate'>
										<Award size={16} />
									</button>
								</div>
							)}

							{/* Toggle Certificates Button */}
							<div className='flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-300'>
								<button
									onClick={(e) => {
										e.stopPropagation();
										toggleMemberExpansion(member._id);
									}}
									className={`p-2 rounded-lg transition-all duration-300 ${
										theme === "dark"
											? "bg-blue-600/20 hover:bg-blue-500/30 text-blue-400 hover:text-blue-300"
											: "bg-blue-100 hover:bg-blue-200 text-blue-600 hover:text-blue-700"
									}`}
									title='View Certificates'>
									{expandedMembers.has(member._id) ? (
										<ChevronDown size={16} />
									) : (
										<ChevronRight size={16} />
									)}
								</button>
							</div>
						</motion.div>

						{/* Certificates Section */}
						<AnimatePresence>
							{expandedMembers.has(member._id) && (
								<motion.div
									initial={{ opacity: 0, height: 0 }}
									animate={{ opacity: 1, height: "auto" }}
									exit={{ opacity: 0, height: 0 }}
									transition={{ duration: 0.3 }}
									className={`overflow-hidden rounded-lg border ${
										theme === "dark"
											? "bg-gray-800/30 border-gray-700/50"
											: "bg-gray-50/80 border-gray-200/50"
									}`}>
									<MemberCertificates
										memberId={member._id}
										memberName={`${member.firstName} ${member.lastName}`}
									/>
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				))}
			</div>

			{/* Certificate Modal */}
			{showCertificateModal && selectedMember && (
				<Modal
					isOpen={showCertificateModal}
					onClose={handleCloseCertificateModal}
					title={`Add Certificate for ${selectedMember.firstName} ${selectedMember.lastName}`}>
					<CertificateForm
						userId={selectedMember._id}
						userName={`${selectedMember.firstName} ${selectedMember.lastName}`}
						onSubmit={handleCertificateSubmit}
						onCancel={handleCloseCertificateModal}
					/>
				</Modal>
			)}
		</div>
	);
};

// Component to display member certificates
const MemberCertificates: React.FC<{
	memberId: string;
	memberName: string;
}> = ({ memberId, memberName }) => {
	const { theme } = useTheme();
	const navigate = useNavigate();
	const {
		data: achievements,
		isLoading,
		error,
	} = useUserAchievements(memberId);

	if (isLoading) {
		return (
			<div className='p-4'>
				<div className='text-sm text-gray-500'>Loading certificates...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='p-4'>
				<div className='text-sm text-red-500'>Error loading certificates</div>
			</div>
		);
	}

	if (!achievements || achievements.length === 0) {
		return (
			<div className='p-4'>
				<div className='flex items-center space-x-2'>
					<Award size={16} className='text-gray-400' />
					<span className='text-sm text-gray-500'>
						No certificates found for {memberName}
					</span>
				</div>
			</div>
		);
	}

	return (
		<div className='p-4'>
			<div className='flex items-center justify-between mb-3'>
				<div className='flex items-center space-x-2'>
					<Award size={16} className='text-blue-500' />
					<span
						className={`text-sm font-medium ${
							theme === "dark" ? "text-white" : "text-gray-900"
						}`}>
						Certificates ({achievements.length})
					</span>
				</div>
				<button
					onClick={() => navigate("/dashboard/achievements")}
					className={`text-xs px-2 py-1 rounded-md transition-all duration-300 ${
						theme === "dark"
							? "text-blue-400 hover:text-blue-300 hover:bg-blue-900/30"
							: "text-blue-600 hover:text-blue-700 hover:bg-blue-100/60"
					}`}>
					View All
				</button>
			</div>
			<div className='space-y-3'>
				{achievements.map((achievement) => (
					<div
						key={achievement._id}
						onClick={() =>
							navigate(`/dashboard/achievements/${achievement._id}`)
						}
						title={`Click to view details of ${achievement.title}`}
						className={`p-3 rounded-lg border cursor-pointer transition-all duration-300 hover:scale-[1.02] group ${
							theme === "dark"
								? "bg-gray-700/50 border-gray-600/50 hover:bg-gray-600/50 hover:border-gray-500/50"
								: "bg-white/60 border-gray-200/50 hover:bg-white/80 hover:border-gray-300/50"
						}`}>
						<div className='flex items-start justify-between'>
							<div className='flex-1'>
								<div className='flex items-center space-x-2 mb-1'>
									<h4
										className={`text-sm font-medium ${
											theme === "dark" ? "text-white" : "text-gray-900"
										}`}>
										{achievement.title}
									</h4>
									<span
										className={`px-2 py-1 text-xs rounded-full ${
											theme === "dark"
												? "bg-blue-600/20 text-blue-300"
												: "bg-blue-100 text-blue-700"
										}`}>
										{achievement.achievementType
											.replace("_", " ")
											.replace(/\b\w/g, (l) => l.toUpperCase())}
									</span>
								</div>
								<p
									className={`text-xs ${
										theme === "dark" ? "text-gray-300" : "text-gray-600"
									}`}>
									{achievement.description}
								</p>
								{achievement.certificateFile && (
									<div className='flex items-center space-x-2 mt-2'>
										<FileText size={12} className='text-green-500' />
										<span
											className={`text-xs ${
												theme === "dark" ? "text-green-400" : "text-green-600"
											}`}>
											Certificate attached
										</span>
									</div>
								)}
							</div>
							<div className='flex items-center space-x-2'>
								<div
									className={`text-xs ${
										theme === "dark" ? "text-gray-400" : "text-gray-500"
									}`}>
									{new Date(achievement.dateAwarded).toLocaleDateString()}
								</div>
								<div className='opacity-0 group-hover:opacity-100 transition-all duration-300'>
									<ChevronRight
										size={12}
										className={`transition-colors duration-300 ${
											theme === "dark" ? "text-blue-400" : "text-blue-600"
										}`}
									/>
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default TeamMembers;
