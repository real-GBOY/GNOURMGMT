/** @format */

import React from "react";
import { Navigate } from "react-router-dom";
import usePermission from "../hooks/usePermission";
import { useAuth } from "../contexts/AuthContext";

interface RoleBasedRouteProps {
	children: React.ReactNode;
	requiredPermission?: string | string[];
	fallbackPath?: string;
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
	children,
	requiredPermission,
	fallbackPath = "/dashboard",
}) => {
	const { hasPermission } = usePermission();
	const { user } = useAuth();

	console.log("RoleBasedRoute Debug:", {
		requiredPermission,
		user: user?.role?.key,
		userPermissions: user?.role?.permissions?.map((p) => p.key),
		hasPermission: requiredPermission
			? Array.isArray(requiredPermission)
				? requiredPermission.some((permission) => hasPermission(permission))
				: hasPermission(requiredPermission)
			: "No permission required",
	});

	// If no permission is required, render children
	if (!requiredPermission) {
		console.log("No permission required, rendering children");
		return <>{children}</>;
	}

	// Check if user has the required permission(s)
	const hasRequiredPermission = Array.isArray(requiredPermission)
		? requiredPermission.some((permission) => hasPermission(permission))
		: hasPermission(requiredPermission);

	if (!hasRequiredPermission) {
		console.log(
			`Permission denied for ${
				Array.isArray(requiredPermission)
					? requiredPermission.join(" OR ")
					: requiredPermission
			}, redirecting to ${fallbackPath}`
		);
		// Redirect to fallback path or show access denied
		return <Navigate to={fallbackPath} replace />;
	}

	console.log(
		`Permission granted for ${
			Array.isArray(requiredPermission)
				? requiredPermission.join(" OR ")
				: requiredPermission
		}, rendering children`
	);
	return <>{children}</>;
};

export default RoleBasedRoute;
