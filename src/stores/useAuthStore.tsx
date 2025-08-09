import { createSelectorHooks } from "auto-zustand-selectors-hook";
import { produce } from "immer";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { removeToken, setToken } from "@/lib/cookies";
import type { User, WithToken } from "@/types/entities/user";

type AuthStoreType = {
	user: User | null;
	isAuthed: boolean;
	isLoading: boolean;
	login: (user: User & WithToken) => void;
	logout: () => void;
	stopLoading: () => void;
};

const useAuthStoreBase = create<AuthStoreType>()(
	persist(
		(set) => ({
			user: null,
			isAuthed: false,
			isLoading: true,
			login: (user) => {
				setToken(user.token);
				set(
					produce<AuthStoreType>((state) => {
						state.isAuthed = true;
						state.user = user;
					}),
				);
			},
			logout: () => {
				removeToken();
				set(
					produce<AuthStoreType>((state) => {
						state.isAuthed = false;
						state.user = null;
					}),
				);
			},
			stopLoading: () => {
				set(
					produce<AuthStoreType>((state) => {
						state.isLoading = false;
					}),
				);
			},
		}),
		{
			name: "auth-store",
			storage: createJSONStorage(() => sessionStorage),
			partialize: (state) => ({
				user: state.user,
				isAuthed: state.isAuthed,
			}),
		},
	),
);

const useAuthStore = createSelectorHooks(useAuthStoreBase);

export default useAuthStore;
