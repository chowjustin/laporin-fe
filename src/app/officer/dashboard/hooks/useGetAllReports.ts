import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import api from "@/lib/api";
import type { ApiError, ApiResponse } from "@/types/api";
import type { Report } from "@/types/entities/report";

export function useGetAllReports() {
	const { data, isLoading } = useQuery<
		ApiResponse<Report[]>,
		AxiosError<ApiError>
	>({
		queryKey: ["reports"],
		queryFn: async () => {
			const res = await api.get("/reports");
			return res.data;
		},
	});

	return {
		data,
		isLoading,
	};
}
