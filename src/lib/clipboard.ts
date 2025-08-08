import { toast } from "react-hot-toast";

export const copyToClipboard = async (text: string) => {
	try {
		await navigator.clipboard.writeText(text);
		toast.success("Berhasil disalin!");
	} catch {
		toast.error("Gagal menyalin, coba lagi.");
	}
};
