/** @format */

import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
	LayoutDashboard,
	Users,
	FileText,
	ListTodo,
	User,
	Calendar,
	UserCheck,
	Trophy,
	LucideIcon,
} from "lucide-react";
import usePermission from "../hooks/usePermission";
import Permissions from "../config/Permissions";
import { useAuth } from "../contexts/AuthContext";

interface Permission {
	_id: string;
	key: string;
}

interface NavigationItem {
	name: string;
	href: string;
	icon: LucideIcon;
	permission: string | null;
	category: "main" | "management" | "admin" | "user";
	description?: string;
	badge?: string | number; // Optional badge for notifications
}

interface RoleBasedNavigationProps {
	className?: string;
	onItemClick?: () => void; // For mobile menu closing
}

const RoleBasedNavigation: React.FC<RoleBasedNavigationProps> = ({
	className = "",
	onItemClick,
}) => {
	const { hasPermission, permissions } = usePermission();
	const { user } = useAuth();
	const location = useLocation();

	// Debug logging
	console.log("RoleBasedNavigation Debug:", {
		permissions: permissions.map((p: Permission) => p.key),
		hasViewAchievement: hasPermission(Permissions.ViewAchievement),
		viewAchievementPermission: Permissions.ViewAchievement,
		hasViewUnverifiedPerson: hasPermission(Permissions.ViewUnverifiedPerson),
		viewUnverifiedPersonPermission: Permissions.ViewUnverifiedPerson,
	});

	// Check if user is admin (President role has all permissions)
	const isAdmin = user?.role?.key === "President";

	// Define navigation items with categories and permissions
	const navigationItems: NavigationItem[] = [
		// Main navigation - always visible
		...(isAdmin
			? [
					// Admin users see two dashboard links
					{
						name: "Dashboard Applicants",
						href: "/dashboard/applicants",
						icon: LayoutDashboard,
						permission: null,
						category: "main",
						description: "Applicants overview and statistics",
					},
					{
						name: "Dashboard Normal",
						href: "/dashboard",
						icon: LayoutDashboard,
						permission: null,
						category: "main",
						description: "Normal dashboard overview",
					},
			  ]
			: [
					// Regular users see single dashboard link
					{
						name: "Dashboard",
						href: "/dashboard/applicants",
						icon: LayoutDashboard,
						permission: null,
						category: "main",
						description: "Overview and statistics",
					},
			  ]),
		{
			name: "Profile",
			href: "/dashboard/profile",
			icon: User,
			permission: null,
			category: "main",
			description: "Manage your profile",
		},

		// Management navigation - requires specific permissions
		{
			name: "Users",
			href: "/dashboard/users",
			icon: Users,
			permission: Permissions.ViewPerson,
			category: "management",
			description: "View all users",
		},
		{
			name: "Members",
			href: "/dashboard/members",
			icon: Users,
			permission: Permissions.ViewPerson,
			category: "management",
			description: "Manage team members",
		},

		{
			name: "Teams",
			href: "/dashboard/teams",
			icon: Users,
			permission: Permissions.ViewTeam,
			category: "management",
			description: "Manage project teams",
		},
		{
			name: "Tasks",
			href: "/dashboard/tasks",
			icon: ListTodo,
			permission: Permissions.ViewTask,
			category: "management",
			description: "Manage project tasks",
		},
		{
			name: "Events",
			href: "/dashboard/events",
			icon: Calendar,
			permission: Permissions.ViewEvent,
			category: "management",
			description: "Manage events and meetings",
		},
		{
			name: "Feedbacks",
			href: "/dashboard/feedbacks",
			icon: FileText,
			permission: Permissions.ViewFeedback,
			category: "management",
			description: "View and manage feedback",
		},
		{
			name: "Achievements",
			href: "/dashboard/achievements",
			icon: Trophy,
			permission: Permissions.ViewAchievement,
			category: "management",
			description: "View and manage achievements",
		},

		// User Management navigation
		{
			name: "User Verification",
			href: "/dashboard/users/verification",
			icon: UserCheck,
			permission: Permissions.ViewUnverifiedPerson,
			category: "user",
			description: "Verify new user accounts",
			// badge: "New",
		},

		// Admin navigation - requires admin-level permissions
	];

	// Filter navigation based on user permissions
	const filteredNavigation = navigationItems.filter((item) => {
		if (item.permission === null) return true; // Always show

		// Special handling for User Verification - show for President, Head, Vice Head
		if (item.name === "User Verification") {
			const userRole = user?.role?.key;
			const canAccessVerification =
				userRole === "President" ||
				userRole === "Head" ||
				userRole === "ViceHead";
			console.log(
				`Special User Verification check: role=${userRole}, canAccess=${canAccessVerification}`
			);
			return canAccessVerification;
		}

		const hasPerm = hasPermission(item.permission);
		console.log(
			`Filtering ${item.name}: permission=${item.permission}, hasPermission=${hasPerm}`
		);
		return hasPerm;
	});

	// Group navigation by category
	const groupedNavigation = {
		main: filteredNavigation.filter((item) => item.category === "main"),
		management: filteredNavigation.filter(
			(item) => item.category === "management"
		),
		user: filteredNavigation.filter((item) => item.category === "user"),
		admin: filteredNavigation.filter((item) => item.category === "admin"),
	};

	const handleItemClick = () => {
		if (onItemClick) {
			onItemClick();
		}
	};

	const renderNavigationGroup = (
		items: NavigationItem[],
		title: string,
		className: string = ""
	) => {
		if (items.length === 0) return null;

		return (
			<div className={`space-y-1 ${className}`}>
				{title && (
					<div className='px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider'>
						{title}
					</div>
				)}
				{items.map((item) => {
					const isActive = location.pathname === item.href;
					return (
						<Link
							key={item.name}
							to={item.href}
							onClick={handleItemClick}
							className={`group flex items-center px-2 py-2 text-xs font-medium rounded-xl transition-all duration-300 hover:scale-[1.02] ${
								isActive
									? "bg-blue-600/80 backdrop-blur-sm text-white shadow-lg"
									: "text-gray-700 hover:text-gray-900 hover:bg-gray-100/60 hover:backdrop-blur-sm hover:shadow-md dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800/60"
							}`}
							title={item.description}>
							<item.icon
								size={16}
								className={`mr-2 flex-shrink-0 ${
									isActive ? "text-white" : "text-gray-400"
								}`}
							/>
							<span className='truncate flex-1'>{item.name}</span>
							{item.badge && (
								<span
									className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${
										isActive
											? "bg-white/20 text-white"
											: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
									}`}>
									{item.badge}
								</span>
							)}
						</Link>
					);
				})}
			</div>
		);
	};

	return (
		<nav className={`space-y-6 ${className}`}>
			{/* Main Navigation */}
			{renderNavigationGroup(groupedNavigation.main, "", "space-y-1")}

			{/* Management Navigation */}
			{renderNavigationGroup(
				groupedNavigation.management,
				"Management",
				"space-y-1"
			)}

			{/* User Management Navigation */}
			{renderNavigationGroup(
				groupedNavigation.user,
				"User Management",
				"space-y-1"
			)}

			{/* Admin Navigation */}
			{renderNavigationGroup(
				groupedNavigation.admin,
				"Administration",
				"space-y-1"
			)}
		</nav>
	);
};

export default RoleBasedNavigation;
