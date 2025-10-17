/** @format */

import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../shared/contexts/ThemeContext";
import { BoxReveal } from "../../components/magicui/box-reveal";
import {
	Github,
	Linkedin,
	Mail,
	Code,
	Palette,
	Zap,
	Download,
} from "lucide-react";

const Developers: React.FC = () => {
	const { theme } = useTheme();

	const developers = [
		{
			name: "Mahmoud Nayel",
			role: "Full Stack Developer",
			avatar: "https://i.postimg.cc/c1mWVKsp/COpy.jpg",
			description:
				"I'm a full-stack developer specialized in building scalable and user-friendly web applications using React, Node.js, MongoDB, and Firebase. Driven by hands-on projects, I write clean, efficient code to create responsive frontends and robust backends, always aiming to deliver seamless digital experiences.",
			description2:
				"Continuously sharpening my skills, I enjoy solving complex problems and exploring new technologies to stay at the forefront of modern web development. I'm passionate about crafting solutions that not only work well but also provide real value to users.",
			skills: [
				"React",
				"Node.js",
				"TypeScript",
				"MongoDB",
				"Firebase",
				"tailwind css",
				"Material UI",
				"Bootstrap",
				"CSS/SCSS",
				"UI/UX Design",
				"Animation",
			],
			github: "https://github.com/mahmoudnayel",
			linkedin: "https://www.linkedin.com/in/mahmoud-mohamed-nayel-363b47222/",
			email: "mahmoud.nayel@example.com",

			cv: "/GoldenCV.pdf",
		},
		{
			name: "Mohamed Sabri",
			role: "Full Stack Developer",
			avatar:
				"https://i.postimg.cc/4y8yhLc2/Whats-App-Image-2025-08-11-at-00-33-06-f3dfa429.jpg",
			description: "",
			description2:
				"Mohamed Sabri — A full-stack developer with experience in building and optimizing web applications using modern front-end and back-end technologies. Skilled in designing user-friendly interfaces, integrating APIs, and ensuring scalable, high-performance solutions. Passionate about problem-solving, continuous learning, and staying up to date with emerging trends in the tech industry",
			skills: [
				"React",
				"Node.js",
				"TypeScript",
				".net",
				"MongoDB",
				"Firebase",
				"Tailwind CSS",
				"Material UI",
				"CSS/SCSS",
				"UI/UX Design",
				"Animation",
			],
			github: "https://github.com/MohmaedSabri",
			linkedin: "https://www.linkedin.com/in/mohamed-sabri-4a8305354/",
			email: "mohamedheiba2024@gmail.com",
			cv: "/Developer2CV.pdf",
		},
	];

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.3,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.6,
				ease: "easeOut" as const,
			},
		},
	};

	return (
		<div className='min-h-screen py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8'>
			<motion.div
				className='max-w-7xl mx-auto'
				variants={containerVariants}
				initial='hidden'
				animate='visible'>
				{/* Header Section */}
				<BoxReveal
					boxColor={theme === "dark" ? "#06b6d4" : "#06b6d4"}
					duration={0.8}>
					<motion.div
						className='text-center mb-12 sm:mb-16'
						variants={itemVariants}>
						<motion.h1
							className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 ${
								theme === "dark" ? "text-white" : "text-gray-900"
							}`}
							initial={{ opacity: 0, y: -20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8 }}>
							Meet{" "}
							<span className='inline-flex items-center font-mono'>
								<span
									className={`${
										theme === "dark" ? "text-blue-400" : "text-blue-400"
									}`}>
									&lt;
								</span>
								<span
									className={`font-bold mx-1 ${
										theme === "dark" ? "text-white" : "text-black"
									}`}>
									GVI
								</span>
								<span
									className={`${
										theme === "dark" ? "text-blue-400" : "text-blue-400"
									}`}>
									/&gt;
								</span>
							</span>{" "}
							Team
						</motion.h1>
						<motion.p
							className={`text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto px-4 ${
								theme === "dark" ? "text-gray-300" : "text-gray-600"
							}`}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 0.2 }}>
							We are passionate developers dedicated to creating exceptional
							digital experiences
						</motion.p>
					</motion.div>
				</BoxReveal>

				{/* Developers Section */}
				<div className='space-y-20 sm:space-y-24 lg:space-y-32'>
					{developers.map((dev, index) => (
						<BoxReveal
							key={dev.name}
							boxColor={theme === "dark" ? "#06b6d4" : "#06b6d4"}
							duration={0.6}>
							<motion.div
								className='container mx-auto px-4 sm:px-6'
								variants={itemVariants}>
								<div
									className={`grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center ${
										index % 2 === 1 ? "lg:grid-flow-col-dense" : ""
									}`}>
									{/* Text Content */}
									<motion.div
										className={`${
											index % 2 === 1 ? "lg:col-start-2" : ""
										} order-2 lg:order-1`}
										initial={{ opacity: 0, x: index % 2 === 1 ? 50 : -50 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ duration: 0.6 }}>
										<h1
											className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 ${
												theme === "dark" ? "text-white" : "text-gray-900"
											}`}>
											About {dev.name.split(" ")[0]}
										</h1>
										<p
											className={`text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed ${
												theme === "dark" ? "text-gray-300" : "text-gray-600"
											}`}>
											{dev.description}
										</p>
										<p
											className={`text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed ${
												theme === "dark" ? "text-gray-300" : "text-gray-600"
											}`}>
											{dev.description2}
										</p>

										{/* Skills */}
										<div className='mb-6 sm:mb-8'>
											<h4
												className={`text-sm font-semibold uppercase tracking-wider mb-3 ${
													theme === "dark" ? "text-gray-400" : "text-gray-500"
												}`}>
												Skills
											</h4>
											<div className='flex flex-wrap gap-2'>
												{dev.skills.map((skill, skillIndex) => (
													<motion.span
														key={skill}
														className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium ${
															theme === "dark"
																? "bg-blue-900/50 text-blue-300 border border-blue-800"
																: "bg-blue-100 text-blue-800 border border-blue-200"
														}`}
														initial={{ opacity: 0, scale: 0.8 }}
														animate={{ opacity: 1, scale: 1 }}
														transition={{ delay: skillIndex * 0.1 }}
														whileHover={{ scale: 1.1 }}>
														{skill}
													</motion.span>
												))}
											</div>
										</div>

										{/* Social Links & CV */}
										<div className='flex items-center space-x-3 sm:space-x-4 mb-6'>
											<motion.a
												href={dev.github}
												target='_blank'
												rel='noopener noreferrer'
												className={`p-2.5 sm:p-3 rounded-lg transition-all duration-300 ${
													theme === "dark"
														? "bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white"
														: "bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900"
												}`}
												whileHover={{ scale: 1.1, y: -2 }}
												whileTap={{ scale: 0.95 }}>
												<Github className='w-4 h-4 sm:w-5 sm:h-5' />
											</motion.a>
											<motion.a
												href={dev.linkedin}
												target='_blank'
												rel='noopener noreferrer'
												className={`p-2.5 sm:p-3 rounded-lg transition-all duration-300 ${
													theme === "dark"
														? "bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white"
														: "bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900"
												}`}
												whileHover={{ scale: 1.1, y: -2 }}
												whileTap={{ scale: 0.95 }}>
												<Linkedin className='w-4 h-4 sm:w-5 sm:h-5' />
											</motion.a>
											<motion.a
												href={`mailto:${dev.email}`}
												className={`p-2.5 sm:p-3 rounded-lg transition-all duration-300 ${
													theme === "dark"
														? "bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white"
														: "bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900"
												}`}
												whileHover={{ scale: 1.1, y: -2 }}
												whileTap={{ scale: 0.95 }}>
												<Mail className='w-4 h-4 sm:w-5 sm:h-5' />
											</motion.a>
										</div>

										{/* Download CV Button */}
										<motion.button
											className={`inline-flex items-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium transition-all duration-300 text-sm sm:text-base ${
												theme === "dark"
													? "bg-blue-600 hover:bg-blue-700 text-white"
													: "bg-blue-600 hover:bg-blue-700 text-white"
											}`}
											onClick={() => {
												const link = document.createElement("a");
												link.href = dev.cv;
												link.download = dev.cv.split("/").pop() || "CV.pdf";
												document.body.appendChild(link);
												link.click();
												document.body.removeChild(link);
											}}
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.95 }}>
											<Download size={16} className='sm:w-4 sm:h-4' />
											<span>Download CV</span>
										</motion.button>
									</motion.div>

									{/* Image Section */}
									<motion.div
										className={`relative order-1 lg:order-2 ${
											index % 2 === 1 ? "lg:col-start-1" : ""
										}`}
										initial={{ opacity: 0, x: index % 2 === 1 ? -50 : 50 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ duration: 0.6, delay: 0.2 }}>
										<div className='relative z-10 rounded-xl overflow-hidden h-[300px] sm:h-[400px] lg:h-[500px]'>
											<img
												src={dev.avatar}
												alt={`${dev.name} - ${dev.role}`}
												className='w-full h-full object-cover'
											/>
										</div>
									</motion.div>
								</div>
							</motion.div>
						</BoxReveal>
					))}
				</div>

				{/* Team Values Section */}
				<BoxReveal
					boxColor={theme === "dark" ? "#06b6d4" : "#06b6d4"}
					duration={0.7}>
					<motion.div
						className='text-center mt-20 sm:mt-24 lg:mt-32'
						variants={itemVariants}>
						<h2
							className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 ${
								theme === "dark" ? "text-white" : "text-gray-900"
							}`}>
							Our Values
						</h2>
						<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-4 sm:px-0'>
							{[
								{
									icon: <Code className='w-10 h-10 sm:w-12 sm:h-12' />,
									title: "Clean Code",
									description:
										"We write maintainable, scalable code that stands the test of time",
								},
								{
									icon: <Palette className='w-10 h-10 sm:w-12 sm:h-12' />,
									title: "Beautiful Design",
									description:
										"We create interfaces that are both functional and visually stunning",
								},
								{
									icon: <Zap className='w-10 h-10 sm:w-12 sm:h-12' />,
									title: "Performance",
									description:
										"We optimize for speed and efficiency in everything we build",
								},
							].map((value, index) => (
								<motion.div
									key={value.title}
									className={`p-4 sm:p-6 rounded-xl ${
										theme === "dark"
											? "bg-gray-900/50 border border-gray-800"
											: "bg-white/80 border border-gray-200"
									} ${index === 2 ? "sm:col-span-2 lg:col-span-1" : ""}`}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: index * 0.2 }}
									whileHover={{ y: -5 }}>
									<div
										className={`inline-flex p-2.5 sm:p-3 rounded-lg mb-3 sm:mb-4 ${
											theme === "dark" ? "bg-blue-900/50" : "bg-blue-100"
										}`}>
										<div
											className={
												theme === "dark" ? "text-blue-400" : "text-blue-600"
											}>
											{value.icon}
										</div>
									</div>
									<h3
										className={`text-lg sm:text-xl font-semibold mb-2 sm:mb-3 ${
											theme === "dark" ? "text-white" : "text-gray-900"
										}`}>
										{value.title}
									</h3>
									<p
										className={`text-sm sm:text-base ${
											theme === "dark" ? "text-gray-300" : "text-gray-600"
										}`}>
										{value.description}
									</p>
								</motion.div>
							))}
						</div>
					</motion.div>
				</BoxReveal>
			</motion.div>
		</div>
	);
};

export default Developers;
