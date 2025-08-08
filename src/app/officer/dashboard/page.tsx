// src/app/officer/dashboard/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Button from "@/components/button/Button";
import withAuth from "@/components/hoc/withAuth";
import Layout from "@/layouts/Layout";
import { getToken } from "@/lib/cookies";
import useAuthStore from "@/stores/useAuthStore";

interface Report {
	id: string;
	details: string | null;
	created_at: string;
}

export default withAuth(OfficerDashboard, "officer");
function OfficerDashboard() {
	const token = getToken();
	const logout = useAuthStore.useLogout();
	const [reports, setReports] = useState<Report[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const user = useAuthStore.useUser();

	useEffect(() => {
		const fetchReports = async () => {
			try {
				const response = await fetch("http://localhost:5000/api/reports", {
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				});
				const data = await response.json();
				setReports(data.data);
			} catch (error) {
				console.error("Failed to fetch reports:", error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchReports();
	}, [token]);

	return (
		<Layout withNavbar withFooter>
			<div className="container mx-auto py-10 px-4 min-h-screen">
				{!user && (
					<p className="text-red-500 mb-4">
						You must be logged in to view this page.
					</p>
				)}
				{user && (
					<p className="text-green-500 mb-4">
						Welcome, {user.name}! You are logged in as an officer.
					</p>
				)}
				<Button onClick={logout} variant="red" className="mb-4">
					Logout
				</Button>
				<h1 className="text-3xl font-bold mb-6">Officer Dashboard</h1>
				{isLoading ? (
					<p>Loading reports...</p>
				) : (
					<div className="bg-white p-6 rounded-lg shadow-lg">
						<ul className="space-y-4">
							{reports?.length > 0 ? (
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
												Created: {new Date(report.created_at).toLocaleString()}
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
