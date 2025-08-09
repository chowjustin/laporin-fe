"use client";

import { useReportStore } from "@/stores/useReportStore";
import ClientChatPage from "./containers/ClientChatPage";
import TrackForm from "./containers/TrackForm";

export default function ReportLoginPage() {
	const reportId = useReportStore.useReportId();
	const privateKey = useReportStore.usePrivateKey();
	const details = useReportStore.useDetails();

	return reportId && privateKey && details ? (
		<ClientChatPage
			reportId={reportId}
			privateKey={privateKey}
			details={details}
		/>
	) : (
		<TrackForm />
	);
}
