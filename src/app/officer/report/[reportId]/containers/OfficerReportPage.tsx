"use client";

import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";
import Loading from "@/app/loading";
import { getCategoryLabel } from "@/app/officer/dashboard/helper";
import ChatClient from "@/components/chat/ChatClient";
import withAuth from "@/components/hoc/withAuth";
import ButtonLink from "@/components/links/ButtonLink";
import Typography from "@/components/Typography";
import Layout from "@/layouts/Layout";
import clsxm from "@/lib/clsxm";
import { useGetOfficerKeys } from "../hooks/useGetOfficerKeys";
import { useGetReportDetail } from "../hooks/useGetReportDetail";

export default withAuth(OfficerReportPage, "officer");
function OfficerReportPage() {
	const params = useParams();
	const reportId = params.reportId as string;
	const { privateKey, isLoading: isLoadingKeys } = useGetOfficerKeys();

	const { data, isLoading } = useGetReportDetail(reportId);

	if (isLoading || isLoadingKeys || !data) {
		return <Loading />;
	}

	return (
		<Layout withNavbar>
			<div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)] md:min-h-[calc(100vh-80px)] shadow-lg rounded-lg">
				<div className="p-8 md:pr-12 flex flex-col gap-6 md:w-2/5 md:flex-none">
					<ButtonLink
						href="/officer/dashboard"
						variant="ghost"
						className="w-fit text-left text-primary-800 p-1"
						leftIcon={ArrowLeft}
						size="base"
					>
						Kembali ke Dashboard
					</ButtonLink>
					<Typography variant="h2" weight="bold" className="text-typo">
						Laporan <span className="text-primary-500">#{data.data.id}</span>
					</Typography>
					{/* Ringkasan */}
					<section>
						<Typography
							variant="h4"
							font="Poppins"
							weight="semibold"
							className="mb-2"
						>
							Ringkasan Laporan (oleh AI)
						</Typography>
						<Typography variant="b2" className="text-justify">
							{data.data.summary || "Tidak Diketahui"}
						</Typography>
					</section>

					{/* Kategori */}
					<section>
						<Typography
							variant="h5"
							font="Poppins"
							weight="semibold"
							className="mb-1"
						>
							Kategori
						</Typography>
						<Typography variant="b2">
							{getCategoryLabel(data.data.category as string) ||
								"Tidak Diketahui"}
						</Typography>
					</section>

					{/* Urgensi */}
					<section>
						<Typography
							variant="h5"
							font="Poppins"
							weight="semibold"
							className="mb-1"
						>
							Urgensi
						</Typography>
						<span
							className={clsxm(
								"inline-block px-3 py-1 rounded-full font-semibold",
								urgencyStyles[data.data.urgency as string] ||
									"bg-gray-400 text-white",
							)}
						>
							{data.data.urgency || "Tidak Diketahui"}
						</span>
					</section>

					{/* Tanggal Dibuat */}
					<section>
						<Typography
							variant="h5"
							font="Poppins"
							weight="semibold"
							className="mb-1"
						>
							Tanggal Dibuat
						</Typography>
						<Typography variant="b2">
							{data.data.created_at
								? new Date(data.data.created_at).toLocaleString("id-ID", {
										dateStyle: "long",
										timeStyle: "short",
									})
								: "Tidak Diketahui"}
						</Typography>
					</section>
				</div>
				{/* Chat Client */}

				<div className="flex-1 w-full bg-primary-50/50">
					{!!reportId && privateKey && !!data && data?.data.user_public_key && (
						<ChatClient
							key={`${privateKey}-${data.data.user_public_key}`}
							reportId={reportId}
							userRole="OFFICER"
							myPrivateKey={privateKey}
							theirPublicKey={data.data.user_public_key}
						/>
					)}
				</div>
			</div>
		</Layout>
	);
}

const urgencyStyles: { [key: string]: string } = {
	Kritis: "bg-red-800 text-white",
	Tinggi: "bg-red-500 text-white",
	Sedang: "bg-orange-400 text-white",
};
