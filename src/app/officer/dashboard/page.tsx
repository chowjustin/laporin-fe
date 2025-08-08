"use client";

import type { ColumnDef } from "@tanstack/react-table";
import withAuth from "@/components/hoc/withAuth";
import ButtonLink from "@/components/links/ButtonLink";
import Typography from "@/components/Typography";
import Table from "@/components/table/Table";
import Layout from "@/layouts/Layout";
import useAuthStore from "@/stores/useAuthStore";
import type { Report } from "@/types/entities/report";
import { useGetAllReports } from "./hooks/useGetAllReports";

export default withAuth(OfficerDashboard, "officer");

function OfficerDashboard() {
	const user = useAuthStore.useUser();
	const { data: reports, isLoading } = useGetAllReports();

	return (
		<Layout withNavbar withFooter>
			<div className="container mx-auto py-10 px-4 min-h-screen">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
					<div>
						<Typography variant="j2" weight="bold" className="text-primary-800">
							Dashboard Petugas
						</Typography>
						<div className="flex flex-col md:flex-row items-center gap-2 mt-2">
							<Typography variant="h3" weight="medium">
								Selamat datang, {user?.name || "Petugas"}!
							</Typography>
							<span className="px-3 py-1 rounded-full bg-primary-200/50 text-primary-700 text-sm font-medium">
								{getInstanceTypeLabel(user?.instance as string) ||
									"Instansi Anda"}
							</span>
						</div>
					</div>
				</div>

				<Table
					className="text-black w-full"
					data={reports?.data || []}
					columns={columns}
					isLoading={isLoading}
					withFilter
					withEntries
					withPaginationControl
				/>
			</div>
		</Layout>
	);
}

const INSTANCE_TYPE_LABEL: Record<string, string> = {
	POLRI_PPA: "Unit PPA Polri",
	UPTD_PPA: "UPTD PPA dan P2TP2A",
	KOMNAS_PEREMPUAN: "Komisi Nasional Anti Kekerasan terhadap Perempuan.",
	KPAI: "Komisi Perlindungan Anak Indonesia",
	LBH_OMS: "Lembaga Bantuan Hukum & Organisasi Masyarakat Sipil",
};

function getInstanceTypeLabel(instance: string) {
	if (!instance) return undefined;
	return INSTANCE_TYPE_LABEL[instance];
}

const CATEGORY_LABEL: Record<string, string> = {
	KEKERASAN_DALAM_RUMAH_TANGGA: "Kekerasan Dalam Rumah Tangga",
	KEKERASAN_SEKSUAL: "Kekerasan Seksual",
	KEKERASAN_PADA_ANAK: "Kekerasan Pada Anak",
	PERDAGANGAN_ORANG: "Perdagangan Orang",
	SIBER_KEKERASAN_BERBASIS_GENDER: "Siber Kekerasan Berbasis Gender",
	KEKERASAN_LAINNYA: "Kekerasan Lainnya",
};

function getCategoryLabel(category: string) {
	if (!category) return undefined;
	return CATEGORY_LABEL[category];
}

const columns: ColumnDef<Report>[] = [
	{
		accessorKey: "summary",
		header: "Ringkasan Laporan",
		cell: (props) => {
			const summary = props.getValue() as string;
			return (
				<span className="text-justify">{summary || "Tidak Diketahui"}</span>
			);
		},
	},
	{
		accessorKey: "category",
		header: "Kategori",
		cell: (props) => {
			const category = props.getValue() as string;
			return <span>{getCategoryLabel(category) || "Tidak Diketahui"}</span>;
		},
	},
	{
		accessorKey: "urgency",
		header: "Urgensi",
	},
	{
		accessorKey: "created_at",
		header: "Tanggal Dibuat",
		cell: (props) => {
			const date = new Date(props.getValue() as string);
			return <span>{date.toLocaleDateString("id-ID")}</span>;
		},
	},
	{
		id: "actions",
		header: "Aksi",
		cell: (props) => (
			<ButtonLink
				variant="primary"
				href={`/officer/report/${props.row.original.id}`}
				className="text-center"
			>
				Lihat Detail
			</ButtonLink>
		),
	},
];
