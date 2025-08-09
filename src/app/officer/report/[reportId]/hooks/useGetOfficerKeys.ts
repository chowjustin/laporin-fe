import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export function useGetOfficerKeys() {
	const { data, isLoading, isError } = useQuery({
		queryKey: ["officer-keys"],
		queryFn: async () => {
			const res = await api.get("/reports/officer-keys");
			return res.data;
		},
	});

	return {
		privateKey: data?.data?.private_key,
		publicKey: data?.data?.public_key,
		isLoading,
		isError,
	};
}
