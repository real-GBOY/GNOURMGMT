/** @format */

import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";

const AboutSection: React.FC = () => {
	const { theme } = useTheme();

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: { opacity: 1, y: 0 },
	};

	return (
		<motion.section
			className='mt-32 max-w-6xl mx-auto px-6'
			variants={itemVariants}>
			<div className='text-center mb-16'>
				<motion.div
					className={`inline-flex items-center space-x-2 rounded-full px-4 py-2 mb-6 border transition-colors duration-300 ${
						theme === "dark"
							? "bg-gray-900 border-gray-800"
							: "bg-gray-50 border-gray-200"
					}`}
					variants={itemVariants}>
					<div className='w-2 h-2 bg-blue-500 rounded-full'></div>
					<span
						className={`text-sm font-medium transition-colors duration-300 ${
							theme === "dark" ? "text-gray-400" : "text-gray-600"
						}`}>
						About Our Platform
					</span>
				</motion.div>
				<motion.h2
					className={`text-4xl md:text-5xl font-bold mb-6 leading-tight transition-colors duration-300 ${
						theme === "dark" ? "text-white" : "text-black"
					}`}
					variants={itemVariants}>
					Built by the team,
					<br />
					<span
						className={`bg-gradient-to-r bg-clip-text text-transparent transition-all duration-300 ${
							theme === "dark"
								? "from-blue-400 via-purple-400 to-pink-400"
								: "from-blue-600 via-purple-600 to-pink-600"
						}`}>
						for the team
					</span>
				</motion.h2>
				<motion.p
					className={`text-xl max-w-2xl mx-auto leading-relaxed transition-colors duration-300 ${
						theme === "dark" ? "text-gray-400" : "text-gray-600"
					}`}
					variants={itemVariants}>
					Empowering Enactus Menoufia with tools that match how we actually work
				</motion.p>
			</div>

			<motion.div
				className={`relative overflow-hidden rounded-3xl p-8 md:p-16 border backdrop-blur-xl transition-all duration-300 ${
					theme === "dark"
						? "bg-gray-900/20 border-gray-700/50 shadow-2xl shadow-black/20"
						: "bg-white/20 border-gray-200/50 shadow-2xl shadow-gray-200/50"
				}`}
				variants={itemVariants}>
				{/* Background Pattern */}
				<div className='absolute inset-0 opacity-5'>
					<div className='absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500'></div>
				</div>

				<div className='relative max-w-4xl mx-auto'>
					{/* Main Content */}
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16'>
						<div className='space-y-6'>
							<motion.div
								className={`inline-flex items-center space-x-2 rounded-full px-4 py-2 border transition-colors duration-300 ${
									theme === "dark"
										? "bg-gray-800 border-gray-700"
										: "bg-white border-gray-200"
								}`}
								variants={itemVariants}>
								<div className='w-2 h-2 bg-green-500 rounded-full'></div>
								<span
									className={`text-sm font-medium transition-colors duration-300 ${
										theme === "dark" ? "text-gray-300" : "text-gray-700"
									}`}>
									All-in-One Solution
								</span>
							</motion.div>

							<motion.h3
								className={`text-3xl font-bold leading-tight transition-colors duration-300 ${
									theme === "dark" ? "text-white" : "text-black"
								}`}
								variants={itemVariants}>
								Streamline operations, boost productivity, and enhance
								collaboration
							</motion.h3>

							<motion.p
								className={`text-lg leading-relaxed transition-colors duration-300 ${
									theme === "dark" ? "text-gray-300" : "text-gray-700"
								}`}
								variants={itemVariants}>
								<strong
									className={`font-semibold transition-colors duration-300 ${
										theme === "dark" ? "text-white" : "text-black"
									}`}>
									GNOUR
								</strong>{" "}
								is an all-in-one management system developed specifically for
								Enactus Menoufia. Built by the team, for the team — GNOUR is
								designed to streamline operations, boost productivity, and
								enhance collaboration across all departments.
							</motion.p>
						</div>

						<div
							className={`relative p-8 rounded-2xl border backdrop-blur-md transition-colors duration-300 ${
								theme === "dark"
									? "bg-gray-800/30 border-gray-700/50"
									: "bg-white/30 border-gray-200/50"
							}`}>
							<div className='space-y-4'>
								<div className='flex items-center space-x-3'>
									<div
										className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-300 ${
											theme === "dark" ? "bg-blue-600" : "bg-blue-500"
										}`}>
										<svg
											className='w-5 h-5 text-white'
											fill='none'
											stroke='currentColor'
											viewBox='0 0 24 24'>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
											/>
										</svg>
									</div>
									<div>
										<h4
											className={`font-semibold transition-colors duration-300 ${
												theme === "dark" ? "text-white" : "text-black"
											}`}>
											Project Management
										</h4>
										<p
											className={`text-sm transition-colors duration-300 ${
												theme === "dark" ? "text-gray-400" : "text-gray-600"
											}`}>
											Track progress and manage deadlines
										</p>
									</div>
								</div>

								<div className='flex items-center space-x-3'>
									<div
										className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-300 ${
											theme === "dark" ? "bg-green-600" : "bg-green-500"
										}`}>
										<svg
											className='w-5 h-5 text-white'
											fill='none'
											stroke='currentColor'
											viewBox='0 0 24 24'>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
											/>
										</svg>
									</div>
									<div>
										<h4
											className={`font-semibold transition-colors duration-300 ${
												theme === "dark" ? "text-white" : "text-black"
											}`}>
											Team Collaboration
										</h4>
										<p
											className={`text-sm transition-colors duration-300 ${
												theme === "dark" ? "text-gray-400" : "text-gray-600"
											}`}>
											Share resources and communicate effectively
										</p>
									</div>
								</div>

								<div className='flex items-center space-x-3'>
									<div
										className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-300 ${
											theme === "dark" ? "bg-purple-600" : "bg-purple-500"
										}`}>
										<svg
											className='w-5 h-5 text-white'
											fill='none'
											stroke='currentColor'
											viewBox='0 0 24 24'>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M13 10V3L4 14h7v7l9-11h-7z'
											/>
										</svg>
									</div>
									<div>
										<h4
											className={`font-semibold transition-colors duration-300 ${
												theme === "dark" ? "text-white" : "text-black"
											}`}>
											Innovation Focus
										</h4>
										<p
											className={`text-sm transition-colors duration-300 ${
												theme === "dark" ? "text-gray-400" : "text-gray-600"
											}`}>
											Focus on creating social impact
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Additional Content */}
					<div className='space-y-6'>
						<motion.p
							className={`text-lg leading-relaxed transition-colors duration-300 ${
								theme === "dark" ? "text-gray-300" : "text-gray-700"
							}`}
							variants={itemVariants}>
							Whether you're managing projects, organizing meetings, assigning
							tasks, or sharing resources, GNOUR gives you a centralized
							platform to handle everything with clarity and control.
						</motion.p>

						<motion.p
							className={`text-lg leading-relaxed transition-colors duration-300 ${
								theme === "dark" ? "text-gray-300" : "text-gray-700"
							}`}
							variants={itemVariants}>
							This system reflects the real needs of Enactus members, providing
							tools that match how we actually work — making it easier to focus
							on innovation, impact, and teamwork.
						</motion.p>
					</div>

					{/* Call to Action */}
					<motion.div className='mt-12 text-center' variants={itemVariants}>
						<button
							className={`px-8 py-4 font-semibold rounded-xl transition-all duration-200 transform hover:-translate-y-1 backdrop-blur-md ${
								theme === "dark"
									? "bg-gradient-to-r from-blue-600/90 to-purple-600/90 text-white hover:from-blue-700/90 hover:to-purple-700/90 shadow-lg shadow-black/30 hover:shadow-xl hover:shadow-black/40 border border-blue-500/20"
									: "bg-gradient-to-r from-blue-500/90 to-purple-500/90 text-white hover:from-blue-600/90 hover:to-purple-600/90 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 border border-blue-500/20"
							}`}>
							Get Started with GNOUR
						</button>
					</motion.div>
				</div>
			</motion.div>
		</motion.section>
	);
};

export default AboutSection;
