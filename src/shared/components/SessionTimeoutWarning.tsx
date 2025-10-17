/** @format */

import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./Button";
import { AlertTriangle, Clock, RefreshCw } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

interface SessionTimeoutWarningProps {
	timeoutMinutes?: number;
}

const SessionTimeoutWarning: React.FC<SessionTimeoutWarningProps> = ({
	timeoutMinutes = 5,
}) => {
	const { theme } = useTheme();
	const { refreshToken, logout } = useAuth();
	const [showWarning, setShowWarning] = useState(false);
	const [timeLeft, setTimeLeft] = useState(timeoutMinutes * 60); // Convert to seconds
	const [isRefreshing, setIsRefreshing] = useState(false);

	useEffect(() => {
		// Check token expiration every minute
		const interval = setInterval(() => {
			const token = document.cookie
				.split("; ")
				.find((row) => row.startsWith("token="))
				?.split("=")[1];

			if (token) {
				try {
					const payload = JSON.parse(atob(token.split(".")[1]));
					const expirationTime = payload.exp * 1000; // Convert to milliseconds
					const currentTime = Date.now();
					const timeUntilExpiry = expirationTime - currentTime;
					const warningTime = timeoutMinutes * 60 * 1000; // Convert to milliseconds

					if (timeUntilExpiry <= warningTime && timeUntilExpiry > 0) {
						setShowWarning(true);
						setTimeLeft(Math.floor(timeUntilExpiry / 1000));
					} else if (timeUntilExpiry <= 0) {
						// Token expired, logout user
						logout();
					}
				} catch (error) {
					console.error("Error parsing token:", error);
				}
			}
		}, 60000); // Check every minute

		return () => clearInterval(interval);
	}, [timeoutMinutes, logout]);

	useEffect(() => {
		if (showWarning && timeLeft > 0) {
			const timer = setTimeout(() => {
				setTimeLeft(timeLeft - 1);
			}, 1000);

			return () => clearTimeout(timer);
		} else if (timeLeft <= 0 && showWarning) {
			// Time's up, logout user
			logout();
		}
	}, [timeLeft, showWarning, logout]);

	const handleExtendSession = async () => {
		try {
			setIsRefreshing(true);
			const success = await refreshToken();
			if (success) {
				setShowWarning(false);
				setTimeLeft(timeoutMinutes * 60);
			}
		} catch (error) {
			console.error("Failed to extend session:", error);
		} finally {
			setIsRefreshing(false);
		}
	};

	const handleLogout = () => {
		logout();
	};

	if (!showWarning) return null;

	return (
		<div className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
			<div
				className={`max-w-md w-full p-6 rounded-xl shadow-2xl transition-all duration-300 ${
					theme === "dark"
						? "bg-gray-900 border border-gray-700"
						: "bg-white border border-gray-200"
				}`}>
				<div className='flex items-center gap-3 mb-4'>
					<div className='p-2 rounded-full bg-yellow-100 dark:bg-yellow-900/30'>
						<AlertTriangle className='h-6 w-6 text-yellow-600 dark:text-yellow-400' />
					</div>
					<div>
						<h3
							className={`text-lg font-semibold ${
								theme === "dark" ? "text-white" : "text-gray-900"
							}`}>
							Session Expiring Soon
						</h3>
						<p
							className={`text-sm ${
								theme === "dark" ? "text-gray-400" : "text-gray-600"
							}`}>
							Your session will expire in
						</p>
					</div>
				</div>

				<div className='flex items-center justify-center gap-2 mb-6'>
					<Clock className='h-5 w-5 text-gray-500' />
					<span
						className={`text-2xl font-bold ${
							theme === "dark" ? "text-white" : "text-gray-900"
						}`}>
						{Math.floor(timeLeft / 60)}:
						{(timeLeft % 60).toString().padStart(2, "0")}
					</span>
				</div>

				<div className='space-y-3'>
					<Button
						onClick={handleExtendSession}
						disabled={isRefreshing}
						className='w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2'>
						{isRefreshing ? (
							<RefreshCw className='h-4 w-4 animate-spin' />
						) : (
							<RefreshCw className='h-4 w-4' />
						)}
						{isRefreshing ? "Extending..." : "Extend Session"}
					</Button>

					<Button onClick={handleLogout} variant='outline' className='w-full'>
						Logout Now
					</Button>
				</div>

				<p
					className={`text-xs text-center mt-4 ${
						theme === "dark" ? "text-gray-500" : "text-gray-400"
					}`}>
					Click "Extend Session" to stay logged in, or you'll be automatically
					logged out.
				</p>
			</div>
		</div>
	);
};

export default SessionTimeoutWarning;
