// src/app/officer/dashboard/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Layout from "@/layouts/Layout";

interface Report {
	id: string;
	details: string | null;
	createdAt: string;
}

export default function OfficerDashboard() {
	const [reports, setReports] = useState<Report[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchReports = async () => {
			try {
				const response = await fetch("http://localhost:5000/api/reports");
				const data = await response.json();
				setReports(data.data);
			} catch (error) {
				console.error("Failed to fetch reports:", error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchReports();
	}, []);

	return (
		<Layout withNavbar withFooter>
			<div className="container mx-auto py-10 px-4 min-h-screen">
				<h1 className="text-3xl font-bold mb-6">Officer Dashboard</h1>
				{isLoading ? (
					<p>Loading reports...</p>
				) : (
					<div className="bg-white p-6 rounded-lg shadow-lg">
						<ul className="space-y-4">
							{reports.length > 0 ? (
								reports.map((report) => (
									<li key={report.id} className="border-b pb-4">
										<Link
											href={`/officer/report/${report.id}`}
											className="hover:text-blue-600"
										>
											<p className="font-bold text-lg">
												Report ID: {report.id}
											</p>
											<p className="text-sm text-gray-600">
												Created: {new Date(report.createdAt).toLocaleString()}
											</p>
											<p className="mt-2 text-gray-800 truncate">
												{report.details || "No details provided."}
											</p>
										</Link>
									</li>
								))
							) : (
								<p>No reports found.</p>
							)}
						</ul>
					</div>
				)}
			</div>
		</Layout>
	);
}
