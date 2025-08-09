"use client";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { validateMnemonic } from "bip39";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { decryptMessage, generateEncryptionKeyPair } from "@/lib/crypto";
import { useReportStore } from "@/stores/useReportStore";
import type { ApiError, ApiResponse } from "@/types/api";
import type { Report } from "@/types/entities/report";

export const useLookupReport = () => {
	const setReportData = useReportStore.useSetReportData();
	const { mutate, isPending, isError, data } = useMutation<
		ApiResponse<Report> & {
			seedPhrase: string;
			publicKey: string;
			privateKey: string;
		},
		AxiosError<ApiError>,
		{ seedPhrase: string }
	>({
		mutationFn: async ({ seedPhrase }) => {
			if (!validateMnemonic(seedPhrase)) {
				toast.error("Seed phrase yang dimasukkan tidak valid.");
				throw new Error("Invalid seed phrase"); // throw to trigger onError
			}
			const { publicKey, privateKey } =
				await generateEncryptionKeyPair(seedPhrase);
			const res = await api.post("/reports/lookup", { key: publicKey });

			return {
				...res.data,
				seedPhrase,
				publicKey,
				privateKey,
			};
		},
		onError: (error) => {
			if (error.response) {
				toast.error(error.response.data.message);
			} else {
				toast.error("Terjadi kesalahan. Silakan coba lagi.");
			}
		},
		onSuccess: async (response) => {
			const encryptedDetails = await decryptMessage(
				response.data.details as string,
				process.env.NEXT_PUBLIC_OFFICER_PUBLIC_KEY as string,
				response.privateKey,
			);
			setReportData(
				response.data.id,
				response.seedPhrase,
				response.publicKey,
				response.privateKey,
				encryptedDetails,
			);
			toast.success("Laporan ditemukan!");
		},
	});

	return {
		mutate,
		isPending,
		isError,
		data,
	};
};
