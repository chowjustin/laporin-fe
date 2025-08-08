"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { toast } from "react-hot-toast";
import Loading from "@/app/loading";
import api from "@/lib/api";
import { getToken, removeToken } from "@/lib/cookies";

import useAuthStore from "@/stores/useAuthStore";

import type { ApiResponse } from "@/types/api";
import type { User } from "@/types/entities/user";

const ROLE = ["OFFICER"] as const;

type Role = (typeof ROLE)[number];

export interface WithAuthProps {
	user: User;
}

const OFFICER_ROUTE = "/officer/dashboard";
const LOGIN_ROUTE = "/login";

export enum RouteRole {
	/**
   Dapat diakses hanya ketika user belum login (Umum)
   */
	public,
	/**
	 * Dapat diakses semuanya
	 */
	optional,
	/**
	 * For all authenticated officer
	 * will push to login if user is not authenticated
	 */
	officer,
}

export const isRole = (p: Role): p is Role => ROLE.includes(p as Role);

/**
 * Add role-based access control to a component
 *
 * @see https://react-typescript-cheatsheet.netlify.app/docs/hoc/full_example/
 * @see https://github.com/mxthevs/nextjs-auth/blob/main/src/components/withAuth.tsx
 */
export default function withAuth<T>(
	Component: React.ComponentType<T>,
	routeRole: keyof typeof RouteRole,
) {
	function ComponentWithAuth(props: T) {
		const router = useRouter();
		const params = useSearchParams();
		const redirect = params?.get("redirect");
		const pathName = usePathname();

		//#region  //*=========== STORE ===========
		const isAuthenticated = useAuthStore.useIsAuthed();
		const isLoading = useAuthStore.useIsLoading();
		const login = useAuthStore.useLogin();
		const logout = useAuthStore.useLogout();
		const stopLoading = useAuthStore.useStopLoading();
		const user = useAuthStore.useUser();
		//#endregion  //*======== STORE ===========

		const checkAuth = React.useCallback(() => {
			const token = getToken();
			if (!token) {
				isAuthenticated && logout();
				stopLoading();
				return;
			}
			const loadUser = async () => {
				try {
					const res = await api.get<ApiResponse<User>>("/auth/me");

					if (!res.data.data) {
						toast.error("Sesi login tidak valid");
						throw new Error("Sesi login tidak valid");
					}

					login({
						...res.data.data,
						token,
					});
				} catch (_err) {
					await removeToken();
				} finally {
					stopLoading();
				}
			};

			loadUser();
		}, [isAuthenticated, login, logout, stopLoading]);

		React.useEffect(() => {
			checkAuth();

			window.addEventListener("focus", checkAuth);
			return () => {
				window.removeEventListener("focus", checkAuth);
			};
		}, [checkAuth]);

		React.useEffect(() => {
			const Redirect = () => {
				if (isAuthenticated) {
					if (routeRole === "public") {
						if (redirect) {
							router.replace(redirect as string);
						} else if (user?.role === "OFFICER") {
							router.replace(OFFICER_ROUTE);
						} else {
							router.replace("/");
						}
					}
				} else if (routeRole !== "public") {
					router.replace(`${LOGIN_ROUTE}?redirect=${pathName}`);
				}
			};

			if (!isLoading) {
				Redirect();
			}
		}, [
			isAuthenticated,
			isLoading,
			pathName,
			redirect,
			router,
			user,
			routeRole,
		]);

		if (
			(isLoading || !isAuthenticated) &&
			routeRole !== "public" &&
			routeRole !== "optional"
		) {
			return <Loading />;
		}

		return <Component {...(props as T)} user={user} />;
	}

	return ComponentWithAuth;
}
