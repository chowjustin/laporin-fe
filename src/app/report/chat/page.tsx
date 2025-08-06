"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useReportStore } from "@/app/stores/useReportStore";
import ChatClient from "@/components/chat/ChatClient";
import Layout from "@/layouts/Layout";

export default function UserReportChatPage() {
	const router = useRouter();
	const { reportId, seedPhrase } = useReportStore();

	// Protect the route. If there's no data in the store, redirect to login.
	useEffect(() => {
		if (!reportId || !seedPhrase) {
			router.replace("/report/track");
		}
	}, [reportId, seedPhrase, router]);

	// Render a loading state or nothing while redirecting
	if (!reportId || !seedPhrase) {
		return (
			<Layout withNavbar withFooter>
				<div className="flex items-center justify-center min-h-screen">
					<p>Redirecting to login...</p>
				</div>
			</Layout>
		);
	}

	return (
		<Layout withNavbar withFooter>
			<div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
				<ChatClient reportId={reportId} roles="user" seedPhrase={seedPhrase} />
			</div>
		</Layout>
	);
}
