import { createSelectorHooks } from "auto-zustand-selectors-hook";
import { create } from "zustand";

type ReportState = {
	reportId: string | null;
	seedPhrase: string | null;
	setReportData: (reportId: string, seedPhrase: string) => void;
	clearReportData: () => void;
};

const useReportStoreBase = create<ReportState>((set) => ({
	reportId: null,
	seedPhrase: null,
	setReportData: (reportId, seedPhrase) => set({ reportId, seedPhrase }),
	clearReportData: () => set({ reportId: null, seedPhrase: null }),
}));

export const useReportStore = createSelectorHooks(useReportStoreBase);
