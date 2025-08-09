import type { Metadata } from "next";
import OfficerReportPage from "./containers/OfficerReportPage";

export const metadata: Metadata = {
	title: "Chat Petugas",
};

export default async function Page() {
	return <OfficerReportPage />;
}
