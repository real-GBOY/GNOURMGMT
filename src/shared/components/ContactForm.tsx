/** @format */

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";

const ContactForm: React.FC = () => {
	const { theme } = useTheme();
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		subject: "",
		message: "",
	});

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Handle form submission here
		console.log("Form submitted:", formData);
		// Reset form
		setFormData({
			name: "",
			email: "",
			subject: "",
			message: "",
		});
	};

	return (
		<motion.section
			className='py-16 sm:py-24'
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6 }}
			viewport={{ once: true }}>
			<div className='max-w-4xl mx-auto px-4 sm:px-6'>
				{/* Section Header */}
				<motion.div
					className='text-center mb-12'
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.1 }}
					viewport={{ once: true }}>
					<h2
						className={`text-3xl sm:text-4xl font-bold mb-4 transition-colors duration-300 ${
							theme === "dark" ? "text-white" : "text-gray-900"
						}`}>
						Get in Touch
					</h2>
					<p
						className={`text-base sm:text-lg max-w-2xl mx-auto transition-colors duration-300 ${
							theme === "dark" ? "text-gray-400" : "text-gray-600"
						}`}>
						Have questions about our platform or want to learn more? We'd love
						to hear from you.
					</p>
				</motion.div>

				{/* Contact Form */}
				<motion.div
					className={`relative rounded-2xl p-6 sm:p-8 transition-colors duration-300 ${
						theme === "dark"
							? "bg-gray-900/50 backdrop-blur-sm border border-gray-800"
							: "bg-white/80 backdrop-blur-sm border border-gray-200 shadow-xl"
					}`}
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
					viewport={{ once: true }}>
					<form onSubmit={handleSubmit} className='space-y-6'>
						{/* Name and Email Row */}
						<div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
							<div className='group'>
								<label
									className={`block text-sm font-medium mb-3 transition-colors duration-300 ${
										theme === "dark" ? "text-gray-300" : "text-gray-700"
									}`}>
									Name
								</label>
								<input
									type='text'
									name='name'
									value={formData.name}
									onChange={handleInputChange}
									required
									className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 ${
										theme === "dark"
											? "bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:bg-gray-800"
											: "bg-gray-50 border-gray-200 text-black placeholder-gray-500 focus:border-blue-500 focus:bg-white"
									} focus:outline-none focus:ring-4 focus:ring-blue-500/10`}
									placeholder='Your name'
								/>
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
									name='email'
									value={formData.email}
									onChange={handleInputChange}
									required
									className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 ${
										theme === "dark"
											? "bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:bg-gray-800"
											: "bg-gray-50 border-gray-200 text-black placeholder-gray-500 focus:border-blue-500 focus:bg-white"
									} focus:outline-none focus:ring-4 focus:ring-blue-500/10`}
									placeholder='your.email@example.com'
								/>
							</div>
						</div>

						{/* Subject */}
						<div className='group'>
							<label
								className={`block text-sm font-medium mb-3 transition-colors duration-300 ${
									theme === "dark" ? "text-gray-300" : "text-gray-700"
								}`}>
								Subject
							</label>
							<input
								type='text'
								name='subject'
								value={formData.subject}
								onChange={handleInputChange}
								required
								className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 ${
									theme === "dark"
										? "bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:bg-gray-800"
										: "bg-gray-50 border-gray-200 text-black placeholder-gray-500 focus:border-blue-500 focus:bg-white"
								} focus:outline-none focus:ring-4 focus:ring-blue-500/10`}
								placeholder='How can we help?'
							/>
						</div>

						{/* Message */}
						<div className='group'>
							<label
								className={`block text-sm font-medium mb-3 transition-colors duration-300 ${
									theme === "dark" ? "text-gray-300" : "text-gray-700"
								}`}>
								Message
							</label>
							<textarea
								name='message'
								value={formData.message}
								onChange={handleInputChange}
								required
								rows={5}
								className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 ${
									theme === "dark"
										? "bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:bg-gray-800"
										: "bg-gray-50 border-gray-200 text-black placeholder-gray-500 focus:border-blue-500 focus:bg-white"
								} focus:outline-none focus:ring-4 focus:ring-blue-500/10 resize-none`}
								placeholder='Tell us about your inquiry...'
							/>
						</div>

						{/* Submit Button */}
						<motion.button
							type='submit'
							className='w-full py-3 px-6 font-semibold text-white rounded-xl transition-all duration-300 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transform hover:scale-[1.02] focus:ring-4 focus:ring-blue-500/20'
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}>
							Send Message
						</motion.button>
					</form>

					{/* Contact Info */}
					<div className='mt-8 pt-8 border-t border-gray-200/50'>
						<div className='grid grid-cols-1 sm:grid-cols-3 gap-6 text-center'>
							<div>
								<div
									className={`w-8 h-8 mx-auto mb-3 rounded-lg bg-blue-500/10 flex items-center justify-center transition-colors duration-300`}>
									<svg
										className='w-4 h-4 text-blue-500'
										fill='none'
										stroke='currentColor'
										viewBox='0 0 24 24'>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
										/>
									</svg>
								</div>
								<h3
									className={`font-semibold mb-1 transition-colors duration-300 ${
										theme === "dark" ? "text-white" : "text-gray-900"
									}`}>
									Email
								</h3>
								<p
									className={`text-sm transition-colors duration-300 ${
										theme === "dark" ? "text-gray-400" : "text-gray-600"
									}`}>
									contact@enactus.org
								</p>
							</div>
							<div>
								<div
									className={`w-8 h-8 mx-auto mb-3 rounded-lg bg-green-500/10 flex items-center justify-center transition-colors duration-300`}>
									<svg
										className='w-4 h-4 text-green-500'
										fill='none'
										stroke='currentColor'
										viewBox='0 0 24 24'>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
										/>
									</svg>
								</div>
								<h3
									className={`font-semibold mb-1 transition-colors duration-300 ${
										theme === "dark" ? "text-white" : "text-gray-900"
									}`}>
									Phone
								</h3>
								<p
									className={`text-sm transition-colors duration-300 ${
										theme === "dark" ? "text-gray-400" : "text-gray-600"
									}`}>
									+1 (555) 123-4567
								</p>
							</div>
							<div>
								<div
									className={`w-8 h-8 mx-auto mb-3 rounded-lg bg-purple-500/10 flex items-center justify-center transition-colors duration-300`}>
									<svg
										className='w-4 h-4 text-purple-500'
										fill='none'
										stroke='currentColor'
										viewBox='0 0 24 24'>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
										/>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
										/>
									</svg>
								</div>
								<h3
									className={`font-semibold mb-1 transition-colors duration-300 ${
										theme === "dark" ? "text-white" : "text-gray-900"
									}`}>
									Office
								</h3>
								<p
									className={`text-sm transition-colors duration-300 ${
										theme === "dark" ? "text-gray-400" : "text-gray-600"
									}`}>
									University Campus
								</p>
							</div>
						</div>
					</div>
				</motion.div>
			</div>
		</motion.section>
	);
};

export default ContactForm;
