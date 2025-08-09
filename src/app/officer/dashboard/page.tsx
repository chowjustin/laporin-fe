"use client";

import type { ColumnDef } from "@tanstack/react-table";
import withAuth from "@/components/hoc/withAuth";
import ButtonLink from "@/components/links/ButtonLink";
import Typography from "@/components/Typography";
import Table from "@/components/table/Table";
import Layout from "@/layouts/Layout";
import clsxm from "@/lib/clsxm";
import useAuthStore from "@/stores/useAuthStore";
import type { Report } from "@/types/entities/report";
import { getCategoryLabel, getInstanceTypeLabel } from "./helper";
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
		cell: (props) => {
			const urgency = props.getValue() as string;

			const urgencyStyles: { [key: string]: string } = {
				Kritis: "bg-red-800 text-white",
				Tinggi: "bg-red-500 text-white",
				Sedang: "bg-orange-400 text-white",
			};

			const badgeClass = urgencyStyles[urgency] || "bg-gray-400 text-white";

			return (
				<span
					className={clsxm(
						"px-3 py-1 text-sm font-semibold rounded-full",
						badgeClass,
					)}
				>
					{urgency || "Tidak Diketahui"}
				</span>
			);
		},
	},
	{
		accessorKey: "created_at",
		header: "Tanggal Dibuat",
		cell: (props) => {
			const date = new Date(props.getValue() as string);
			return (
				<span>
					{date.toLocaleString("id-ID", {
						dateStyle: "medium",
						timeStyle: "short",
					})}
				</span>
			);
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
