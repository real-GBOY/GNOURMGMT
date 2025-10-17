/** @format */

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	children: React.ReactNode;
	size?: "sm" | "md" | "lg" | "xl" | "full";
	showCloseButton?: boolean;
	closeOnOverlayClick?: boolean;
	className?: string;
}

const Modal: React.FC<ModalProps> = ({
	isOpen,
	onClose,
	title,
	children,
	size = "md",
	showCloseButton = true,
	closeOnOverlayClick = true,
	className = "",
}) => {
	const { theme } = useTheme();

	// Handle escape key
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape" && isOpen) {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener("keydown", handleEscape);
			document.body.style.overflow = "hidden";
		}

		return () => {
			document.removeEventListener("keydown", handleEscape);
			document.body.style.overflow = "unset";
		};
	}, [isOpen, onClose]);

	const sizeClasses = {
		sm: "max-w-sm",
		md: "max-w-md",
		lg: "max-w-lg",
		xl: "max-w-2xl",
		full: "max-w-4xl",
	};

	const handleOverlayClick = (e: React.MouseEvent) => {
		if (closeOnOverlayClick && e.target === e.currentTarget) {
			onClose();
		}
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className='fixed inset-0 z-[9999] flex items-center justify-center p-4'
					onClick={handleOverlayClick}>
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className='absolute inset-0 bg-black/60 backdrop-blur-md'
					/>

					{/* Modal Content */}
					<motion.div
						initial={{ opacity: 0, scale: 0.95, y: 20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.95, y: 20 }}
						transition={{ type: "spring", damping: 25, stiffness: 300 }}
						className={`relative w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl ${className}`}
						onClick={(e) => e.stopPropagation()}>
						<div
							className={`${
								theme === "dark"
									? "bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-2xl border border-gray-700/50 shadow-black/50"
									: "bg-gradient-to-br from-white/95 to-gray-50/95 backdrop-blur-2xl border border-gray-200/50 shadow-gray-900/20"
							} rounded-2xl shadow-2xl`}>
							{/* Header */}
							{(title || showCloseButton) && (
								<div
									className={`flex items-center justify-between p-6 sm:p-8 border-b backdrop-blur-sm ${
										theme === "dark"
											? "border-gray-600/30 bg-gray-800/20"
											: "border-gray-300/30 bg-gray-100/20"
									}`}>
									{title && (
										<h2
											className={`text-lg sm:text-xl font-semibold transition-colors duration-300 ${
												theme === "dark" ? "text-white" : "text-gray-900"
											}`}>
											{title}
										</h2>
									)}
									{showCloseButton && (
										<button
											onClick={onClose}
											className={`p-3 rounded-xl transition-all duration-300 hover:scale-110 backdrop-blur-sm border ${
												theme === "dark"
													? "hover:bg-gray-700/50 text-gray-400 hover:text-white border-gray-600/30 hover:border-gray-500/50"
													: "hover:bg-gray-200/50 text-gray-600 hover:text-black border-gray-300/30 hover:border-gray-400/50"
											}`}>
											<X size={20} />
										</button>
									)}
								</div>
							)}

							{/* Content */}
							<div className='p-6 sm:p-8 max-h-[calc(90vh-120px)] overflow-y-auto'>
								{children}
							</div>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default Modal;
