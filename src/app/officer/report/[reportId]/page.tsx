"use client";

import { useParams } from "next/navigation";
import ChatClient from "@/components/chat/ChatClient";
import Layout from "@/layouts/Layout";

export default function OfficerReportPage() {
	const params = useParams();
	const reportId = params.reportId as string;

	return (
		<Layout withNavbar withFooter>
			<div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
				{reportId ? (
					<ChatClient reportId={reportId} roles="officer" />
				) : (
					<p>Loading report...</p>
				)}
			</div>
		</Layout>
	);
}
