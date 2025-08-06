"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useReportStore } from "@/app/stores/useReportStore";
import Button from "@/components/button/Button";
import TextArea from "@/components/form/TextArea";
import Layout from "@/layouts/Layout";
import { generateEncryptionKeyPair, generateSeedPhrase } from "@/lib/crypto";

type ReportForm = {
	details: string;
};

export default function CreateReportPage() {
	const router = useRouter();
	const methods = useForm<ReportForm>();
	const [generatedData, setGeneratedData] = useState<{
		reportId: string;
		seedPhrase: string;
	} | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const setReportData = useReportStore.useSetReportData();

	const onSubmit = async (data: ReportForm) => {
		setIsLoading(true);
		try {
			// 1. Generate new seed phrase and key pair
			const seedPhrase = generateSeedPhrase();
			const keys = await generateEncryptionKeyPair(seedPhrase);

			// 2. Send report details and public key to backend
			const response = await fetch("http://localhost:5000/api/reports", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					details: data.details,
					userPublicKey: keys.publicKey,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to create report.");
			}

			const result = await response.json();
			const reportId = result.data.id;

			// 3. Store session data in memory (Zustand) instead of localStorage
			setReportData(reportId, seedPhrase);

			// 4. Display the generated data to the user
			setGeneratedData({ reportId, seedPhrase });
			toast.success("Report created successfully!");
		} catch (error) {
			toast.error("An error occurred while creating the report.");
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text);
		toast.success("Copied to clipboard!");
	};

	const handleGoToChat = () => {
		// Data is already in the store, so we can just navigate
		router.push(`/report/chat`);
	};

	if (generatedData) {
		return (
			<Layout withNavbar withFooter>
				<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 text-center">
					<div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl">
						<h1 className="text-2xl font-bold text-green-600 mb-4">
							Report Submitted Successfully!
						</h1>
						<p className="text-red-600 font-semibold mb-4">
							IMPORTANT: Please save this seed phrase in a secure location. It
							is the ONLY way to access your report and chat. If you lose it,
							you will lose access forever.
						</p>
						<div className="bg-gray-100 p-4 rounded-md mb-4">
							<h3 className="font-semibold text-gray-700">Your Report ID:</h3>
							<p className="font-mono text-sm break-all mb-2">
								{generatedData.reportId}
							</p>
							<h3 className="font-semibold text-gray-700">
								Your Secret Seed Phrase:
							</h3>
							<p className="font-mono text-lg text-blue-700 break-words">
								{generatedData.seedPhrase}
							</p>
						</div>
						<Button
							variant="outline"
							onClick={() => copyToClipboard(generatedData.seedPhrase)}
							className="mb-4"
						>
							Copy Seed Phrase
						</Button>
						<Button onClick={handleGoToChat}>Go to Chat</Button>
					</div>
				</div>
			</Layout>
		);
	}

	return (
		<Layout withNavbar withFooter>
			<div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
				<FormProvider {...methods}>
					<form
						onSubmit={methods.handleSubmit(onSubmit)}
						className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg"
					>
						<h1 className="text-2xl font-bold mb-6">Create Anonymous Report</h1>
						<TextArea
							id="details"
							label="Report Details"
							placeholder="Provide as much detail as possible..."
							validation={{ required: "Details are required." }}
						/>
						<Button type="submit" isLoading={isLoading} className="mt-4 w-full">
							Submit Report
						</Button>
					</form>
				</FormProvider>
			</div>
		</Layout>
	);
}
