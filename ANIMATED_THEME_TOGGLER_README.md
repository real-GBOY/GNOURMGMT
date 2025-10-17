<!-- @format -->

# Animated Theme Toggler Implementation

This project now uses the animated theme toggler from Magic UI instead of the previous basic theme toggle buttons.

## What Changed

1. **Replaced basic theme toggle buttons** with the `AnimatedThemeToggler` component
2. **Added view transitions** for smooth theme switching animations
3. **Updated theme context** to support CSS class-based dark mode
4. **Added CSS variables** for consistent theming across components

## Components Updated

- `Header.tsx` - Main navigation header theme toggle
- `DashboardLayout.tsx` - Sidebar theme toggle
- `ThemeContext.tsx` - Enhanced with CSS class support

## New Dependencies

- `clsx` - Utility for conditional class names
- `tailwind-merge` - Utility for merging Tailwind classes
- `AnimatedThemeToggler` - Magic UI component

## How It Works

1. **Theme Context**: Manages theme state and applies `dark` class to document element
2. **CSS Variables**: Provides consistent color scheme for light/dark modes
3. **View Transitions**: Creates smooth circular animations when switching themes
4. **Tailwind Integration**: Uses `darkMode: "class"` for CSS class-based dark mode

## Usage

```tsx
import { AnimatedThemeToggler } from "@/components/magicui/animated-theme-toggler";

// Basic usage
<AnimatedThemeToggler />

// With custom styling
<AnimatedThemeToggler className="p-2 rounded-md hover:bg-gray-100" />
```

## Features

- ✅ Smooth circular view transition animations
- ✅ Consistent theming across all components
- ✅ Preserves user theme preference in localStorage
- ✅ Respects system theme preference on first visit
- ✅ Responsive design for mobile and desktop
- ✅ Accessible with proper ARIA labels

## CSS Variables

The theme system now includes comprehensive CSS variables for:

- Background colors
- Foreground colors
- Card colors
- Border colors
- Input colors
- And more...

These variables automatically switch between light and dark values based on the current theme.
