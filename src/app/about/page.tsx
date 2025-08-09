"use client";

import HomepageLayout from "@/layouts/HomepageLayout";

export default function TentangKamiPage() {
	return (
		<main className="bg-[#CFEAF6] text-gray-900">
			<HomepageLayout withFooter withNavbar>
				{/* Hero / Title */}
				<section className="px-6 md:px-[20%] py-12 text-center">
					<h1 className="text-4xl md:text-5xl font-extrabold text-[#002D57] mb-4">
						Tentang Kami
					</h1>
					<p className="text-gray-700 max-w-3xl mx-auto">
						Membangun ekosistem pelaporan kekerasan yang aman, anonim, dan
						terpercaya di Indonesia.
					</p>
				</section>

				{/* Content */}
				<section className="bg-white px-6 py-12 md:px-[20%]">
					<div className="max-w-5xl mx-auto space-y-6 text-justify text-gray-800 leading-relaxed">
						<p>
							Kekerasan, terutama kekerasan dalam rumah tangga (KDRT), kekerasan
							terhadap perempuan, dan perundungan anak, merupakan masalah serius
							dan persisten di Indonesia. Menurut data Dashboard Perlindungan
							Perempuan dan Anak Kementerian Pemberdayaan Perempuan dan
							Perlindungan Anak (KemenPPPA), sepanjang tahun 2024 tercatat{" "}
							<strong>28.831 kasus kekerasan terhadap anak</strong>, yang
							mayoritas dialami oleh anak perempuan. Hingga pertengahan tahun
							2025, telah terjadi lebih dari 15.000 kasus kekerasan, dengan
							lebih dari 13.000 korban perempuan dan 3.000 korban laki-laki [1].
						</p>
						<p>
							Di sisi lain, Catatan Tahunan Komnas Perempuan (CATAHU) 2024
							mencatat{" "}
							<strong>445.502 kasus kekerasan terhadap perempuan</strong>, naik
							dari 401.975 kasus pada tahun sebelumnya, yang sebagian besar
							terjadi dalam ranah personal seperti rumah tangga [2].
						</p>
						<p>
							Di balik tingginya angka kekerasan yang tercatat secara resmi,
							terdapat populasi korban yang jauh lebih besar dan tidak
							terjangkau oleh sistem pendataan konvensional. Komnas Perempuan
							menggarisbawahi bahwa data yang ada merupakan fenomena gunung es
							[3]. Mayoritas korban terpaksa bungkam karena hambatan seperti
							stigma sosial, rasa takut terhadap ancaman, dan trauma psikologis
							[4].
						</p>
						<p>
							Hambatan tersebut diperparah oleh kelemahan sistem pelaporan
							konvensional, yaitu ketiadaan jaminan anonimitas yang memadai.
							Dalam praktiknya, hak korban atas kerahasiaan identitas seringkali
							belum terimplementasi dengan baik [5].
						</p>
						<p>
							Untuk menjawab tantangan tersebut, kami menghadirkan platform web{" "}
							<strong>“LAPORIN”</strong> sebagai jembatan aman antara korban
							kekerasan dengan lembaga bantuan, mengatasi dua masalah utama:
							anonimitas dan integritas data. Laporan dienkripsi end-to-end dan
							dicatat di blockchain, sehingga aman, transparan, dan tidak dapat
							dimanipulasi. Mekanisme AI akan menganalisis dan meneruskan
							laporan ke lembaga yang relevan secara efisien.
						</p>
						<p>
							<strong>LAPORIN</strong> dikembangkan oleh Komdigi (Kementerian
							Komunikasi dan Digital) sebagai mitra teknologi, menyediakan
							infrastruktur dan pengelolaan teknis untuk memastikan
							keberlangsungan sistem. Proses koordinasi antara korban dan
							lembaga pendamping dilakukan dengan aman dan tetap berada di bawah
							kendali korban.
						</p>
						<p>
							Dengan pendekatan ini, <strong>“LAPORIN”</strong> tidak hanya
							menyelesaikan masalah pelaporan, tetapi juga membangun ekosistem
							digital berorientasi korban, sejalan dengan tujuan SDGs poin 5
							(Kesetaraan Gender) dan 16 (Keadilan dan Kelembagaan yang Tangguh)
							[6].
						</p>
					</div>
				</section>
			</HomepageLayout>
		</main>
	);
}
