/** @format */

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
	Users,
	Search,
	Filter,
	Eye,
	User,
	Mail,
	Phone,
	MapPin,
	CheckCircle,
	XCircle,
	Loader2,
	Plus,
} from "lucide-react";
import { useTheme } from "../../shared/contexts/ThemeContext";
import { useUsers } from "../../shared/services/userService";
import {
	getUserDisplayName,
	isUserVerified,
	isUserActive,
} from "../../shared/services/userService";
import PermissionGate from "../../shared/Secure/PermissionGate";
import Permissions from "../../shared/config/Permissions";
import usePermission from "../../shared/hooks/usePermission";

const Members: React.FC = () => {
	const { theme } = useTheme();
	const navigate = useNavigate();
	const { hasPermission } = usePermission();
	const [searchTerm, setSearchTerm] = useState("");
	const [filterRole, setFilterRole] = useState("");
	const [filterStatus, setFilterStatus] = useState("");

	console.log("Members component rendered!");

	// Check if user has permission to view users
	const canViewUsers =
		hasPermission(Permissions.ViewPerson) ||
		hasPermission(Permissions.ViewTeamMembers);

	// Fetch all users
	const { data: users = [], isLoading, error } = useUsers(canViewUsers);

	// Filter users based on search and filters
	const filteredUsers = users.filter((user) => {
		const matchesSearch =
			searchTerm === "" ||
			getUserDisplayName(user)
				.toLowerCase()
				.includes(searchTerm.toLowerCase()) ||
			user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.phoneNumber?.toLowerCase().includes(searchTerm.toLowerCase());

		const matchesRole =
			filterRole === "" ||
			(typeof user.role === "object"
				? user.role?.key === filterRole
				: user.role === filterRole);

		const matchesStatus =
			filterStatus === "" ||
			(filterStatus === "active" && isUserActive(user)) ||
			(filterStatus === "inactive" && !isUserActive(user)) ||
			(filterStatus === "verified" && isUserVerified(user)) ||
			(filterStatus === "unverified" && !isUserVerified(user));

		return matchesSearch && matchesRole && matchesStatus;
	});

	// Get unique roles for filter
	const uniqueRoles = Array.from(
		new Set(
			users
				.map((user) =>
					typeof user.role === "object" ? user.role?.key : user.role
				)
				.filter(Boolean)
		)
	).sort();

	// If user doesn't have permission, show access denied
	if (!canViewUsers) {
		return (
			<div className='flex items-center justify-center h-64'>
				<div className='text-center'>
					<div className='text-red-500 mb-2'>Access Denied</div>
					<div className='text-sm text-gray-500'>
						You don't have permission to view members.
					</div>
					<div className='text-xs text-gray-400 mt-2'>
						Required permission: {Permissions.ViewPerson} or{" "}
						{Permissions.ViewTeamMembers}
					</div>
				</div>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className='flex items-center justify-center h-64'>
				<div className='flex items-center space-x-2'>
					<Loader2 className='animate-spin' size={24} />
					<span className='text-lg'>Loading members...</span>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='flex items-center justify-center h-64'>
				<div className='text-center'>
					<div className='text-red-500 mb-2'>Error loading members</div>
					<div className='text-sm text-gray-500'>Please try again later.</div>
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
				className='flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0'>
				<div>
					<h1
						className={`text-2xl sm:text-3xl font-bold transition-colors duration-300 ${
							theme === "dark" ? "text-white" : "text-black"
						}`}>
						Team Members
					</h1>
					<p
						className={`mt-2 text-base transition-colors duration-300 ${
							theme === "dark" ? "text-gray-400" : "text-gray-600"
						}`}>
						Discover and connect with your team members
					</p>
				</div>

				<div className='flex items-center space-x-2'>
					<Users
						size={24}
						className={theme === "dark" ? "text-blue-400" : "text-blue-600"}
					/>
					<span
						className={`text-sm font-medium ${
							theme === "dark" ? "text-gray-400" : "text-gray-600"
						}`}>
						{filteredUsers.length} member{filteredUsers.length !== 1 ? "s" : ""}
					</span>
				</div>
			</motion.div>

			{/* Search and Filters */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.1 }}
				className={`p-4 rounded-2xl backdrop-blur-xl ${
					theme === "dark"
						? "bg-gray-900/60 border border-gray-800/50 shadow-xl"
						: "bg-white/60 backdrop-blur-xl border border-gray-200/50 shadow-xl"
				}`}>
				<div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
					{/* Search */}
					<div className='relative'>
						<Search
							size={16}
							className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
								theme === "dark" ? "text-gray-400" : "text-gray-500"
							}`}
						/>
						<input
							type='text'
							placeholder='Search members...'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className={`w-full pl-10 pr-4 py-2 rounded-xl border transition-all duration-300 ${
								theme === "dark"
									? "bg-gray-800/50 border-gray-600 text-white focus:border-blue-500"
									: "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
							}`}
						/>
					</div>

					{/* Role Filter */}
					<div className='relative'>
						<Filter
							size={16}
							className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
								theme === "dark" ? "text-gray-400" : "text-gray-500"
							}`}
						/>
						<select
							value={filterRole}
							onChange={(e) => setFilterRole(e.target.value)}
							className={`w-full pl-10 pr-4 py-2 rounded-xl border transition-all duration-300 appearance-none ${
								theme === "dark"
									? "bg-gray-800/50 border-gray-600 text-white focus:border-blue-500"
									: "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
							}`}>
							<option value=''>All Roles</option>
							{uniqueRoles.map((role) => (
								<option key={role} value={role}>
									{role}
								</option>
							))}
						</select>
					</div>

					{/* Status Filter */}
					<div className='relative'>
						<Filter
							size={16}
							className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
								theme === "dark" ? "text-gray-400" : "text-gray-500"
							}`}
						/>
						<select
							value={filterStatus}
							onChange={(e) => setFilterStatus(e.target.value)}
							className={`w-full pl-10 pr-4 py-2 rounded-xl border transition-all duration-300 appearance-none ${
								theme === "dark"
									? "bg-gray-800/50 border-gray-600 text-white focus:border-blue-500"
									: "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
							}`}>
							<option value=''>All Status</option>
							<option value='active'>Active</option>
							<option value='inactive'>Inactive</option>
							<option value='verified'>Verified</option>
							<option value='unverified'>Unverified</option>
						</select>
					</div>

					{/* Clear Filters */}
					<button
						onClick={() => {
							setSearchTerm("");
							setFilterRole("");
							setFilterStatus("");
						}}
						className={`px-4 py-2 rounded-xl border transition-all duration-300 hover:scale-105 ${
							theme === "dark"
								? "border-gray-600 text-gray-300 hover:bg-gray-800/50"
								: "border-gray-300 text-gray-600 hover:bg-gray-100/50"
						}`}>
						Clear Filters
					</button>
				</div>
			</motion.div>

			{/* Members Grid */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.2 }}
				className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
				{filteredUsers.map((user, index) => (
					<motion.div
						key={user._id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
						className={`group cursor-pointer transition-all duration-300 hover:scale-105 ${
							theme === "dark"
								? "bg-gray-900/60 border border-gray-800/50 shadow-xl hover:shadow-2xl hover:border-gray-700/50"
								: "bg-white/60 backdrop-blur-xl border border-gray-200/50 shadow-xl hover:shadow-2xl hover:border-gray-300/50"
						} rounded-2xl overflow-hidden`}
						onClick={() => navigate(`/dashboard/users/${user._id}`)}>
						{/* Profile Picture */}
						<div className='relative p-6 pb-4'>
							<div className='flex justify-center'>
								{user.profilePicture ? (
									<img
										src={user.profilePicture}
										alt={getUserDisplayName(user)}
										className='w-20 h-20 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700'
									/>
								) : (
									<div
										className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold ${
											theme === "dark"
												? "bg-blue-600 text-white"
												: "bg-blue-100 text-blue-700"
										}`}>
										{user.firstName.charAt(0)}
										{user.lastName.charAt(0)}
									</div>
								)}
							</div>

							{/* Status Indicators */}
							<div className='absolute top-4 right-4 flex flex-col space-y-1'>
								{isUserVerified(user) && (
									<div className='bg-green-500 rounded-full p-1'>
										<CheckCircle size={12} className='text-white' />
									</div>
								)}
								{isUserActive(user) ? (
									<div className='bg-blue-500 rounded-full p-1'>
										<div className='w-2 h-2 bg-white rounded-full'></div>
									</div>
								) : (
									<div className='bg-gray-500 rounded-full p-1'>
										<XCircle size={12} className='text-white' />
									</div>
								)}
							</div>
						</div>

						{/* User Info */}
						<div className='px-6 pb-4'>
							<h3
								className={`text-lg font-semibold text-center mb-2 transition-colors duration-300 ${
									theme === "dark" ? "text-white" : "text-black"
								}`}>
								{getUserDisplayName(user)}
							</h3>

							<p
								className={`text-sm text-center mb-4 transition-colors duration-300 ${
									theme === "dark" ? "text-gray-400" : "text-gray-600"
								}`}>
								{typeof user.role === "object"
									? user.role?.key
									: user.role || "No Role"}
							</p>

							{/* Contact Info */}
							<div className='space-y-2'>
								<div className='flex items-center space-x-2'>
									<Mail
										size={14}
										className={
											theme === "dark" ? "text-gray-400" : "text-gray-500"
										}
									/>
									<span
										className={`text-xs truncate transition-colors duration-300 ${
											theme === "dark" ? "text-gray-300" : "text-gray-700"
										}`}>
										{user.email}
									</span>
								</div>

								{user.phoneNumber && (
									<div className='flex items-center space-x-2'>
										<Phone
											size={14}
											className={
												theme === "dark" ? "text-gray-400" : "text-gray-500"
											}
										/>
										<span
											className={`text-xs transition-colors duration-300 ${
												theme === "dark" ? "text-gray-300" : "text-gray-700"
											}`}>
											{user.phoneNumber}
										</span>
									</div>
								)}

								{user.nationalID && (
									<div className='flex items-center space-x-2'>
										<MapPin
											size={14}
											className={
												theme === "dark" ? "text-gray-400" : "text-gray-500"
											}
										/>
										<span
											className={`text-xs transition-colors duration-300 ${
												theme === "dark" ? "text-gray-300" : "text-gray-700"
											}`}>
											ID: {user.nationalID}
										</span>
									</div>
								)}
							</div>
						</div>

						{/* View Profile Button */}
						<div
							className={`px-6 pb-4 transition-all duration-300 ${
								theme === "dark" ? "bg-gray-800/30" : "bg-gray-50/50"
							}`}>
							<button
								className={`w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-xl transition-all duration-300 group-hover:scale-105 ${
									theme === "dark"
										? "bg-blue-600/80 text-white hover:bg-blue-700/80"
										: "bg-blue-50 text-blue-600 hover:bg-blue-100"
								}`}>
								<Eye size={14} />
								<span className='text-sm font-medium'>View Profile</span>
							</button>
						</div>
					</motion.div>
				))}
			</motion.div>

			{/* No Results */}
			{filteredUsers.length === 0 && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.3 }}
					className={`text-center py-12 ${
						theme === "dark" ? "text-gray-400" : "text-gray-600"
					}`}>
					<Users size={48} className='mx-auto mb-4 opacity-50' />
					<p className='text-lg font-medium'>No members found</p>
					<p className='text-sm'>
						{searchTerm || filterRole || filterStatus
							? "Try adjusting your search or filters"
							: "No members available at the moment"}
					</p>
				</motion.div>
			)}
		</div>
	);
};

export default Members;
