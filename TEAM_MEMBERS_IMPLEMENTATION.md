<!-- @format -->

# Team Members Implementation

This document describes the implementation of the team members functionality in the GNOUR application.

## API Endpoint

### Get Team Members

```
GET /api/teams/{teamId}/members
```

### Response Structure

```json
{
	"success": true,
	"data": {
		"team": {
			"_id": "689366601f511e23969424db",
			"name": "mohsen Team",
			"description": "Handles all product development"
		},
		"members": [
			{
				"_id": "68938d8fc1a3eaaf288a900c",
				"firstName": "John",
				"lastName": "Doe",
				"email": "john.doe@example.com",
				"profilePicture": "https://cloudinary_url.jpg",
				"role": {
					"_id": "68915d47342eba8c616b7b58",
					"key": "President"
				},
				"isVerified": true,
				"isActive": true
			}
		]
	}
}
```

## Implementation Details

### 1. Type Definitions (`src/shared/types/Team.ts`)

Updated the `TeamMember` interface to match the API response:

```typescript
export interface TeamMember {
	_id: string;
	firstName: string;
	lastName: string;
	email: string;
	profilePicture?: string;
	role: {
		_id: string;
		key: string;
	};
	isVerified: boolean;
	isActive: boolean;
}

export interface TeamMembersResponse {
	success: boolean;
	data: {
		team: {
			_id: string;
			name: string;
			description: string;
		};
		members: TeamMember[];
	};
}
```

### 2. Service Layer (`src/shared/services/teamService.ts`)

The `useTeamMembers` hook handles the API call and response parsing:

```typescript
export const useTeamMembers = (teamId: string) => {
	return useQuery({
		queryKey: reactQueryKeys.teams.members(teamId),
		queryFn: async (): Promise<TeamMember[]> => {
			const response = await apiRepo.GET(endPoints.teamMembers(teamId));
			// Handle the new API response structure
			if (
				response &&
				response.success &&
				response.data &&
				response.data.members
			) {
				return response.data.members;
			}
			return [];
		},
		enabled: !!teamId,
		retry: 1,
		refetchOnWindowFocus: false,
	});
};
```

### 3. Reusable Component (`src/shared/components/TeamMembers.tsx`)

Created a reusable `TeamMembers` component that displays:

- Member profile pictures (or initials if no picture)
- Full names with verification status
- Email addresses
- Role information
- Active/Inactive status indicators

Features:

- Loading states
- Empty states
- Responsive design
- Dark/light theme support
- Smooth animations

### 4. Integration in TeamDetail (`src/screens/dashboard/teams/TeamDetail.tsx`)

The TeamDetail component now uses the `useTeamMembers` hook and displays the actual team members instead of the placeholder `teamViceHead` array.

## Usage

### In a Component

```typescript
import { useTeamMembers } from "../shared/services/teamService";
import TeamMembers from "../shared/components/TeamMembers";

const MyComponent = () => {
	const { data: members, isLoading } = useTeamMembers(teamId);

	return <TeamMembers members={members || []} isLoading={isLoading} />;
};
```

### Direct Hook Usage

```typescript
import { useTeamMembers } from "../shared/services/teamService";

const MyComponent = () => {
	const { data: members, isLoading, error } = useTeamMembers(teamId);

	if (isLoading) return <div>Loading...</div>;
	if (error) return <div>Error loading members</div>;

	return (
		<div>
			{members?.map((member) => (
				<div key={member._id}>
					{member.firstName} {member.lastName} - {member.role.key}
				</div>
			))}
		</div>
	);
};
```

## Testing

The HTTP test file (`http/team.http`) includes test cases for:

- Getting team members with valid team ID
- Getting team members with invalid team ID
- Expected response structure

## Features

1. **Profile Pictures**: Displays user profile pictures or initials as fallback
2. **Verification Status**: Shows shield icon for verified users
3. **Active Status**: Indicates inactive users with a badge
4. **Role Information**: Displays user roles
5. **Email Display**: Shows user email addresses
6. **Responsive Design**: Works on all screen sizes
7. **Theme Support**: Adapts to dark/light themes
8. **Loading States**: Shows loading indicators
9. **Error Handling**: Graceful error handling
10. **Animations**: Smooth animations for better UX

## Error Handling

The implementation includes proper error handling:

- Invalid team IDs return empty arrays
- Network errors are handled gracefully
- Loading states prevent UI flicker
- Empty states provide clear feedback

## Performance

- Uses React Query for caching and background updates
- Implements proper loading states
- Optimized re-renders with proper key props
- Efficient list rendering with virtualization-ready structure
