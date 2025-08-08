import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Head from "next/head";
import Providers from "@/app/providers";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const siteConfig = {
	title: "Laporin",
	description:
		"Laporin adalah platform untuk melaporkan kejadian yang Anda alami. Ceritakan kronologi kejadian, siapa saja yang terlibat, dan kapan kejadiannya.",
	url: process.env.SITE_URL || "https://example.com",
};

export const metadata: Metadata = {
	metadataBase: new URL(siteConfig.url),
	title: {
		default: siteConfig.title,
		template: `%s - ${siteConfig.title}`,
	},
	description: siteConfig.description,
	twitter: {
		card: "summary_large_image",
	},
	robots: { index: true, follow: true },
	authors: [
		{
			name: siteConfig.title,
			url: siteConfig.url,
		},
	],
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<Head>
				<meta name="apple-mobile-web-app-title" content={siteConfig.title} />
			</Head>
			{process.env.NEXT_PUBLIC_RUN_MODE === "production" && <GoogleAnalytics />}
			<body className={`${inter.className}`} suppressHydrationWarning>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
