/** @format */

import React, { useState } from "react";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";
import { Users, UserPlus, UserMinus, X, Check } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useUsers } from "../services/userService";
import {
	useAddGuestsToEvent,
	useRemoveGuestsFromEvent,
} from "../services/eventService";
import { Event } from "../types/Event";
import { User } from "../types/User";
import PermissionGate from "../Secure/PermissionGate";
import Permissions from "../config/Permissions";

interface GuestManagementProps {
	event: Event;
}

const GuestManagement: React.FC<GuestManagementProps> = ({ event }) => {
	const { theme } = useTheme();
	const [showAddModal, setShowAddModal] = useState(false);
	const [showRemoveModal, setShowRemoveModal] = useState(false);
	const [selectedGuests, setSelectedGuests] = useState<string[]>([]);
	const [searchTerm, setSearchTerm] = useState("");

	// React Query hooks
	const { data: users = [] } = useUsers();
	const addGuestsMutation = useAddGuestsToEvent();
	const removeGuestsMutation = useRemoveGuestsFromEvent();

	// Filter users who are not already guests
	const availableUsers = users.filter((user) => {
		// Check if user is already a guest
		return !event.guests?.some((guest) => {
			// If guest is a string (ID), compare with user ID
			if (typeof guest === "string") {
				return guest === user._id;
			}
			// If guest is a user object, compare IDs
			return (guest as User)._id === user._id;
		});
	});

	// Filter users based on search term
	const filteredUsers = availableUsers.filter(
		(user) =>
			user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.email.toLowerCase().includes(searchTerm.toLowerCase())
	);

	// Get guest details - handle both old format (IDs) and new format (full objects)
	const guestDetails =
		(event.guests
			?.map((guest) => {
				// If guest is a string (ID), find the user object
				if (typeof guest === "string") {
					return users.find((user) => user._id === guest);
				}
				// If guest is already a user object, return it directly
				return guest as User;
			})
			.filter(Boolean) as User[]) || [];

	const handleAddGuests = async () => {
		if (selectedGuests.length === 0) return;

		try {
			await addGuestsMutation.mutateAsync({
				eventId: event._id,
				guestIds: selectedGuests,
			});
			setShowAddModal(false);
			setSelectedGuests([]);
			setSearchTerm("");
		} catch (error) {
			// Error is handled by the mutation
		}
	};

	const handleRemoveGuests = async () => {
		if (selectedGuests.length === 0) return;

		try {
			await removeGuestsMutation.mutateAsync({
				eventId: event._id,
				guestIds: selectedGuests,
			});
			setShowRemoveModal(false);
			setSelectedGuests([]);
		} catch (error) {
			// Error is handled by the mutation
		}
	};

	const toggleGuestSelection = (guestId: string) => {
		setSelectedGuests((prev) =>
			prev.includes(guestId)
				? prev.filter((id) => id !== guestId)
				: [...prev, guestId]
		);
	};

	// Modal components
	const AddGuestsModal = () => {
		if (!showAddModal) return null;

		return createPortal(
			<div className='fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4'>
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					className={`w-full max-w-md p-6 rounded-xl ${
						theme === "dark"
							? "bg-gray-900 border border-gray-800"
							: "bg-white border border-gray-200"
					}`}>
					<div className='flex items-center justify-between mb-4'>
						<h2
							className={`text-xl font-semibold transition-colors duration-300 ${
								theme === "dark" ? "text-white" : "text-black"
							}`}>
							Add Guests
						</h2>
						<button
							onClick={() => {
								setShowAddModal(false);
								setSelectedGuests([]);
								setSearchTerm("");
							}}
							className={`p-2 rounded-lg transition-colors duration-300 ${
								theme === "dark"
									? "hover:bg-gray-800 text-gray-400 hover:text-white"
									: "hover:bg-gray-100 text-gray-600 hover:text-black"
							}`}>
							<X size={20} />
						</button>
					</div>

					{/* Search */}
					<div className='mb-4'>
						<input
							type='text'
							placeholder='Search users...'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className={`w-full px-3 py-2 rounded-lg border transition-colors duration-300 ${
								theme === "dark"
									? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
									: "bg-white border-gray-300 text-black placeholder-gray-500"
							}`}
						/>
					</div>

					{/* User List */}
					<div className='max-h-64 overflow-y-auto space-y-2 mb-4'>
						{filteredUsers.length > 0 ? (
							filteredUsers.map((user) => (
								<div
									key={user._id}
									onClick={() => toggleGuestSelection(user._id)}
									className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-300 ${
										selectedGuests.includes(user._id)
											? theme === "dark"
												? "bg-blue-600/20 border-blue-500/50"
												: "bg-blue-100 border-blue-300"
											: theme === "dark"
											? "hover:bg-gray-800 border-gray-700"
											: "hover:bg-gray-50 border-gray-200"
									} border`}>
									<div
										className={`w-6 h-6 rounded-full flex items-center justify-center ${
											selectedGuests.includes(user._id)
												? "bg-blue-600"
												: theme === "dark"
												? "bg-gray-700"
												: "bg-gray-200"
										}`}>
										{selectedGuests.includes(user._id) ? (
											<Check size={14} className='text-white' />
										) : null}
									</div>
									<div className='flex-1 min-w-0'>
										<p
											className={`font-medium text-sm transition-colors duration-300 break-words ${
												theme === "dark" ? "text-white" : "text-black"
											}`}>
											{user.firstName} {user.lastName}
										</p>
										<p
											className={`text-xs transition-colors duration-300 ${
												theme === "dark" ? "text-gray-400" : "text-gray-500"
											}`}>
											{user.email}
										</p>
									</div>
								</div>
							))
						) : (
							<p
								className={`text-center py-4 transition-colors duration-300 ${
									theme === "dark" ? "text-gray-400" : "text-gray-600"
								}`}>
								No users found
							</p>
						)}
					</div>

					{/* Actions */}
					<div className='flex items-center justify-end space-x-3'>
						<button
							onClick={() => {
								setShowAddModal(false);
								setSelectedGuests([]);
								setSearchTerm("");
							}}
							className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
								theme === "dark"
									? "bg-gray-800 hover:bg-gray-700 text-white"
									: "bg-gray-200 hover:bg-gray-300 text-black"
							}`}>
							Cancel
						</button>
						<button
							onClick={handleAddGuests}
							disabled={
								selectedGuests.length === 0 || addGuestsMutation.isPending
							}
							className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
								selectedGuests.length === 0 || addGuestsMutation.isPending
									? "bg-gray-400 cursor-not-allowed"
									: "bg-blue-600 hover:bg-blue-700"
							} text-white`}>
							{addGuestsMutation.isPending ? "Adding..." : "Add Guests"}
						</button>
					</div>
				</motion.div>
			</div>,
			document.body
		);
	};

	const RemoveGuestsModal = () => {
		if (!showRemoveModal) return null;

		return createPortal(
			<div className='fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4'>
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					className={`w-full max-w-md p-6 rounded-xl ${
						theme === "dark"
							? "bg-gray-900 border border-gray-800"
							: "bg-white border border-gray-200"
					}`}>
					<div className='flex items-center justify-between mb-4'>
						<h2
							className={`text-xl font-semibold transition-colors duration-300 ${
								theme === "dark" ? "text-white" : "text-black"
							}`}>
							Remove Guests
						</h2>
						<button
							onClick={() => {
								setShowRemoveModal(false);
								setSelectedGuests([]);
							}}
							className={`p-2 rounded-lg transition-colors duration-300 ${
								theme === "dark"
									? "hover:bg-gray-800 text-gray-400 hover:text-white"
									: "hover:bg-gray-100 text-gray-600 hover:text-black"
							}`}>
							<X size={20} />
						</button>
					</div>

					{/* Guest List */}
					<div className='max-h-64 overflow-y-auto space-y-2 mb-4'>
						{guestDetails.length > 0 ? (
							guestDetails.map((guest) => (
								<div
									key={guest._id}
									onClick={() => toggleGuestSelection(guest._id)}
									className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-300 ${
										selectedGuests.includes(guest._id)
											? theme === "dark"
												? "bg-red-600/20 border-red-500/50"
												: "bg-red-100 border-red-300"
											: theme === "dark"
											? "hover:bg-gray-800 border-gray-700"
											: "hover:bg-gray-50 border-gray-200"
									} border`}>
									<div
										className={`w-6 h-6 rounded-full flex items-center justify-center ${
											selectedGuests.includes(guest._id)
												? "bg-red-600"
												: theme === "dark"
												? "bg-gray-700"
												: "bg-gray-200"
										}`}>
										{selectedGuests.includes(guest._id) ? (
											<Check size={14} className='text-white' />
										) : null}
									</div>
									<div className='flex-1 min-w-0'>
										<p
											className={`font-medium text-sm transition-colors duration-300 break-words ${
												theme === "dark" ? "text-white" : "text-black"
											}`}>
											{guest.firstName} {guest.lastName}
										</p>
										<p
											className={`text-xs transition-colors duration-300 ${
												theme === "dark" ? "text-gray-400" : "text-gray-500"
											}`}>
											{guest.email}
										</p>
									</div>
								</div>
							))
						) : (
							<p
								className={`text-center py-4 transition-colors duration-300 ${
									theme === "dark" ? "text-gray-400" : "text-gray-600"
								}`}>
								No guests found
							</p>
						)}
					</div>

					{/* Actions */}
					<div className='flex items-center justify-end space-x-3'>
						<button
							onClick={() => {
								setShowRemoveModal(false);
								setSelectedGuests([]);
							}}
							className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
								theme === "dark"
									? "bg-gray-800 hover:bg-gray-700 text-white"
									: "bg-gray-200 hover:bg-gray-300 text-black"
							}`}>
							Cancel
						</button>
						<button
							onClick={handleRemoveGuests}
							disabled={
								selectedGuests.length === 0 || removeGuestsMutation.isPending
							}
							className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
								selectedGuests.length === 0 || removeGuestsMutation.isPending
									? "bg-gray-400 cursor-not-allowed"
									: "bg-red-600 hover:bg-red-700"
							} text-white`}>
							{removeGuestsMutation.isPending ? "Removing..." : "Remove Guests"}
						</button>
					</div>
				</motion.div>
			</div>,
			document.body
		);
	};

	return (
		<div className='space-y-4'>
			{/* Guest List */}
			<div className='space-y-3'>
				<div className='flex items-center justify-between'>
					<h3
						className={`font-semibold text-lg transition-colors duration-300 ${
							theme === "dark" ? "text-white" : "text-black"
						}`}>
						Guests ({guestDetails.length})
					</h3>
					<div className='flex items-center space-x-2'>
						<PermissionGate permission={Permissions.InviteMembersToEvent}>
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={() => setShowAddModal(true)}
								className={`flex items-center px-3 py-2 rounded-lg transition-all duration-300 text-sm ${
									theme === "dark"
										? "bg-green-600 hover:bg-green-700 text-white"
										: "bg-green-600 hover:bg-green-700 text-white"
								}`}>
								<UserPlus size={16} className='mr-2' />
								Add Guests
							</motion.button>
						</PermissionGate>
						{guestDetails.length > 0 && (
							<PermissionGate permission={Permissions.RemoveMembersFromEvent}>
								<motion.button
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									onClick={() => setShowRemoveModal(true)}
									className={`flex items-center px-3 py-2 rounded-lg transition-all duration-300 text-sm ${
										theme === "dark"
											? "bg-red-600 hover:bg-red-700 text-white"
											: "bg-red-600 hover:bg-red-700 text-white"
									}`}>
									<UserMinus size={16} className='mr-2' />
									Remove Guests
								</motion.button>
							</PermissionGate>
						)}
					</div>
				</div>

				{/* Guest Details */}
				{guestDetails.length > 0 ? (
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
						{guestDetails.map((guest) => (
							<div
								key={guest._id}
								className={`p-3 rounded-lg border transition-all duration-300 ${
									theme === "dark"
										? "bg-gray-800/50 border-gray-700/50"
										: "bg-gray-50/50 border-gray-200/50"
								}`}>
								<div className='flex items-center space-x-3'>
									<div
										className={`w-8 h-8 rounded-full flex items-center justify-center ${
											theme === "dark" ? "bg-gray-700" : "bg-gray-200"
										}`}>
										<Users
											size={16}
											className={
												theme === "dark" ? "text-gray-300" : "text-gray-600"
											}
										/>
									</div>
									<div className='flex-1 min-w-0'>
										<p
											className={`font-medium text-sm transition-colors duration-300 break-words ${
												theme === "dark" ? "text-white" : "text-black"
											}`}>
											{guest.firstName} {guest.lastName}
										</p>
										<p
											className={`text-xs transition-colors duration-300 ${
												theme === "dark" ? "text-gray-400" : "text-gray-500"
											}`}>
											{guest.email}
										</p>
									</div>
								</div>
							</div>
						))}
					</div>
				) : (
					<div
						className={`p-6 text-center rounded-lg border-2 border-dashed transition-colors duration-300 ${
							theme === "dark"
								? "border-gray-700 text-gray-400"
								: "border-gray-300 text-gray-500"
						}`}>
						<Users
							size={24}
							className={`mx-auto mb-2 ${
								theme === "dark" ? "text-gray-600" : "text-gray-400"
							}`}
						/>
						<p className='text-sm'>No guests added yet</p>
					</div>
				)}
			</div>

			{/* Render modals using portals */}
			<AddGuestsModal />
			<RemoveGuestsModal />
		</div>
	);
};

export default GuestManagement;
