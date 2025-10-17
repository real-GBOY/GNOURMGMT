<!-- @format -->

# Role-Based Routing Implementation

This document outlines the implementation of role-based routing in the GNOUR dashboard application.

## Overview

The application now implements a comprehensive role-based access control (RBAC) system that:

- Protects routes based on user permissions
- Filters navigation items based on user roles
- Provides granular access control at both route and component levels

## Components Created/Modified

### 1. RoleBasedRoute Component (`src/shared/Secure/RoleBasedRoute.tsx`)

A new component that wraps routes and checks permissions before rendering.

**Features:**

- Checks if user has required permission
- Redirects to fallback path if permission is denied
- Can be used to protect any route or component

**Usage:**

```tsx
<RoleBasedRoute requiredPermission={Permissions.ViewEvent}>
	<Events />
</RoleBasedRoute>
```

### 2. RoleBasedNavigation Component (`src/shared/components/RoleBasedNavigation.tsx`)

A new navigation component that provides role-based navigation filtering.

**Features:**

- Categorizes navigation items (main, management, admin)
- Filters items based on user permissions
- Provides tooltips with descriptions
- Supports mobile menu integration

**Navigation Categories:**

- **Main**: Always visible (Dashboard, Profile)
- **Management**: Requires specific permissions (Members, Teams, Tasks, Events, Feedbacks)
- **Admin**: Requires admin-level permissions (User Verification)

### 3. Updated DashboardLayout (`src/shared/components/DashboardLayout.tsx`)

Modified to use the new RoleBasedNavigation component.

**Changes:**

- Replaced hardcoded navigation with RoleBasedNavigation
- Removed permission checking logic (now handled by RoleBasedNavigation)
- Cleaner, more maintainable code structure

### 4. Updated App.tsx

Modified to implement role-based route protection.

**Protected Routes:**

- `/dashboard/members` - Requires `ViewPerson` permission

- `/dashboard/teams` - Requires `ViewTeam` permission
- `/dashboard/events` - Requires `ViewEvent` permission
- `/dashboard/tasks` - Requires `ViewTask` permission
- `/dashboard/feedbacks` - Requires `ViewFeedback` permission
- `/dashboard/users/verification` - Requires `ViewUnverifiedPerson` permission
- `/dashboard/users/:userId` - Requires `ViewPerson` permission

**Always Accessible Routes:**

- `/dashboard` - Main dashboard (no permission required)
- `/dashboard/profile` - User profile (no permission required)

## Permission System

### Core Permissions Used

- `ViewPerson` - View team members and user details
- `ViewTeam` - View and manage teams
- `ViewTask` - View and manage tasks
- `ViewEvent` - View and manage events
- `ViewFeedback` - View and manage feedback
- `ViewUnverifiedPerson` - View unverified user accounts

### New Event-Related Permissions (Previously Added)

- `InviteMembersToEvent` - Invite members to events
- `RemoveMembersFromEvent` - Remove members from events
- `ManageEventGuests` - Overall event guest management

## How It Works

### 1. Route Protection

1. User navigates to a protected route
2. `RoleBasedRoute` component checks user permissions
3. If permission exists, route renders normally
4. If permission denied, user is redirected to fallback path

### 2. Navigation Filtering

1. `RoleBasedNavigation` component loads user permissions
2. Navigation items are filtered based on permissions
3. Only accessible items are displayed in the sidebar
4. Items are grouped by category for better organization

### 3. Permission Checking

1. `usePermission` hook reads user permissions from cookies
2. Permissions are checked against the user's role
3. Real-time permission validation for all protected features

## Benefits

### Security

- Routes are protected at the application level
- Users cannot access unauthorized areas even with direct URLs
- Consistent permission enforcement across the application

### User Experience

- Clean, organized navigation based on user capabilities
- No confusing or inaccessible menu items
- Clear visual hierarchy with categorized navigation

### Maintainability

- Centralized permission management
- Easy to add new protected routes
- Consistent permission checking patterns

## Usage Examples

### Adding a New Protected Route

```tsx
<Route
	path='/dashboard/new-feature'
	element={
		<DashboardWrapper>
			<RoleBasedRoute requiredPermission={Permissions.NewPermission}>
				<NewFeature />
			</RoleBasedRoute>
		</DashboardWrapper>
	}
/>
```

### Adding a New Navigation Item

```tsx
{
  name: "New Feature",
  href: "/dashboard/new-feature",
  icon: NewIcon,
  permission: Permissions.NewPermission,
  category: "management",
  description: "Manage new feature",
}
```

### Checking Permissions in Components

```tsx
const { hasPermission } = usePermission();

if (hasPermission(Permissions.EditEvent)) {
	// Show edit button
}
```

## Testing

To test the role-based routing:

1. **Login as different user roles** to see different navigation items
2. **Try accessing protected routes directly** - should redirect if no permission
3. **Check navigation filtering** - only accessible items should be visible
4. **Verify permission gates** in components work correctly

## Future Enhancements

- **Dynamic permission loading** from API instead of cookies
- **Permission caching** for better performance
- **Audit logging** for permission checks
- **Role-based UI customization** (different layouts per role)
- **Permission inheritance** and role hierarchies

## Troubleshooting

### Common Issues

1. **Navigation items not showing**: Check if user has required permissions
2. **Routes redirecting**: Verify permission strings match exactly
3. **Permission not working**: Ensure user role has the permission assigned

### Debug Mode

The `usePermission` hook includes console logging for debugging:

```tsx
console.log(`Permission check for ${permission}:`, hasPerm);
```

This helps identify permission-related issues during development.
