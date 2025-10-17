/** @format */

import React from "react";
import DashboardLayout from "../../shared/components/DashboardLayout";
import { useAuth } from "../../shared/contexts/AuthContext";
import { Navigate } from "react-router-dom";

interface DashboardWrapperProps {
	children: React.ReactNode;
}

const DashboardWrapper: React.FC<DashboardWrapperProps> = ({ children }) => {
	const { user, isAuthenticated, token, isLoading } = useAuth();

	// Show loading while checking authentication
	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-lg">Loading...</div>
			</div>
		);
	}

	// Only check if user is authenticated, no permission required
	if (!isAuthenticated || !token || !user) {
		return <Navigate to="/login" />;
	}

	return (
		<DashboardLayout>
			{children}
		</DashboardLayout>
	);
};

export default DashboardWrapper; 