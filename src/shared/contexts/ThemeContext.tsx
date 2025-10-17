/** @format */

import React, { createContext, useContext, useState, useEffect } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
	theme: Theme;
	toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
};

interface ThemeProviderProps {
	children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
	const [theme, setTheme] = useState<Theme>(() => {
		// Check if there's a saved theme in localStorage
		const savedTheme = localStorage.getItem("theme") as Theme;
		if (savedTheme) {
			return savedTheme;
		}

		// Check system preference
		if (typeof window !== "undefined" && window.matchMedia) {
			const systemPrefersDark = window.matchMedia(
				"(prefers-color-scheme: dark)"
			).matches;
			return systemPrefersDark ? "dark" : "light";
		}

		return "light";
	});

	useEffect(() => {
		// Apply theme class to document element for view transitions
		if (typeof document !== "undefined") {
			if (theme === "dark") {
				document.documentElement.classList.add("dark");
			} else {
				document.documentElement.classList.remove("dark");
			}
		}
	}, [theme]);

	useEffect(() => {
		// Save theme to localStorage whenever it changes
		localStorage.setItem("theme", theme);
	}, [theme]);

	const toggleTheme = () => {
		setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
	};

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};
