import type { Metadata } from "next";
import CreateReportForm from "./containers/CreateReportForm";

export const metadata: Metadata = {
	title: "Buat Laporan",
};

export default function Page() {
	return <CreateReportForm />;
}
