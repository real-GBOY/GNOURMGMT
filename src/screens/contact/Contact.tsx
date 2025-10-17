/** @format */

import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../shared/contexts/ThemeContext";

const Contact: React.FC = () => {
	const { theme } = useTheme();

	const contactInfo = [
		{
			title: "Email",
			value: "contact@enactus.org",
			description: "We'll respond within 24 hours",
		},
		{
			title: "Phone",
			value: "+1 (555) 123-4567",
			description: "Mon-Fri from 9am to 5pm EST",
		},
		{
			title: "Office",
			value: "University Campus",
			description: "Visit us during office hours",
		},
		{
			title: "Support Hours",
			value: "9:00 AM - 5:00 PM",
			description: "Monday to Friday",
		},
	];

	return (
		<div className='relative min-h-screen'>
			{/* Background Pattern */}
			<div className='absolute inset-0 overflow-hidden'>
				<div
					className={`absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl opacity-20 transition-colors duration-300 ${
						theme === "dark" ? "bg-blue-500" : "bg-blue-200"
					}`}
				/>
			</div>

			<div className='relative max-w-6xl mx-auto px-6 py-16'>
				{/* Header Section */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className='text-center mb-20'>
					<div className='inline-flex items-center space-x-2 mb-6'>
						<span
							className={`text-sm font-medium transition-colors duration-300 ${
								theme === "dark" ? "text-gray-400" : "text-gray-600"
							}`}>
							Let's Connect
						</span>
					</div>

					<h1
						className={`text-5xl md:text-6xl font-bold mb-6 transition-colors duration-300 ${
							theme === "dark" ? "text-white" : "text-black"
						}`}>
						Get in Touch
					</h1>
					<p
						className={`text-xl max-w-3xl mx-auto leading-relaxed transition-colors duration-300 ${
							theme === "dark" ? "text-gray-400" : "text-gray-600"
						}`}>
						Have questions about our projects or want to get involved? We'd love
						to hear from you and help you make a difference.
					</p>
				</motion.div>

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-20'>
					{/* Contact Form */}
					<motion.div
						initial={{ opacity: 0, x: -30 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8, delay: 0.2 }}>
						<div
							className={`relative rounded-2xl p-8 transition-colors duration-300 ${
								theme === "dark"
									? "bg-gray-800/50 backdrop-blur-sm border border-gray-700/50"
									: "bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-xl"
							}`}>
							{/* Form Header */}
							<div className='mb-8'>
								<h2
									className={`text-2xl font-bold transition-colors duration-300 ${
										theme === "dark" ? "text-white" : "text-black"
									}`}>
									Send us a message
								</h2>
							</div>

							<form className='space-y-6'>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
									<div className='group'>
										<label
											className={`block text-sm font-medium mb-3 transition-colors duration-300 ${
												theme === "dark" ? "text-gray-300" : "text-gray-700"
											}`}>
											First Name
										</label>
										<input
											type='text'
											className={`w-full px-4 py-4 border-2 rounded-xl transition-all duration-300 ${
												theme === "dark"
													? "bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:bg-gray-700"
													: "bg-gray-50 border-gray-200 text-black placeholder-gray-500 focus:border-blue-500 focus:bg-white"
											} focus:outline-none focus:ring-4 focus:ring-blue-500/10`}
											placeholder='John'
										/>
									</div>
									<div className='group'>
										<label
											className={`block text-sm font-medium mb-3 transition-colors duration-300 ${
												theme === "dark" ? "text-gray-300" : "text-gray-700"
											}`}>
											Last Name
										</label>
										<input
											type='text'
											className={`w-full px-4 py-4 border-2 rounded-xl transition-all duration-300 ${
												theme === "dark"
													? "bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:bg-gray-700"
													: "bg-gray-50 border-gray-200 text-black placeholder-gray-500 focus:border-blue-500 focus:bg-white"
											} focus:outline-none focus:ring-4 focus:ring-blue-500/10`}
											placeholder='Doe'
										/>
									</div>
								</div>

								<div className='group'>
									<label
										className={`block text-sm font-medium mb-3 transition-colors duration-300 ${
											theme === "dark" ? "text-gray-300" : "text-gray-700"
										}`}>
										Email
									</label>
									<input
										type='email'
										className={`w-full px-4 py-4 border-2 rounded-xl transition-all duration-300 ${
											theme === "dark"
												? "bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:bg-gray-700"
												: "bg-gray-50 border-gray-200 text-black placeholder-gray-500 focus:border-blue-500 focus:bg-white"
										} focus:outline-none focus:ring-4 focus:ring-blue-500/10`}
										placeholder='john@university.edu'
									/>
								</div>

								<div className='group'>
									<label
										className={`block text-sm font-medium mb-3 transition-colors duration-300 ${
											theme === "dark" ? "text-gray-300" : "text-gray-700"
										}`}>
										Subject
									</label>
									<input
										type='text'
										className={`w-full px-4 py-4 border-2 rounded-xl transition-all duration-300 ${
											theme === "dark"
												? "bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:bg-gray-700"
												: "bg-gray-50 border-gray-200 text-black placeholder-gray-500 focus:border-blue-500 focus:bg-white"
										} focus:outline-none focus:ring-4 focus:ring-blue-500/10`}
										placeholder='How can we help?'
									/>
								</div>

								<div className='group'>
									<label
										className={`block text-sm font-medium mb-3 transition-colors duration-300 ${
											theme === "dark" ? "text-gray-300" : "text-gray-700"
										}`}>
										Message
									</label>
									<textarea
										rows={5}
										className={`w-full px-4 py-4 border-2 rounded-xl transition-all duration-300 ${
											theme === "dark"
												? "bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:bg-gray-700"
												: "bg-gray-50 border-gray-200 text-black placeholder-gray-500 focus:border-blue-500 focus:bg-white"
										} focus:outline-none focus:ring-4 focus:ring-blue-500/10 resize-none`}
										placeholder="Tell us about your inquiry and how you'd like to get involved..."
									/>
								</div>

								<motion.button
									type='submit'
									className='w-full py-4 px-6 font-semibold text-white rounded-xl transition-all duration-300 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transform hover:scale-[1.02] focus:ring-4 focus:ring-blue-500/20'
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}>
									<span>Send Message</span>
								</motion.button>
							</form>
						</div>
					</motion.div>

					{/* Contact Information */}
					<motion.div
						initial={{ opacity: 0, x: 30 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8, delay: 0.4 }}
						className='space-y-8'>
						<div>
							<h2
								className={`text-2xl font-bold mb-6 transition-colors duration-300 ${
									theme === "dark" ? "text-white" : "text-black"
								}`}>
								Contact Information
							</h2>
							<p
								className={`text-lg leading-relaxed transition-colors duration-300 ${
									theme === "dark" ? "text-gray-400" : "text-gray-600"
								}`}>
								Ready to make a difference? Let's discuss how you can get
								involved with our social impact projects and create positive
								change.
							</p>
						</div>

						<div className='space-y-6'>
							{contactInfo.map((info, index) => (
								<motion.div
									key={index}
									className={`group p-6 rounded-2xl transition-all duration-300 cursor-pointer ${
										theme === "dark"
											? "bg-gray-800/50 border border-gray-700/50 hover:bg-gray-800 hover:border-gray-600"
											: "bg-white/80 border border-gray-200/50 hover:bg-white hover:border-gray-300 shadow-lg hover:shadow-xl"
									}`}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
									whileHover={{ y: -4 }}
									whileTap={{ scale: 0.98 }}>
									<div className='space-y-3'>
										<div
											className={`w-12 h-1 rounded-full transition-colors duration-300 ${
												theme === "dark" ? "bg-gray-600" : "bg-gray-300"
											}`}
										/>
										<div>
											<h3
												className={`font-bold mb-2 transition-colors duration-300 ${
													theme === "dark" ? "text-white" : "text-black"
												}`}>
												{info.title}
											</h3>
											<p
												className={`font-semibold mb-1 transition-colors duration-300 ${
													theme === "dark" ? "text-gray-300" : "text-gray-700"
												}`}>
												{info.value}
											</p>
											<p
												className={`text-sm transition-colors duration-300 ${
													theme === "dark" ? "text-gray-500" : "text-gray-500"
												}`}>
												{info.description}
											</p>
										</div>
									</div>
								</motion.div>
							))}
						</div>

						{/* Office Hours */}
						<motion.div
							className={`p-6 rounded-2xl transition-all duration-300 ${
								theme === "dark"
									? "bg-gray-800/50 border border-gray-700/50"
									: "bg-white/80 border border-gray-200/50 shadow-lg"
							}`}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 1.0 }}>
							<div className='mb-6'>
								<div
									className={`w-12 h-1 rounded-full mb-4 transition-colors duration-300 ${
										theme === "dark" ? "bg-gray-600" : "bg-gray-300"
									}`}
								/>
								<h3
									className={`text-xl font-bold transition-colors duration-300 ${
										theme === "dark" ? "text-white" : "text-black"
									}`}>
									Office Hours
								</h3>
							</div>
							<div className='space-y-4'>
								<div className='flex justify-between items-center py-2 border-b border-gray-200/50'>
									<span
										className={`font-medium transition-colors duration-300 ${
											theme === "dark" ? "text-gray-400" : "text-gray-600"
										}`}>
										Monday - Friday
									</span>
									<span
										className={`font-bold transition-colors duration-300 ${
											theme === "dark" ? "text-white" : "text-black"
										}`}>
										9:00 AM - 5:00 PM EST
									</span>
								</div>
								<div className='flex justify-between items-center py-2 border-b border-gray-200/50'>
									<span
										className={`font-medium transition-colors duration-300 ${
											theme === "dark" ? "text-gray-400" : "text-gray-600"
										}`}>
										Saturday
									</span>
									<span
										className={`font-bold transition-colors duration-300 ${
											theme === "dark" ? "text-white" : "text-black"
										}`}>
										By appointment
									</span>
								</div>
								<div className='flex justify-between items-center py-2'>
									<span
										className={`font-medium transition-colors duration-300 ${
											theme === "dark" ? "text-gray-400" : "text-gray-600"
										}`}>
										Sunday
									</span>
									<span
										className={`font-bold transition-colors duration-300 ${
											theme === "dark" ? "text-white" : "text-black"
										}`}>
										Closed
									</span>
								</div>
							</div>
						</motion.div>
					</motion.div>
				</div>
			</div>
		</div>
	);
};

export default Contact; 