"use client";

import { Checkbox } from "@headlessui/react";
import { CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Button from "@/components/button/Button";
import {
	Modal,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from "@/components/dialog/Modal";
import TextArea from "@/components/form/TextArea";
import ButtonLink from "@/components/links/ButtonLink";
import NextImage from "@/components/NextImage";
import Typography from "@/components/Typography";
import Layout from "@/layouts/Layout";
import { copyToClipboard } from "@/lib/clipboard";
import { useCreateReportMutation } from "../hooks/useCreateReport";

export type ReportForm = {
	details: string;
};

export default function CreateReportForm() {
	const methods = useForm<ReportForm>();
	const { handleSubmit, reset } = methods;
	const { mutate, isPending, data } = useCreateReportMutation();

	const [open, setOpen] = useState<boolean>(false);
	const [hasConfirmed, setHasConfirmed] = useState<boolean>(false);

	useEffect(() => {
		if (data?.data) {
			setHasConfirmed(false);
			setOpen(true);
		}
	}, [data]);

	const onSubmit = (formData: ReportForm) => {
		mutate(formData, {
			onSuccess: () => reset(),
		});
	};

	const handleModalChange = (isOpen: boolean) => {
		if (!isOpen && !hasConfirmed) {
			toast.error("Harap centang kotak persetujuan sebelum melanjutkan.");
			return;
		}
		setOpen(isOpen);
	};

	return (
		<Layout withNavbar withFooter>
			<Modal open={open} onOpenChange={handleModalChange}>
				<ModalContent>
					<ModalHeader>
						<ModalTitle className="text-center">
							<div className="flex flex-col items-center justify-center gap-3">
								<CheckCircle className="w-12 h-12 text-primary-500 text-center" />
								<Typography variant="h1" weight="bold">
									Laporan Berhasil Dibuat!
								</Typography>
							</div>
						</ModalTitle>
						<div className="flex flex-col items-center justify-center gap-3 p-4">
							<Typography
								variant="b1"
								className="text-center text-red-600"
								weight="bold"
							>
								PERINGATAN KRITIS: Simpan 12 Kata Seed Phrase Ini!
							</Typography>
							<Typography variant="b2" className="text-center">
								Ini adalah satu-satunya cara Anda untuk mengakses kembali
								laporan dan berkomunikasi dengan petugas. Kami tidak dapat
								memulihkannya jika hilang. Salin dan simpan di tempat yang
								paling aman.
							</Typography>
							<div className="bg-primary-50 px-6 py-4 rounded-md mb-4 w-full flex items-center flex-col gap-2">
								<Typography variant="b2" weight="semibold">
									Seed Phrase Anda:
								</Typography>
								<Typography
									variant="b1"
									className="text-center text-primary-1000 break-words"
									weight="medium"
								>
									{data?.data.seed_phrase}
								</Typography>
								<Button
									variant="outline"
									onClick={() => copyToClipboard(data?.data?.seed_phrase || "")}
									className="mt-2 w-fit"
								>
									Salin Seed Phrase
								</Button>

								<div className="flex items-center justify-center gap-2 mt-2">
									<Checkbox
										id="confirmSeed"
										checked={hasConfirmed}
										onChange={() => setHasConfirmed((prev) => !prev)}
										className="border border-gray-400 rounded w-4 h-4 flex items-center justify-center cursor-pointer"
									>
										{hasConfirmed && (
											<span className="text-primary-800">✔</span>
										)}
									</Checkbox>
									<label htmlFor="confirmSeed">
										<Typography variant="b2" className="text-primary-800">
											Saya telah menyalin seed phrase ini
										</Typography>
									</label>
								</div>
							</div>
						</div>
					</ModalHeader>

					<ModalFooter>
						<div className="w-full flex justify-center gap-4">
							<ButtonLink
								href="/officer/dashboard"
								variant="outline"
								className={
									!hasConfirmed ? "pointer-events-none opacity-50" : ""
								}
							>
								Kembali ke Beranda
							</ButtonLink>
							<ButtonLink
								href="/report/track"
								className={
									!hasConfirmed ? "pointer-events-none opacity-50" : ""
								}
							>
								Track Laporan
							</ButtonLink>
						</div>
					</ModalFooter>
				</ModalContent>
			</Modal>

			<div className="flex min-h-screen w-full">
				<div className="flex-1 bg-primary-200 items-center justify-center w-full hidden md:flex">
					<NextImage src="/people.png" alt="Orang" width={400} height={400} />
				</div>
				<div className="flex-1 flex py-16 sm:py-20 justify-center bg-white">
					<FormProvider {...methods}>
						<form
							onSubmit={handleSubmit(onSubmit)}
							className="w-[80%] md:w-[80%] flex flex-col gap-5"
						>
							<Typography variant="j1" weight="bold">
								Buat Laporan
							</Typography>
							<Typography
								variant="s2"
								className="text-typo-secondary text-justify"
							>
								Silakan ceritakan kronologi kejadian yang Anda alami. Coba
								jelaskan apa yang terjadi, siapa saja yang terlibat, serta kapan
								dan di mana peristiwa itu berlangsung. Setiap detail yang Anda
								bagikan sangat berharga.
							</Typography>
							<TextArea
								id="details"
								placeholder="Tuliskan cerita Anda di sini..."
								validation={{ required: "Laporan tidak boleh kosong." }}
								rows={10}
							/>
							<Button type="submit" isLoading={isPending} className="w-full">
								Kirim Laporan
							</Button>
						</form>
					</FormProvider>
				</div>
			</div>
		</Layout>
	);
}
