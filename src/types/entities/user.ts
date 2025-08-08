export type User = {
	id: string;
	email: string;
	name: string;
	instance: "POLRI_PPA" | "UPTD_PPA" | "KOMNAS_PEREMPUAN" | "KPAI" | "LBH_OMS";
	role: "OFFICER";
};

export type WithToken = User & {
	token: string;
};
