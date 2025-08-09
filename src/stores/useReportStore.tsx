import { createSelectorHooks } from "auto-zustand-selectors-hook";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type ReportState = {
	reportId: string | null;
	seedPhrase: string | null;
	publicKey: string | null;
	privateKey: string | null;
	details: string | null;
	setReportData: (
		reportId: string,
		seedPhrase: string,
		publicKey: string,
		privateKey: string,
		details: string,
	) => void;
	clearReportData: () => void;
};

const useReportStoreBase = create(
	persist<ReportState>(
		(set) => ({
			reportId: null,
			seedPhrase: null,
			publicKey: null,
			privateKey: null,
			details: null,
			setReportData: (
				reportId: string,
				seedPhrase: string,
				publicKey: string,
				privateKey: string,
				details: string,
			) => set({ reportId, seedPhrase, publicKey, privateKey, details }),
			clearReportData: () =>
				set({
					reportId: null,
					seedPhrase: null,
					publicKey: null,
					privateKey: null,
					details: null,
				}),
		}),
		{
			name: "report-store",
			storage: createJSONStorage(() => sessionStorage),
		},
	),
);

export const useReportStore = createSelectorHooks(useReportStoreBase);
