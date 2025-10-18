/**
 * @format
 * @type {import('tailwindcss').Config}
 */

export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	darkMode: "class",
	theme: {
		screens: {
			xs: "475px",
			sm: "640px",
			md: "768px",
			lg: "1024px",
			xl: "1280px",
			"2xl": "1536px",
		},
		extend: {
			fontFamily: {
				sans: [
					"Inter",
					"system-ui",
					"-apple-system",
					"BlinkMacSystemFont",
					"Segoe UI",
					"Roboto",
					"Helvetica Neue",
					"Arial",
					"sans-serif",
				],
			},
			colors: {
				vercel: {
					"gray-50": "#fafafa",
					"gray-100": "#f5f5f5",
					"gray-200": "#e5e5e5",
					"gray-300": "#d4d4d4",
					"gray-400": "#a3a3a3",
					"gray-500": "#737373",
					"gray-600": "#525252",
					"gray-700": "#404040",
					"gray-800": "#262626",
					"gray-900": "#171717",
				},
			},
			animation: {
				"fade-in": "fadeIn 0.5s ease-in-out",
				"slide-up": "slideUp 0.5s ease-out",
				float: "float 6s ease-in-out infinite",
			},
			keyframes: {
				fadeIn: {
					"0%": { opacity: "0" },
					"100%": { opacity: "1" },
				},
				slideUp: {
					"0%": { transform: "translateY(20px)", opacity: "0" },
					"100%": { transform: "translateY(0)", opacity: "1" },
				},
				float: {
					"0%, 100%": { transform: "translateY(0px)" },
					"50%": { transform: "translateY(-10px)" },
				},
			},
			boxShadow: {
				vercel: "0 1px 2px rgba(0, 0, 0, 0.04), 0 8px 16px rgba(0, 0, 0, 0.06)",
				"vercel-lg":
					"0 4px 8px rgba(0, 0, 0, 0.04), 0 20px 40px rgba(0, 0, 0, 0.08)",
				"vercel-xl":
					"0 8px 16px rgba(0, 0, 0, 0.04), 0 32px 64px rgba(0, 0, 0, 0.12)",
			},
			backgroundImage: {
				"gradient-vercel": "linear-gradient(180deg, #fafafa 0%, #ffffff 100%)",
				"gradient-vercel-dark":
					"linear-gradient(180deg, #000000 0%, #111111 100%)",
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
			},
			spacing: {
				18: "4.5rem",
				88: "22rem",
				128: "32rem",
			},
		},
	},
	plugins: [],
};
