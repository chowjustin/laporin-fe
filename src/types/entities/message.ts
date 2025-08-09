import type { Report } from "./report";

export type Message = {
	id: string;
	report_id: string;
	sender: "OFFICER" | "CLIENT";
	content: string;
	created_at: string;
	report: Report;
};
