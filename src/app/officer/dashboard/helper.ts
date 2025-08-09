const INSTANCE_TYPE_LABEL: Record<string, string> = {
	POLRI_PPA: "Unit PPA Polri",
	UPTD_PPA: "UPTD PPA dan P2TP2A",
	KOMNAS_PEREMPUAN: "Komisi Nasional Anti Kekerasan terhadap Perempuan",
	KPAI: "Komisi Perlindungan Anak Indonesia",
	LBH_OMS: "Lembaga Bantuan Hukum & Organisasi Masyarakat Sipil",
};

export function getInstanceTypeLabel(instance: string) {
	if (!instance) return undefined;
	return INSTANCE_TYPE_LABEL[instance] || "";
}

const CATEGORY_LABEL: Record<string, string> = {
	KEKERASAN_DALAM_RUMAH_TANGGA: "Kekerasan Dalam Rumah Tangga",
	KEKERASAN_SEKSUAL: "Kekerasan Seksual",
	KEKERASAN_PADA_ANAK: "Kekerasan Pada Anak",
	PERDAGANGAN_ORANG: "Perdagangan Orang",
	SIBER_KEKERASAN_BERBASIS_GENDER: "Siber Kekerasan Berbasis Gender",
	KEKERASAN_LAINNYA: "Kekerasan Lainnya",
};

export function getCategoryLabel(category: string) {
	if (!category) return undefined;
	return CATEGORY_LABEL[category];
}
