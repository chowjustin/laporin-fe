"use client";

import { FormProvider, useForm } from "react-hook-form";
import { useLookupReport } from "@/app/report/track/hooks/useLookupReport";
import Button from "@/components/button/Button";
import TextArea from "@/components/form/TextArea";
import Typography from "@/components/Typography";
import Layout from "@/layouts/Layout";

type TrackForm = {
	seedPhrase: string;
};

export default function TrackForm() {
	const methods = useForm<TrackForm>();
	const { mutate, isPending } = useLookupReport();
	const onSubmit = (data: TrackForm) => {
		mutate({ seedPhrase: data.seedPhrase });
	};

	return (
		<Layout withNavbar withFooter>
			<div className="flex items-center justify-center h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] bg-primary-100 p-4">
				<FormProvider {...methods}>
					<form
						onSubmit={methods.handleSubmit(onSubmit)}
						className="bg-white p-8 rounded-md shadow-sm w-full max-w-lg"
					>
						<Typography
							variant="h1"
							weight="bold"
							className="mb-2 text-primary-800"
						>
							Track Laporan Anda
						</Typography>
						<Typography variant="b2" className="mb-4 text-gray-600">
							Masukkan seed phrase yang Anda simpan untuk mengakses chat
							terenkripsi.
						</Typography>

						<div className="space-y-4">
							<TextArea
								id="seedPhrase"
								placeholder="Masukkan seed phrase Anda"
								validation={{
									required: "Seed phrase tidak boleh kosong.",
								}}
								rows={5}
								disabled={isPending}
							/>
						</div>

						<Button type="submit" isLoading={isPending} className="mt-6 w-full">
							Track Laporan
						</Button>
					</form>
				</FormProvider>
			</div>
		</Layout>
	);
}
