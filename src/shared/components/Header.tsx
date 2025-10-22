/** @format */

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, LogOut, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { AnimatedThemeToggler } from "../../components/magicui/animated-theme-toggler";

const Header: React.FC = () => {
	const [isMenuOpen, setIsMenuOpen] = React.useState(false);
	const { theme, toggleTheme } = useTheme();
	const { isAuthenticated, user, logout } = useAuth();

	const closeMobileMenu = () => {
		setIsMenuOpen(false);
	};

	const handleLogout = () => {
		logout();
		closeMobileMenu();
	};

	return (
		<motion.header
			className={`relative z-40 border-b backdrop-blur-md transition-all duration-300 ${
				theme === "dark"
					? "border-gray-800 bg-black/80 text-white"
					: "border-gray-200 bg-white/80 text-black"
			}`}
			initial={{ opacity: 0, y: -10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4 }}>
			<nav className='max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between md:justify-start'>
				{/* Logo */}
				<motion.div
					className='flex items-center space-x-3 flex-shrink-0'
					whileHover={{ scale: 1.05 }}
					transition={{ duration: 0.2 }}>
					<Link to='/'>
						<motion.div
							className={`w-8 h-8 rounded-sm flex items-center justify-center transition-all duration-300 ${
								theme === "dark"
									? "bg-white/90 text-black"
									: "bg-black/90 text-white"
							}`}
							whileHover={{
								scale: 1.1,
								rotate: 5,
								transition: { duration: 0.2 },
							}}>
							<span className='font-semibold text-sm'>▲</span>
						</motion.div>
					</Link>
					<Link to='/'>
						<span className='font-semibold text-lg sm:text-xl tracking-tight hover:opacity-80 transition-opacity duration-200'>
							GNOUR
						</span>
					</Link>
				</motion.div>

				{/* Centered Desktop Navigation */}
				<div className='hidden md:flex items-center space-x-6 mx-auto'>
					{isAuthenticated ? (
						// Logged in: Dashboard and Developers
						<>
							<motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
								<Link
									to='/dashboard/applicants'
									className={`text-sm font-medium transition-all duration-300 ${
										theme === "dark"
											? "text-gray-300 hover:text-white"
											: "text-gray-600 hover:text-black"
									}`}>
									Dashboard
								</Link>
							</motion.div>
							<motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
								<Link
									to='/developers'
									className={`text-sm font-medium transition-all duration-300 ${
										theme === "dark"
											? "text-gray-300 hover:text-white"
											: "text-gray-600 hover:text-black"
									}`}>
									Developers
								</Link>
							</motion.div>
						</>
					) : (
						// Logged out: Developers and Sign In
						<>
							<motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
								<Link
									to='/developers'
									className={`text-sm font-medium transition-all duration-300 ${
										theme === "dark"
											? "text-gray-300 hover:text-white"
											: "text-gray-600 hover:text-black"
									}`}>
									Developers
								</Link>
							</motion.div>
							<motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
								<Link
									to='/login'
									className={`text-sm font-medium transition-all duration-300 ${
										theme === "dark"
											? "text-gray-300 hover:text-white"
											: "text-gray-600 hover:text-black"
									}`}>
									Sign In
								</Link>
							</motion.div>
						</>
					)}
				</div>

				{/* Right Side */}
				<div className='flex items-center space-x-4 flex-shrink-0'>
					{/* Desktop Authentication Section */}
					<div className='hidden md:flex items-center space-x-4'>
						{isAuthenticated && (
							// User Profile Section
							<div className='flex items-center space-x-3'>
								{/* User Info */}
								<motion.div
									className='flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-300'
									whileHover={{ scale: 1.02 }}
									transition={{ duration: 0.2 }}>
									<div className='w-8 h-8 rounded-full overflow-hidden'>
										{user?.profilePicture ? (
											<img
												src={user.profilePicture}
												alt={`${user.firstName} ${user.lastName}`}
												className='w-full h-full object-cover'
											/>
										) : (
											<div className='w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center'>
												<User size={16} className='text-white' />
											</div>
										)}
									</div>
									<div className='text-left'>
										<p
											className={`text-sm font-medium ${
												theme === "dark" ? "text-white" : "text-black"
											}`}>
											{user?.firstName} {user?.lastName}
										</p>
										<p
											className={`text-xs ${
												theme === "dark" ? "text-gray-400" : "text-gray-600"
											}`}>
											{user?.role?.key || "User"}
										</p>
									</div>
								</motion.div>

								{/* Profile Link */}
								<motion.div
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									transition={{ duration: 0.2 }}>
									<Link
										to='/dashboard/profile'
										className={`p-2 rounded-md transition-all duration-300 ${
											theme === "dark"
												? "text-gray-300 hover:text-white hover:bg-white/10"
												: "text-gray-600 hover:text-black hover:bg-black/10"
										}`}>
										<Settings size={18} />
									</Link>
								</motion.div>

								{/* Logout Button */}
								<motion.div
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									transition={{ duration: 0.2 }}>
									<button
										onClick={handleLogout}
										className={`p-2 rounded-md transition-all duration-300 ${
											theme === "dark"
												? "text-red-400 hover:text-red-300 hover:bg-red-500/10"
												: "text-red-600 hover:text-red-700 hover:bg-red-500/10"
										}`}>
										<LogOut size={18} />
									</button>
								</motion.div>
							</div>
						)}
					</div>

					{/* Theme Toggle */}
					<motion.div
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.95 }}
						transition={{ duration: 0.2 }}>
						<AnimatedThemeToggler
							className={`p-2 rounded-md transition-all duration-300 ${
								theme === "dark"
									? "text-gray-300 hover:text-white hover:bg-white/10"
									: "text-gray-600 hover:text-black hover:bg-black/10"
							}`}
						/>
					</motion.div>

					{/* Mobile Menu Button */}
					<motion.button
						className={`md:hidden p-2 rounded-md transition-all duration-300 ${
							theme === "dark"
								? "hover:bg-white/10 text-white"
								: "hover:bg-black/10 text-black"
						}`}
						onClick={() => setIsMenuOpen(!isMenuOpen)}
						aria-label='Toggle mobile menu'
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.95 }}
						transition={{ duration: 0.2 }}>
						{isMenuOpen ? <X size={20} /> : <Menu size={20} />}
					</motion.button>
				</div>
			</nav>

			{/* Mobile Menu */}
			<AnimatePresence>
				{isMenuOpen && (
					<motion.div
						className={`md:hidden border-t backdrop-blur-md overflow-hidden ${
							theme === "dark"
								? "border-gray-700 bg-black/90"
								: "border-gray-200 bg-white/90"
						}`}
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						transition={{
							duration: 0.3,
							ease: "easeInOut",
						}}>
						<motion.div
							className='px-4 sm:px-6 py-6 space-y-4'
							initial={{ opacity: 0, y: -20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							transition={{
								duration: 0.3,
								delay: 0.1,
								ease: "easeOut",
							}}>
							{/* Main Navigation */}
							<div className='space-y-3'>
								{isAuthenticated ? (
									// Logged in: Dashboard and Developers
									<>
										<motion.div
											whileHover={{ x: 5 }}
											initial={{ opacity: 0, x: -10 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ duration: 0.3, delay: 0.2 }}>
											<Link
												to='/dashboard'
												onClick={closeMobileMenu}
												className={`block text-base font-medium py-2 transition-all duration-300 ${
													theme === "dark"
														? "text-gray-300 hover:text-white"
														: "text-gray-700 hover:text-black"
												}`}>
												Dashboard
											</Link>
										</motion.div>
										<motion.div
											whileHover={{ x: 5 }}
											initial={{ opacity: 0, x: -10 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ duration: 0.3, delay: 0.25 }}>
											<Link
												to='/developers'
												onClick={closeMobileMenu}
												className={`block text-base font-medium py-2 transition-all duration-300 ${
													theme === "dark"
														? "text-gray-300 hover:text-white"
														: "text-gray-700 hover:text-black"
												}`}>
												Developers
											</Link>
										</motion.div>
									</>
								) : (
									// Logged out: Developers and Sign In
									<>
										<motion.div
											whileHover={{ x: 5 }}
											initial={{ opacity: 0, x: -10 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ duration: 0.3, delay: 0.2 }}>
											<Link
												to='/developers'
												onClick={closeMobileMenu}
												className={`block text-base font-medium py-2 transition-all duration-300 ${
													theme === "dark"
														? "text-gray-300 hover:text-white"
														: "text-gray-700 hover:text-black"
												}`}>
												Developers
											</Link>
										</motion.div>

										<motion.div
											whileHover={{ x: 5 }}
											initial={{ opacity: 0, x: -10 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ duration: 0.3, delay: 0.3 }}>
											<Link
												to='/login'
												onClick={closeMobileMenu}
												className={`block text-base font-medium py-2 transition-all duration-300 ${
													theme === "dark"
														? "text-gray-300 hover:text-white"
														: "text-gray-700 hover:text-black"
												}`}>
												Sign In
											</Link>
										</motion.div>
									</>
								)}
							</div>

							{/* Divider */}
							<motion.hr
								className={`transition-colors duration-300 ${
									theme === "dark" ? "border-gray-700" : "border-gray-200"
								}`}
								initial={{ scaleX: 0 }}
								animate={{ scaleX: 1 }}
								transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
							/>

							{/* Theme Toggle Section */}
							<motion.div
								className='flex items-center justify-between py-2'
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.3, delay: 0.4, ease: "easeOut" }}>
								<span
									className={`text-sm font-medium transition-colors duration-300 ${
										theme === "dark" ? "text-gray-400" : "text-gray-600"
									}`}>
									Theme
								</span>
								<motion.div
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.95 }}
									transition={{ duration: 0.2 }}>
									<AnimatedThemeToggler className='p-2' />
								</motion.div>
							</motion.div>

							{/* Authentication Section for Mobile */}
							{isAuthenticated ? (
								// User Profile Section for Mobile
								<div className='space-y-3'>
									{/* User Info */}
									<motion.div
										className='flex items-center space-x-3 p-3 rounded-md bg-gradient-to-r from-blue-500/10 to-purple-500/10'
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.3, delay: 0.5, ease: "easeOut" }}>
										<div className='w-10 h-10 rounded-full overflow-hidden'>
											{user?.profilePicture ? (
												<img
													src={user.profilePicture}
													alt={`${user.firstName} ${user.lastName}`}
													className='w-full h-full object-cover'
												/>
											) : (
												<div className='w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center'>
													<User size={20} className='text-white' />
												</div>
											)}
										</div>
										<div className='flex-1'>
											<p
												className={`font-medium ${
													theme === "dark" ? "text-white" : "text-black"
												}`}>
												{user?.firstName} {user?.lastName}
											</p>
											<p
												className={`text-sm ${
													theme === "dark" ? "text-gray-400" : "text-gray-600"
												}`}>
												{user?.role?.key || "User"}
											</p>
										</div>
									</motion.div>

									{/* Profile Link */}
									<motion.div
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.3, delay: 0.6, ease: "easeOut" }}
										whileHover={{ x: 5 }}>
										<Link
											to='/dashboard/profile'
											onClick={closeMobileMenu}
											className={`flex items-center space-x-3 py-3 px-3 rounded-md transition-all duration-300 ${
												theme === "dark"
													? "text-gray-300 hover:text-white hover:bg-white/10"
													: "text-gray-700 hover:text-black hover:bg-black/10"
											}`}>
											<Settings size={18} />
											<span>Profile Settings</span>
										</Link>
									</motion.div>

									{/* Logout Button */}
									<motion.div
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.3, delay: 0.7, ease: "easeOut" }}
										whileHover={{ x: 5 }}>
										<button
											onClick={handleLogout}
											className={`w-full flex items-center space-x-3 py-3 px-3 rounded-md transition-all duration-300 ${
												theme === "dark"
													? "text-red-400 hover:text-red-300 hover:bg-red-500/10"
													: "text-red-600 hover:text-red-700 hover:bg-red-500/10"
											}`}>
											<LogOut size={18} />
											<span>Sign Out</span>
										</button>
									</motion.div>
								</div>
							) : (
								// Login Section for Mobile
								<div className='space-y-3'>
									{/* Sign In Button */}
									<motion.div
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.3, delay: 0.6, ease: "easeOut" }}
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}>
										<Link
											to='/login'
											onClick={closeMobileMenu}
											className={`w-full px-4 py-3 rounded-md text-sm font-medium text-center transition-all duration-300 ${
												theme === "dark"
													? "bg-white text-black hover:bg-gray-100"
													: "bg-black text-white hover:bg-gray-800"
											}`}>
											Sign In
										</Link>
									</motion.div>
								</div>
							)}
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.header>
	);
};

export default Header;
