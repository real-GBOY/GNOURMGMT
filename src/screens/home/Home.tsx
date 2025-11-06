/** @format */

import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { useTheme } from "../../shared/contexts/ThemeContext";

import { BoxReveal } from "../../components/magicui/box-reveal";
import Shuffle from "../../components/magicui/shuffle";

const Home: React.FC = () => {
	const { theme } = useTheme();

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
				delayChildren: 0.2,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: { opacity: 1, y: 0 },
	};

	return (
		<motion.main
			className='relative z-10 max-w-6xl mx-auto px-4 sm:px-8 pt-16 sm:pt-24 pb-16 sm:pb-24'
			variants={containerVariants}
			initial='hidden'
			animate='visible'>
			<div className='text-center'>
				{/* Badge */}
				<motion.div
					className={`inline-flex items-center space-x-2 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-6 sm:mb-8 border transition-colors duration-300 ${
						theme === "dark"
							? "bg-gray-900 border-gray-800"
							: "bg-gray-50 border-gray-200"
					}`}
					variants={itemVariants}>
					<div className='w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full'></div>
					<span
						className={`text-xs sm:text-sm font-medium transition-colors duration-300 ${
							theme === "dark" ? "text-gray-400" : "text-gray-600"
						}`}>
						Now Open to All Members
					</span>
					<ExternalLink
						size={12}
						className={`transition-colors duration-300 ${
							theme === "dark" ? "text-gray-500" : "text-gray-400"
						}`}
					/>
				</motion.div>

				{/* Main Heading */}
				<BoxReveal boxColor={"#06b6d4"} duration={0.5}>
					<motion.h1
						className='text-3xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 leading-[1.1] tracking-tight'
						variants={itemVariants}>
						Enactus Menoufia
						<br />
						<span
							className={`bg-gradient-to-r bg-clip-text text-transparent transition-all duration-300 ${
								theme === "dark"
									? "from-gray-100 via-white to-gray-300"
									: "from-gray-900 via-black to-gray-700"
							}`}>
							Management System
						</span>
					</motion.h1>
				</BoxReveal>

				{/* Subtext */}
				<BoxReveal boxColor={"#06b6d4"} duration={0.5}>
					<motion.p
						className={`text-base sm:text-xl mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed font-medium transition-colors duration-300 ${
							theme === "dark" ? "text-gray-400" : "text-gray-600"
						}`}
						variants={itemVariants}>
						comprehensive platform designed to streamline the management of
						Enactus Menoufia’s social impact projects.{" "}
					</motion.p>
				</BoxReveal>

				{/* Buttons */}
				<BoxReveal boxColor={"#06b6d4"} duration={0.5}>
					<motion.div
						className='flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 sm:mb-16'
						variants={itemVariants}>
						<Link
							to='/developers'
							className={`px-4 sm:px-6 py-2.5 sm:py-3 font-medium rounded-md transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base ${
								theme === "dark"
									? "bg-white text-black hover:bg-gray-200"
									: "bg-black text-white hover:bg-gray-800"
							}`}>
							Developers
						</Link>
					</motion.div>
				</BoxReveal>
			</div>

			{/* Under Maintenance */}
			<BoxReveal boxColor={"#06b6d4"} duration={0.5}>
				<motion.section
					className={`mt-6 sm:mt-8 md:mt-12 p-6 sm:p-8 md:p-12 rounded-xl sm:rounded-2xl border transition-colors duration-300 ${
						theme === "dark"
							? "bg-slate-900/40 border-slate-800"
							: "bg-white/70 border-slate-200"
					}`}
					variants={itemVariants}>
					<motion.div
						className='flex flex-col items-center justify-center text-center space-y-4'
						variants={itemVariants}>
						<motion.div
							className={`text-4xl sm:text-5xl md:text-6xl mb-4 ${
								theme === "dark" ? "text-slate-300" : "text-slate-600"
							}`}
							variants={itemVariants}>
							🔧
						</motion.div>
						<Shuffle
							text='Under Maintenance'
							shuffleDirection='right'
							duration={0.35}
							animationMode='evenodd'
							shuffleTimes={1}
							ease='power3.out'
							stagger={0.03}
							threshold={0.1}
							triggerOnce={true}
							triggerOnHover={true}
							respectReducedMotion={true}
							tag='h2'
							className={`text-xl sm:text-2xl md:text-3xl font-semibold mb-2 ${
								theme === "dark" ? "text-slate-100" : "text-slate-900"
							}`}
							style={{
								fontFamily: "inherit",
								textTransform: "none",
								fontSize: "inherit",
								lineHeight: "inherit",
							}}
						/>
						<Shuffle
							text="We're currently working on improving the application form. Please check back soon!"
							shuffleDirection='right'
							duration={0.35}
							animationMode='evenodd'
							shuffleTimes={1}
							ease='power3.out'
							stagger={0.03}
							threshold={0.1}
							triggerOnce={true}
							triggerOnHover={true}
							respectReducedMotion={true}
							tag='p'
							className={`text-sm sm:text-base md:text-lg max-w-md mx-auto ${
								theme === "dark" ? "text-slate-400" : "text-slate-600"
							}`}
							style={{
								fontFamily: "inherit",
								textTransform: "none",
								fontSize: "inherit",
								lineHeight: "inherit",
							}}
						/>
					</motion.div>
				</motion.section>
			</BoxReveal>
		</motion.main>
	);
};

export default Home;
