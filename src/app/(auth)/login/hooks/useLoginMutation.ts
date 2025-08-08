import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import api from "@/lib/api";
import { setToken } from "@/lib/cookies";

import useAuthStore from "@/stores/useAuthStore";

import type { ApiError, ApiResponse } from "@/types/api";
import type { User, WithToken } from "@/types/entities/user";
import type { LoginForm } from "../containers/LoginForm";

export const useLoginMutation = () => {
	const login = useAuthStore.useLogin();
	const router = useRouter();

	const { mutate, isPending } = useMutation<
		ApiResponse<WithToken>,
		AxiosError<ApiError>,
		LoginForm
	>({
		mutationFn: async (data: LoginForm) => {
			const res = await api.post<ApiResponse<WithToken>>("/auth/login", data);
			const { token } = res.data.data;
			setToken(token);

			const user = await api.get<ApiResponse<User>>("/auth/me");
			if (user) login({ ...user.data.data, token: token });
			return res.data;
		},
		onSuccess: () => {
			toast.success("Login successful!");
			router.push("/");
		},
		onError: (error) => {
			toast.error(error.response?.data.message || "Login failed!");
		},
	});

	return {
		mutate,
		isPending,
	};
};
