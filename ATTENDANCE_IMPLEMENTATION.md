<!-- @format -->

# Attendance System Implementation

## Overview

This document outlines the complete attendance system implementation following the established project patterns and logic approach. The attendance system allows tracking user attendance at events with various status types, time tracking, verification, and feedback capabilities.

## Architecture & Design Patterns

### 1. Type Definitions (`src/shared/types/Attendance.ts`)

Following the same pattern as other types in the project:

```typescript
export interface Attendance {
	_id: string;
	user: {
		_id: string;
		firstName: string;
		lastName: string;
		email: string;
	};
	event: {
		_id: string;
		title: string;
		startDate: string;
		endDate: string;
	};
	attendance: boolean;
	status: "present" | "late" | "left_early" | "absent" | "excused";
	lateMinutes: number;
	earlyLeaveMinutes: number;
	verified: boolean;
	feedback: string;
	checkInTime?: string;
	checkOutTime?: string;
	verifiedBy?: string;
	feedbackBy?: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
}
```

### 2. API Endpoints (`src/shared/config/endPoints.ts`)

Added attendance endpoints following the established pattern:

```typescript
attendance: "/attendance",
attendanceById: (id: string) => `/attendance/${id}`,
attendanceByUser: (userId: string) => `/attendance/user/${userId}`,
attendanceByEvent: (eventId: string) => `/attendance/event/${eventId}`,
verifyAttendance: (id: string) => `/attendance/${id}/verify`,
addFeedback: (id: string) => `/attendance/${id}/feedback`,
```

### 3. React Query Keys (`src/shared/config/reactQueryKeys.ts`)

Added attendance query keys following the established pattern:

```typescript
attendance: {
  all: ["attendance"] as const,
  lists: () => [...reactQueryKeys.attendance.all, "list"] as const,
  list: (filters: string) => [...reactQueryKeys.attendance.lists(), { filters }] as const,
  details: () => [...reactQueryKeys.attendance.all, "detail"] as const,
  detail: (id: string) => [...reactQueryKeys.attendance.details(), id] as const,
  byUser: (userId: string) => [...reactQueryKeys.attendance.all, "user", userId] as const,
  byEvent: (eventId: string) => [...reactQueryKeys.attendance.all, "event", eventId] as const,
},
```

### 4. Service Layer (`src/shared/services/attendanceService.ts`)

Following the same pattern as `teamService.ts`:

#### Query Hooks:

- `useAttendance()` - Get all attendance records
- `useAttendanceById(id)` - Get specific attendance record
- `useAttendanceByUser(userId)` - Get attendance records for a user
- `useAttendanceByEvent(eventId)` - Get attendance records for an event

#### Mutation Hooks:

- `useCreateAttendance()` - Create new attendance record
- `useUpdateAttendance()` - Update existing attendance record
- `useDeleteAttendance()` - Delete attendance record
- `useVerifyAttendance()` - Verify/unverify attendance
- `useAddFeedback()` - Add feedback to attendance

### 5. Form Validation (`src/shared/schemas/AttendanceSchema.ts`)

Using Zod for form validation following the project pattern:

```typescript
export const CreateAttendanceSchema = z.object({
	user: z.string().min(1, "User is required"),
	event: z.string().min(1, "Event is required"),
	attendance: z.boolean(),
	status: z.enum(["present", "late", "left_early", "absent", "excused"]),
	lateMinutes: z.number().min(0).optional(),
	earlyLeaveMinutes: z.number().min(0).optional(),
	feedback: z.string().optional(),
	checkInTime: z.string().optional(),
	checkOutTime: z.string().optional(),
});
```

### 6. Form Component (`src/shared/components/Form/AttendanceForm.tsx`)

Following the same pattern as other form components:

- Uses `react-hook-form` with `zodResolver`
- Conditional form fields based on attendance status
- User and event selection dropdowns
- Time tracking fields (check-in/out, late minutes, early leave)
- Feedback textarea

### 7. UI Components

#### Main Attendance Screen (`src/screens/dashboard/Attendance.tsx`)

- Table view of all attendance records
- Color-coded status badges
- Time details display
- Edit/Delete actions
- Modal for create/edit forms

#### Attendance Detail Screen (`src/screens/dashboard/attendance/AttendanceDetail.tsx`)

- Detailed view of individual attendance record
- User and event information
- Status and verification display
- Time tracking details
- Feedback section
- Edit, verify, and add feedback modals

## API Integration

The implementation follows the attendance API endpoints defined in `http/attendance.http`:

### Core Endpoints:

- `POST /attendance` - Create attendance record
- `GET /attendance` - Get all attendance records
- `GET /attendance/:id` - Get specific attendance record
- `PATCH /attendance/:id` - Update attendance record
- `DELETE /attendance/:id` - Delete attendance record

### Specialized Endpoints:

- `GET /attendance/user/:userId` - Get attendance by user
- `GET /attendance/event/:eventId` - Get attendance by event
- `PATCH /attendance/:id/verify` - Verify attendance
- `PATCH /attendance/:id/feedback` - Add feedback

## Status Types

The system supports five attendance status types:

1. **present** - User attended the full event
2. **late** - User arrived late (with late minutes tracking)
3. **left_early** - User left before event ended (with early leave minutes)
4. **absent** - User did not attend
5. **excused** - User was excused from attendance

## Time Tracking Features

- **Check-in Time**: When user arrived at the event
- **Check-out Time**: When user left the event
- **Late Minutes**: Number of minutes user was late
- **Early Leave Minutes**: Number of minutes user left early

## Verification System

- **Verified Status**: Boolean flag indicating if attendance has been verified
- **Verified By**: User ID of who verified the attendance
- **Verification Actions**: Verify/unverify attendance records

## Feedback System

- **Feedback Text**: Comments or notes about the attendance
- **Feedback By**: User ID of who added the feedback
- **Feedback Actions**: Add or update feedback on attendance records

## Error Handling

Following the project's error handling pattern:

- Toast notifications for success/error messages
- Loading states for all async operations
- Error boundaries for component-level errors
- Form validation errors displayed inline

## State Management

Using React Query for server state management:

- Automatic caching and invalidation
- Optimistic updates where appropriate
- Background refetching
- Error retry logic

## UI/UX Features

- **Responsive Design**: Works on desktop and mobile
- **Color-coded Status**: Visual indicators for different status types
- **Loading States**: Spinners and disabled states during operations
- **Confirmation Dialogs**: For destructive actions like delete
- **Modal Forms**: For create/edit operations
- **Table Sorting**: Sortable attendance records
- **Search/Filter**: Future enhancement capability

## Security Considerations

- **Permission Gates**: Can be integrated with existing permission system
- **Data Validation**: Both client and server-side validation
- **User Context**: Integration with authentication system
- **Audit Trail**: Tracking who made changes and when

## Integration Points

### With Existing Systems:

- **User Management**: Links to existing user system
- **Event Management**: Links to existing event system
- **Team System**: Can be extended to track team attendance
- **Role System**: Can integrate with permission system

### Future Enhancements:

- **Bulk Operations**: Import/export attendance data
- **Reports**: Attendance analytics and reporting
- **Notifications**: Automated attendance reminders
- **Mobile App**: QR code check-in system

## Testing Strategy

Following the project's testing approach:

- **Unit Tests**: Service functions and utilities
- **Integration Tests**: API endpoint testing
- **Component Tests**: React component testing
- **E2E Tests**: Full user workflow testing

## Performance Considerations

- **Pagination**: For large attendance datasets
- **Lazy Loading**: Load attendance details on demand
- **Caching**: React Query caching for better performance
- **Optimistic Updates**: Immediate UI feedback

## Deployment

The attendance system follows the same deployment pattern as other features:

- **Environment Variables**: API endpoint configuration
- **Build Process**: Standard React build process
- **API Integration**: Backend API endpoint setup required

## Conclusion

The attendance system implementation follows the established project patterns and provides a comprehensive solution for tracking user attendance at events. The modular design allows for easy extension and integration with existing systems while maintaining consistency with the overall application architecture.
