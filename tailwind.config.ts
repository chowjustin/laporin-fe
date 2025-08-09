import type { Config } from "tailwindcss";

const { fontFamily } = require("tailwindcss/defaultTheme");

const config: Config = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		container: {
			center: true,
			padding: "1rem",
			screens: {
				xl: "1152px",
			},
		},
		extend: {
			fontFamily: {
				minHeight: {
					main: "calc(100vh - 80px)",
					"main-mobile": "calc(100vh - 64px)", // for mobile
				},
				poppins: ["var(--font-poppins)", ...fontFamily.sans],
			},
			colors: {
				primary: {
					50: "#e7f4fb",
					100: "#d1eaf8",
					200: "#a3d5f1", // complement
					300: "#75c0ea",
					400: "#47abe3",
					500: "#1a96dc", // default
					600: "#007fc3", // hovered
					700: "#0067a0", // active
					800: "#004e7a",
					900: "#003754",
					1000: "#002336",
				},
				secondary: {
					50: "#f9d6d5",
					//* Background
					100: "#f6bbba",
					200: "#f19a97",
					//* Complement
					300: "#ec7874",
					400: "#e85652",
					//* Default
					500: "#e3342f",
					//* Hovered
					600: "#bd2b27",
					//* Active
					700: "#97231f",
					800: "#721a18",
					900: "#4c1110",
					1000: "#2d0a09",
				},
				typo: {
					DEFAULT: "#1F1F1F",
					secondary: "#707070",
					tertiary: "#999CA0",
					icons: "#999CA0",
					divider: "#EBEBEB",
					outline: "#D9D9D9",
				},
				"primary-bg": "#dc3545", // bg
				"primary-hover": "#bb2d3b", // hover
				dark: "#212529",
				light: "#ffffff",
				"theme-gray": "#f8f9fa",
			},
			boxShadow: {
				footer: "0px -2px 4px rgba(0, 0, 0, 0.25)",
				"card-menu": "0 4px 18px rgba(0, 0, 0, 0.15)",
			},
		},
	},
	plugins: [],
};
export default config;
