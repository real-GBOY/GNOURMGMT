/** @format */

import { useAuth } from "../contexts/AuthContext";

const usePermission = () => {
	const { user } = useAuth();

	console.log("usePermission Debug:", {
		user: user?.firstName,
		role: user?.role?.key,
		permissions: user?.role?.permissions?.map((p) => p.key),
		userExists: !!user,
		roleExists: !!user?.role,
		permissionsExist: !!user?.role?.permissions,
	});

	const hasPermission = (permission: string) => {
		if (!user || !user.role || !user.role.permissions) {
			console.log(
				`Permission check failed - missing user data for ${permission}`
			);
			return false;
		}

		// Check if the permission exists in the user's role permissions
		// The permissions from the backend have a 'key' property
		const hasPerm = user.role.permissions.some((p) => p.key === permission);

		console.log(
			`Permission check for ${permission}:`,
			hasPerm,
			"Available permissions:",
			user.role.permissions.map((p) => p.key)
		);
		return hasPerm;
	};

	return {
		permissions: user?.role?.permissions || [],
		hasPermission,
	};
};

export default usePermission;
