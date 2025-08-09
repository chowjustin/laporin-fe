import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import api from "@/lib/api";
import type { ApiError, ApiResponse } from "@/types/api";
import type { Report } from "@/types/entities/report";

export function useGetReportDetail(reportId: string) {
	const { data, isLoading, isError } = useQuery<
		ApiResponse<Report>,
		AxiosError<ApiError>
	>({
		queryKey: ["report", reportId],
		queryFn: async () => {
			const res = await api.get(`/reports/${reportId}`);
			return res.data;
		},
		enabled: !!reportId,
	});
	return {
		data,
		isLoading,
		isError,
	};
}
