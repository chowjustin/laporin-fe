"use client";

import * as bip39 from "bip39";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useReportStore } from "@/app/stores/useReportStore";
import Button from "@/components/button/Button";
import Input from "@/components/form/Input";
import Layout from "@/layouts/Layout";
import { generateEncryptionKeyPair } from "@/lib/crypto";

type LoginForm = {
	seedPhrase: string;
};

export default function ReportLoginPage() {
	const router = useRouter();
	const methods = useForm<LoginForm>();
	const [isLoading, setIsLoading] = useState(false);
	const setReportData = useReportStore.useSetReportData();

	const onSubmit = async (data: LoginForm) => {
		setIsLoading(true);
		// Validate the seed phrase format
		if (!bip39.validateMnemonic(data.seedPhrase)) {
			toast.error("Invalid seed phrase. Please check and try again.");
			setIsLoading(false);
			return;
		}

		try {
			// 1. Generate public key from seed phrase
			const keys = await generateEncryptionKeyPair(data.seedPhrase);

			// 2. Look up the report ID from the backend
			const response = await fetch("http://localhost:5000/api/reports/lookup", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ user_public_key: keys.publicKey }),
			});

			if (!response.ok) {
				throw new Error("Could not find a report for this seed phrase.");
			}

			const result = await response.json();
			const { reportId } = result.data;

			// 3. If valid, store data in memory (Zustand) and redirect
			setReportData(reportId, data.seedPhrase);
			router.push(`/report/chat`);
		} catch (error) {
			toast.error(
				"An error occurred. Please check the seed phrase and try again.",
			);
			console.error(error);
			setIsLoading(false);
		}
	};

	return (
		<Layout withNavbar withFooter>
			<div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
				<FormProvider {...methods}>
					<form
						onSubmit={methods.handleSubmit(onSubmit)}
						className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg"
					>
						<h1 className="text-2xl font-bold mb-6">Access Your Report</h1>
						<p className="mb-4 text-sm text-gray-600">
							Enter the secret seed phrase you saved to access the encrypted
							chat.
						</p>
						<div className="space-y-4">
							<Input
								id="seedPhrase"
								label="Secret Seed Phrase"
								placeholder="Enter your 12-word seed phrase"
								validation={{ required: "Seed phrase is required." }}
							/>
						</div>
						<Button type="submit" isLoading={isLoading} className="mt-6 w-full">
							Access Chat
						</Button>
					</form>
				</FormProvider>
			</div>
		</Layout>
	);
}
