# GNOUR - GNOUR Application

A modern Human Capital Management (HCM) cloud application built with React, TypeScript, and Tailwind CSS, organized using a screen-based architecture.

## 🏗️ Screen-Based Architecture

The project follows a **screen-based architecture** where code is organized by features/screens rather than by file types. This approach improves maintainability, scalability, and developer experience.

### 📁 Project Structure

```
src/
├── screens/                    # Screen-based organization
│   ├── auth/                  # Authentication screens
│   │   └── Login.tsx         # Login screen
│   ├── home/                  # Home screen
│   │   └── Home.tsx          # Main dashboard/home
│   ├── contact/               # Contact screens
│   │   └── Contact.tsx       # Contact page
│   └── shared/                # Shared screens
│       └── NotFound.tsx      # 404 page
├── shared/                    # Shared resources
│   ├── components/            # Reusable components
│   │   ├── Form/
│   │   │   └── GenericForm.tsx
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Layout.tsx
│   │   └── AboutSection.tsx
│   ├── contexts/              # React contexts
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   ├── services/              # Business logic services
│   │   └── toastService.ts
│   ├── config/                # Configuration files
│   │   ├── apiRepo.ts
│   │   ├── axios.ts
│   │   └── endPoints.ts
│   └── schemas/               # Validation schemas
│       └── LoginScheme.ts
├── App.tsx                    # Main application
├── main.tsx                   # Entry point
└── index.css                  # Global styles
```

## 🚀 Features

### Authentication
- **Login System**: Complete login functionality with email and password
- **Theme Support**: Light and dark mode with smooth transitions
- **Form Validation**: Yup schema validation with error handling
- **Toast Notifications**: User-friendly success and error messages
- **React Query**: Optimized data fetching and caching
- **Cookie Management**: Secure token storage

### UI/UX
- **Responsive Design**: Mobile-first approach
- **Modern Animations**: Framer Motion for smooth interactions
- **Theme Consistency**: Vercel-inspired design system
- **Accessibility**: Proper ARIA labels and keyboard navigation

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Framer Motion
- **State Management**: React Context (Auth, Theme)
- **Data Fetching**: TanStack Query (React Query)
- **HTTP Client**: Axios with interceptors
- **Validation**: Yup schema validation
- **Notifications**: React Hot Toast
- **Routing**: React Router DOM

## 📋 Screen-Based Architecture Benefits

### ✅ **Advantages**
1. **Feature Isolation**: Each screen is self-contained with its own components
2. **Easy Navigation**: Clear folder structure makes it easy to find specific features
3. **Scalability**: Easy to add new screens without affecting existing ones
4. **Team Collaboration**: Multiple developers can work on different screens simultaneously
5. **Code Splitting**: Natural boundaries for lazy loading and code splitting
6. **Testing**: Easier to test individual screens in isolation

### 🎯 **Organization Principles**
- **Screens**: Each screen is a complete feature with its own folder
- **Shared Resources**: Common components, contexts, and utilities in `shared/`
- **Clear Separation**: Business logic separated from UI components
- **Consistent Patterns**: Similar structure across all screens

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd GNOUR
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🔐 Authentication Flow

### Login Process
1. User navigates to `/login`
2. Fills in email and password
3. Form validation using Yup schema
4. API call to `/auth/login` endpoint
5. Token stored in cookies
6. User redirected to dashboard
7. Toast notification for success/error

### API Integration
- **Base URL**: `https://localhost:4004/api`
- **Login Endpoint**: `POST /auth/login`
- **Token Storage**: Cookies with 7-day expiration
- **Error Handling**: Comprehensive error messages

## 🎨 Theme System

The application supports both light and dark themes:

### Light Theme
- Background: `bg-gray-50`
- Cards: `bg-white`
- Text: `text-gray-900`
- Borders: `border-gray-200`

### Dark Theme
- Background: `bg-black`
- Cards: `bg-gray-900`
- Text: `text-white`
- Borders: `border-gray-800`

## 📝 Form Components

### GenericForm
A reusable form component that:
- Automatically generates form fields from Yup schemas
- Supports multiple input types (text, email, password, select, file, etc.)
- Includes password visibility toggle
- Provides theme-aware styling
- Handles validation errors
- Supports custom submit button text

### Usage Example
```tsx
import { GenericForm } from "../../shared/components/Form/GenericForm";
import { loginSchema } from "../../shared/schemas/LoginScheme";

<GenericForm
  schema={loginSchema}
  onSubmit={handleSubmit}
  submitButtonText="Sign in"
/>
```

## 🔔 Toast Notifications

The application includes a centralized toast service:

### Available Methods
- `toastService.success(message)` - Success notifications
- `toastService.error(message)` - Error notifications
- `toastService.warning(message)` - Warning notifications
- `toastService.info(message)` - Info notifications
- `toastService.loading(message)` - Loading notifications

### Usage Example
```tsx
import { toastService } from "../../shared/services/toastService";

toastService.success("Login successful!");
toastService.error("Invalid credentials");
```

## 🔧 API Configuration

### Axios Setup
- Base URL configuration
- Request/response interceptors
- Automatic token handling
- Error handling

### API Repository Pattern
```typescript
// GET request
const data = await apiRepo.GET('/endpoint');

// POST request
const response = await apiRepo.POST('/endpoint', data);

// PATCH request
const updated = await apiRepo.PATCH('/endpoint', data);

// DELETE request
await apiRepo.DELETE('/endpoint');
```

## 🧪 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style
- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Consistent naming conventions

## 📱 Adding New Screens

To add a new screen following the screen-based architecture:

1. **Create Screen Directory**:
```bash
mkdir src/screens/new-feature
```

2. **Create Screen Component**:
```tsx
// src/screens/new-feature/NewFeature.tsx
import React from "react";
import { useTheme } from "../../shared/contexts/ThemeContext";

const NewFeature: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <div>
      {/* Your screen content */}
    </div>
  );
};

export default NewFeature;
```

3. **Add Route**:
```tsx
// src/App.tsx
import NewFeature from "./screens/new-feature/NewFeature";

<Route path="/new-feature" element={<NewFeature />} />
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes following the screen-based architecture
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.