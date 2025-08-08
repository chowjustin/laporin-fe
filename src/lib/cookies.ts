import Cookies from "universal-cookie";

const cookies = new Cookies();

export const getToken = (): string => cookies.get("laporin/token");

export const setToken = (token: string) => {
	cookies.set("laporin/token", token, { path: "/" });
};

export const removeToken = () => cookies.remove("laporin/token", { path: "/" });
