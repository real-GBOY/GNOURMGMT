/** @format */

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLocation, Link } from "react-router-dom";
import { Settings, LogOut, Menu, X } from "lucide-react";
import { AnimatedThemeToggler } from "../../components/magicui/animated-theme-toggler";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import RoleBasedNavigation from "./RoleBasedNavigation";
import CornerLights from "./CornerLights";
import SessionTimeoutWarning from "./SessionTimeoutWarning";

interface DashboardLayoutProps {
	children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
	const { theme, toggleTheme } = useTheme();
	const { logout } = useAuth();
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const location = useLocation();

	const handleLogout = () => {
		logout();
	};

	return (
		<div
			className={`min-h-screen transition-colors duration-300 ${
				theme === "dark" ? "bg-black text-white" : "bg-white text-black"
			}`}
			style={{
				backgroundImage: `
					linear-gradient(${
						theme === "dark" ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.05)"
					} 1px, transparent 1px),
					linear-gradient(90deg, ${
						theme === "dark" ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.05)"
					} 1px, transparent 1px)
				`,
				backgroundSize: "24px 24px",
				backgroundAttachment: "fixed",
			}}>
			{/* Corner Lights - positioned behind all content */}
			<CornerLights />

			{/* Mobile sidebar overlay */}
			{sidebarOpen && (
				<motion.div
					className='fixed inset-0 z-40 lg:hidden'
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					onClick={() => setSidebarOpen(false)}>
					<div className='absolute inset-0 bg-black/50 pointer-events-none' />
				</motion.div>
			)}

			{/* Sidebar */}
			<div
				className={`fixed inset-y-0 left-0 z-40 w-56 sm:w-64 transform transition-all duration-300 ${
					sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
				} ${
					theme === "dark"
						? "bg-gray-900/30 backdrop-blur-2xl border-r border-gray-700/50 shadow-2xl hover:shadow-3xl hover:border-gray-600/70"
						: "bg-white/40 backdrop-blur-2xl border-r border-gray-200/60 shadow-2xl hover:shadow-3xl hover:border-gray-300/80"
				}`}>
				{/* Sidebar Header */}
				<div
					className={`flex items-center justify-between h-16 px-3 sm:px-4 border-b transition-all duration-300 ${
						theme === "dark"
							? "border-gray-700/50 bg-gray-900/20 backdrop-blur-sm"
							: "border-gray-200/60 bg-white/20 backdrop-blur-sm"
					}`}>
					<Link
						to='/'
						className='flex items-center space-x-2 hover:opacity-80 transition-opacity duration-200'>
						<div
							className={`w-7 h-7 sm:w-8 sm:h-8 rounded-sm flex items-center justify-center transition-all duration-300 ${
								theme === "dark" ? "bg-white" : "bg-black"
							}`}>
							<span
								className={`font-semibold text-xs sm:text-sm ${
									theme === "dark" ? "text-black" : "text-white"
								}`}>
								▲
							</span>
						</div>
						<span className='font-semibold text-sm sm:text-base'>GNOUR</span>
					</Link>
					<button
						onClick={() => setSidebarOpen(false)}
						className='lg:hidden p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200'>
						<X size={18} />
					</button>
				</div>

				{/* Navigation */}
				<div className='mt-6 px-2'>
					<RoleBasedNavigation onItemClick={() => setSidebarOpen(false)} />
				</div>

				{/* Bottom Section */}
				<div
					className={`absolute bottom-0 left-0 right-0 p-2 sm:p-3 border-t transition-all duration-300 ${
						theme === "dark"
							? "border-gray-700/50 bg-gray-900/20 backdrop-blur-sm"
							: "border-gray-200/60 bg-white/20 backdrop-blur-sm"
					}`}>
					{/* Theme Toggle */}
					<div
						className={`w-full flex items-center justify-between px-2 py-2 text-xs font-medium rounded-xl transition-all duration-300 hover:scale-[1.02] ${
							theme === "dark"
								? "text-gray-300 hover:text-white hover:bg-gray-800/60 hover:backdrop-blur-sm hover:shadow-md"
								: "text-gray-700 hover:text-gray-900 hover:bg-gray-100/60 hover:backdrop-blur-sm hover:shadow-md"
						}`}>
						<span>Theme</span>
						<AnimatedThemeToggler className='p-1' />
					</div>

					{/* Logout Button */}
					<button
						onClick={handleLogout}
						className={`w-full flex items-center px-2 py-2 mt-2 text-xs font-medium rounded-xl transition-all duration-300 hover:scale-[1.02] ${
							theme === "dark"
								? "text-red-400 hover:text-red-300 hover:bg-red-900/30 hover:backdrop-blur-sm hover:shadow-md"
								: "text-red-600 hover:text-red-700 hover:bg-red-50/60 hover:backdrop-blur-sm hover:shadow-md"
						}`}>
						<LogOut size={14} className='mr-2' />
						Logout
					</button>
				</div>
			</div>

			{/* Main Content */}
			<div className='lg:pl-64 relative z-10'>
				{/* Top Bar */}
				<div
					className={`sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 border-b transition-all duration-300 ${
						theme === "dark"
							? "bg-black/60 backdrop-blur-xl border-gray-800/50 shadow-lg"
							: "bg-white/60 backdrop-blur-xl border-gray-200/50 shadow-lg"
					}`}>
					<div className='flex items-center space-x-3'>
						<button
							onClick={() => setSidebarOpen(true)}
							className='lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200'>
							<Menu size={20} />
						</button>
						<div className='hidden sm:block'>
							<div
								className={`text-sm ${
									theme === "dark" ? "text-gray-400" : "text-gray-600"
								}`}>
								Welcome back
							</div>
						</div>
					</div>

					<div className='flex items-center space-x-2 sm:space-x-4'>
						<div className='sm:hidden'>
							<div
								className={`text-xs ${
									theme === "dark" ? "text-gray-400" : "text-gray-600"
								}`}>
								Welcome
							</div>
						</div>
					</div>
				</div>

				{/* Page Content */}
				<main className='p-4 sm:p-6 lg:p-8 lg:pl-12'>{children}</main>
			</div>

			{/* Session Timeout Warning */}
			<SessionTimeoutWarning timeoutMinutes={5} />
		</div>
	);
};

export default DashboardLayout;
