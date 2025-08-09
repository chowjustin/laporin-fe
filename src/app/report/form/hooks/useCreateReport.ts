import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";
import api from "@/lib/api";
import {
	encryptMessage,
	generateEncryptionKeyPair,
	generateSeedPhrase,
} from "@/lib/crypto";
import type { ApiError, ApiResponse } from "@/types/api";
import type { Report } from "@/types/entities/report";
import type { ReportForm } from "../containers/CreateReportForm";

export const useCreateReportMutation = () => {
	const { data, mutate, isPending } = useMutation<
		ApiResponse<Report>,
		AxiosError<ApiError>,
		ReportForm
	>({
		mutationFn: async (data: ReportForm) => {
			const seedPhrase = generateSeedPhrase();
			const userKeys = await generateEncryptionKeyPair(seedPhrase);
			const officerKeys = await generateEncryptionKeyPair(
				process.env.OFFICER_SEED_PHRASE || "",
			);
			const encryptedDetails = await encryptMessage(
				data.details,
				officerKeys.publicKey,
				userKeys.privateKey,
			);
			const res = await api.post<ApiResponse<Report>>("/reports", {
				details: encryptedDetails,
				user_public_key: userKeys.publicKey,
			});
			return {
				...res.data,
				data: {
					...res.data.data,
					seed_phrase: seedPhrase,
				},
			};
		},
		onSuccess: () => {
			toast.success("Laporan berhasil dibuat!");
		},
		onError: (error) => {
			toast.error(
				error.response?.data.message ||
					"Terjadi kesalahan saat membuat laporan.",
			);
		},
	});

	return {
		mutate,
		isPending,
		data,
	};
};
