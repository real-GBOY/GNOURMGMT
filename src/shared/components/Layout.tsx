/** @format */

import React from "react";
import { useLocation } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import Header from "./Header";
import Footer from "./Footer";
import CornerLights from "./CornerLights";

interface LayoutProps {
	children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
	const { theme } = useTheme();
	const location = useLocation();

	// Check if current route is a dashboard route
	const isDashboardRoute = location.pathname.startsWith("/dashboard");

	return (
		<div
			className={`min-h-screen relative transition-colors duration-300 ${
				theme === "dark" ? "bg-black text-white" : "bg-white text-black"
			}`}>
			{/* Corner Lights - show on all pages */}
			<CornerLights />

			{/* Vercel-style grid pattern - only show on non-dashboard routes */}
			{!isDashboardRoute && (
				<div
					className='absolute inset-0 opacity-[0.02] '
					style={{
						backgroundImage: `
              linear-gradient(${
								theme === "dark" ? "rgba(255,255,255,1)" : "rgba(0,0,0,1)"
							} 1px, transparent 1px),
              linear-gradient(90deg, ${
								theme === "dark" ? "rgba(255,255,255,1)" : "rgba(0,0,0,1)"
							} 1px, transparent 1px)
            `,
						backgroundSize: "24px 24px",
					}}
				/>
			)}

			{/* Only show Header and Footer on non-dashboard routes */}
			{!isDashboardRoute && <Header />}
			<main className='relative z-10'>{children}</main>
			{!isDashboardRoute && <Footer />}
		</div>
	);
};

export default Layout;
