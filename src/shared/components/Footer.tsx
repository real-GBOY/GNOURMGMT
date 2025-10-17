/** @format */

import React from "react";
import { Github, Twitter } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const Footer: React.FC = () => {
	const { theme } = useTheme();

	return (
		<footer
			className={`relative z-10 border-t mt-24 transition-colors duration-300 ${
				theme === "dark"
					? "border-gray-800 bg-gray-950"
					: "border-gray-200 bg-white"
			}`}>
			<div className='max-w-7xl mx-auto px-6 py-12'>
				<div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
					<div>
						<h4
							className={`font-semibold mb-4 transition-colors duration-300 ${
								theme === "dark" ? "text-white" : "text-black"
							}`}>
							Product
						</h4>
						<div className='space-y-2 text-sm'>
							<a
								href='#'
								className={`block transition-colors duration-300 ${
									theme === "dark"
										? "text-gray-400 hover:text-white"
										: "text-gray-600 hover:text-black"
								}`}>
								Features
							</a>
							<a
								href='#'
								className={`block transition-colors duration-300 ${
									theme === "dark"
										? "text-gray-400 hover:text-white"
										: "text-gray-600 hover:text-black"
								}`}>
								Integrations
							</a>
							<a
								href='#'
								className={`block transition-colors duration-300 ${
									theme === "dark"
										? "text-gray-400 hover:text-white"
										: "text-gray-600 hover:text-black"
								}`}>
								API
							</a>
							<a
								href='#'
								className={`block transition-colors duration-300 ${
									theme === "dark"
										? "text-gray-400 hover:text-white"
										: "text-gray-600 hover:text-black"
								}`}>
								Pricing
							</a>
						</div>
					</div>
					<div>
						<h4
							className={`font-semibold mb-4 transition-colors duration-300 ${
								theme === "dark" ? "text-white" : "text-black"
							}`}>
							Company
						</h4>
						<div className='space-y-2 text-sm'>
							<a
								href='#'
								className={`block transition-colors duration-300 ${
									theme === "dark"
										? "text-gray-400 hover:text-white"
										: "text-gray-600 hover:text-black"
								}`}>
								About
							</a>
							<a
								href='#'
								className={`block transition-colors duration-300 ${
									theme === "dark"
										? "text-gray-400 hover:text-white"
										: "text-gray-600 hover:text-black"
								}`}>
								Careers
							</a>
							<a
								href='#'
								className={`block transition-colors duration-300 ${
									theme === "dark"
										? "text-gray-400 hover:text-white"
										: "text-gray-600 hover:text-black"
								}`}>
								Blog
							</a>
							<a
								href='#'
								className={`block transition-colors duration-300 ${
									theme === "dark"
										? "text-gray-400 hover:text-white"
										: "text-gray-600 hover:text-black"
								}`}>
								Contact
							</a>
							<a
								href='/developers'
								className={`block transition-colors duration-300 ${
									theme === "dark"
										? "text-gray-400 hover:text-white"
										: "text-gray-600 hover:text-black"
								}`}>
								Developers
							</a>
						</div>
					</div>
					<div>
						<h4
							className={`font-semibold mb-4 transition-colors duration-300 ${
								theme === "dark" ? "text-white" : "text-black"
							}`}>
							Resources
						</h4>
						<div className='space-y-2 text-sm'>
							<a
								href='#'
								className={`block transition-colors duration-300 ${
									theme === "dark"
										? "text-gray-400 hover:text-white"
										: "text-gray-600 hover:text-black"
								}`}>
								Documentation
							</a>
							<a
								href='#'
								className={`block transition-colors duration-300 ${
									theme === "dark"
										? "text-gray-400 hover:text-white"
										: "text-gray-600 hover:text-black"
								}`}>
								Help Center
							</a>
							<a
								href='#'
								className={`block transition-colors duration-300 ${
									theme === "dark"
										? "text-gray-400 hover:text-white"
										: "text-gray-600 hover:text-black"
								}`}>
								Status
							</a>
							<a
								href='#'
								className={`block transition-colors duration-300 ${
									theme === "dark"
										? "text-gray-400 hover:text-white"
										: "text-gray-600 hover:text-black"
								}`}>
								Changelog
							</a>
						</div>
					</div>
					<div>
						<h4
							className={`font-semibold mb-4 transition-colors duration-300 ${
								theme === "dark" ? "text-white" : "text-black"
							}`}>
							Legal
						</h4>
						<div className='space-y-2 text-sm'>
							<a
								href='#'
								className={`block transition-colors duration-300 ${
									theme === "dark"
										? "text-gray-400 hover:text-white"
										: "text-gray-600 hover:text-black"
								}`}>
								Privacy
							</a>
							<a
								href='#'
								className={`block transition-colors duration-300 ${
									theme === "dark"
										? "text-gray-400 hover:text-white"
										: "text-gray-600 hover:text-black"
								}`}>
								Terms
							</a>
							<a
								href='#'
								className={`block transition-colors duration-300 ${
									theme === "dark"
										? "text-gray-400 hover:text-white"
										: "text-gray-600 hover:text-black"
								}`}>
								Security
							</a>
							<a
								href='#'
								className={`block transition-colors duration-300 ${
									theme === "dark"
										? "text-gray-400 hover:text-white"
										: "text-gray-600 hover:text-black"
								}`}>
								Compliance
							</a>
						</div>
					</div>
				</div>

				<div
					className={`border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center transition-colors duration-300 ${
						theme === "dark" ? "border-gray-800" : "border-gray-200"
					}`}>
					<div className='flex items-center space-x-4 mb-4 md:mb-0'>
						<div className='flex items-center space-x-2'>
							<div
								className={`w-6 h-6 rounded-sm flex items-center justify-center transition-colors duration-300 ${
									theme === "dark" ? "bg-white" : "bg-black"
								}`}>
								<span
									className={`font-semibold text-xs ${
										theme === "dark" ? "text-black" : "text-white"
									}`}>
									▲
								</span>
							</div>
							<span className='font-semibold tracking-tight'>GNOUR</span>
						</div>
						<span className='text-sm text-gray-500'>© 2024</span>
					</div>
					<div className='flex items-center space-x-4'>
						<a
							href='#'
							className={`transition-colors duration-300 ${
								theme === "dark"
									? "text-gray-400 hover:text-white"
									: "text-gray-600 hover:text-black"
							}`}>
							<Github size={18} />
						</a>
						<a
							href='#'
							className={`transition-colors duration-300 ${
								theme === "dark"
									? "text-gray-400 hover:text-white"
									: "text-gray-600 hover:text-black"
							}`}>
							<Twitter size={18} />
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
