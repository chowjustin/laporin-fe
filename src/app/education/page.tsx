"use client";

import {
	Baby,
	Brain,
	Building,
	Gavel,
	Lock,
	Scale,
	Share2,
	Shield,
	Users,
} from "lucide-react";
import HomepageLayout from "@/layouts/HomepageLayout";

export default function EdukasiPage() {
	const steps = [
		{
			icon: <Lock className="w-10 h-10 text-[#008FE0]" />,
			title: "Laporan Dibuat Secara Anonim",
			description:
				"Korban atau pelapor membuat laporan melalui LAPORIN. Semua data terenkripsi end-to-end sehingga hanya korban yang punya kendali penuh atas informasinya.",
		},
		{
			icon: <Brain className="w-10 h-10 text-[#008FE0]" />,
			title: "AI Mengklasifikasikan Laporan",
			description:
				"Sistem AI LAPORIN menganalisis isi laporan untuk menentukan kategori kasus, urgensi, dan lembaga yang paling relevan untuk menanganinya.",
		},
		{
			icon: <Share2 className="w-10 h-10 text-[#008FE0]" />,
			title: "Diteruskan ke Lembaga Tepat",
			description:
				"Berdasarkan hasil klasifikasi AI, laporan diteruskan secara otomatis ke lembaga terkait sesuai kategori kasus.",
		},
		{
			icon: <Shield className="w-10 h-10 text-[#008FE0]" />,
			title: "Proses Aman & Terkendali",
			description:
				"Seluruh komunikasi dan koordinasi dengan lembaga pendamping dilakukan melalui sistem LAPORIN yang menjaga privasi korban.",
		},
	];

	const instances = [
		{
			name: "POLRI_PPA",
			icon: <Gavel className="w-8 h-8 text-[#002D57]" />,
			description: "Unit PPA Polri untuk kasus pidana dan penindakan hukum.",
		},
		{
			name: "UPTD_PPA",
			icon: <Building className="w-8 h-8 text-[#002D57]" />,
			description:
				"UPTD PPA atau P2TP2A untuk layanan korban seperti konseling, rumah aman, dan pendampingan.",
		},
		{
			name: "KOMNAS_PEREMPUAN",
			icon: <Users className="w-8 h-8 text-[#002D57]" />,
			description:
				"Komisi Nasional Anti Kekerasan terhadap Perempuan untuk advokasi kebijakan dan isu sistemik.",
		},
		{
			name: "KPAI",
			icon: <Baby className="w-8 h-8 text-[#002D57]" />,
			description:
				"Komisi Perlindungan Anak Indonesia untuk perlindungan hak dan keselamatan anak.",
		},
		{
			name: "LBH_OMS",
			icon: <Scale className="w-8 h-8 text-[#002D57]" />,
			description:
				"Lembaga Bantuan Hukum & Organisasi Masyarakat Sipil untuk bantuan hukum gratis dan pendampingan dari NGO.",
		},
	];

	return (
		<main className="bg-[#CFEAF6] text-gray-900">
			<HomepageLayout withFooter withNavbar>
				{/* Hero */}
				<section className="px-6 py-12 text-center md:px-[20%]">
					<h1 className="text-4xl md:text-5xl font-extrabold text-[#002D57] mb-4">
						Bagaimana Kami Bekerja
					</h1>
					<p className="text-gray-700 max-w-3xl mx-auto">
						LAPORIN memanfaatkan AI dan blockchain untuk memastikan setiap
						laporan kekerasan ditangani oleh pihak yang tepat, dengan cepat,
						aman, dan anonim.
					</p>
				</section>

				{/* Steps */}
				<section className="bg-white px-6 py-12 md:px-[20%]">
					<h2 className="text-2xl font-bold text-[#002D57] text-center mb-8">
						Urutan Proses Pelaporan
					</h2>
					<div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-6">
						{steps.map((step, i) => (
							<div
								key={i}
								className="bg-[#F5FBFF] rounded-xl p-6 shadow hover:shadow-lg transition-shadow duration-200 text-center"
							>
								<div className="flex justify-center mb-4">{step.icon}</div>
								<h3 className="font-bold text-lg mb-2 text-[#002D57]">
									{step.title}
								</h3>
								<p className="text-sm text-gray-700">{step.description}</p>
							</div>
						))}
					</div>
				</section>

				{/* Instances */}
				<section className="px-6 py-12 md:px-[20%] bg-white">
					<div className="max-w-6xl mx-auto">
						<h2 className="text-2xl font-bold text-[#002D57] text-center mb-8">
							Lembaga Tujuan Laporan
						</h2>
						<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
							{instances.map((inst, i) => (
								<div
									key={i}
									className="bg-[#F5FBFF] rounded-xl p-6 shadow hover:shadow-lg hover:scale-[1.02] transition-transform duration-200"
								>
									<div className="flex items-center gap-3 mb-3">
										{inst.icon}
										<h3 className="font-semibold text-[#002D57]">
											{inst.name}
										</h3>
									</div>
									<p className="text-sm text-gray-700">{inst.description}</p>
								</div>
							))}
						</div>
					</div>
				</section>
			</HomepageLayout>
		</main>
	);
}
