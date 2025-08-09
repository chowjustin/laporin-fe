"use client";

import Image from "next/image";
import Link from "next/link";
import HomepageLayout from "@/layouts/HomepageLayout";

export default function HomePage() {
	return (
		<main className="bg-[#CFEAF6] text-gray-900 ">
			<HomepageLayout withNavbar withFooter>
				{/* Hero Section */}
				<section className="py-12 md:py-20 max-md:px-6 md:flex md:items-center md:justify-between px-[20%]">
					<div className="max-w-xl">
						<p className="text-[#008FE0] font-medium">Kamu tidak sendiri.</p>
						<h1 className="mt-2 text-4xl md:text-5xl font-extrabold text-[#002D57] leading-tight">
							Laporkan Kekerasan <br /> dengan Aman dan Anonim
						</h1>
						<div className="mt-6 flex gap-4 max-md:flex-col max-md:text-center">
							<Link
								href="/report/form"
								className="rounded-full border border-[#002D57] px-5 py-2 font-medium text-[#002D57]"
								type="button"
							>
								Buat Laporan
							</Link>
							<Link
								href="/report/track"
								className="rounded-full bg-[#008FE0] px-5 py-2 font-medium text-white"
								type="button"
							>
								Track Laporan
							</Link>
						</div>
					</div>
					<div className="mt-10 md:mt-0">
						<Image
							src="/images/home.png"
							alt="Hero Illustration"
							width={500}
							height={500}
						/>
					</div>
				</section>

				{/* Feature Section */}
				<section className="bg-white py-16 px-[20%] max-md:px-6 text-center grid grid-cols-1 md:grid-cols-3 gap-8">
					<div>
						<Image
							src="/images/fitur1.png"
							alt="Sepenuhnya Anonim"
							width={40}
							height={40}
							className="mx-auto mb-4"
						/>
						<h3 className="font-semibold mb-2">Sepenuhnya Anonim</h3>
						<p className="text-sm text-gray-600">
							Laporkan kasus Anda tanpa memberikan data pribadi. Identitas Anda
							dilindungi sepenuhnya secara kriptografis.
						</p>
					</div>
					<div>
						<Image
							src="/images/fitur2.png"
							alt="Data Terjamin & Terpercaya"
							width={40}
							height={40}
							className="mx-auto mb-4"
						/>
						<h3 className="font-semibold mb-2">Data Terjamin & Terpercaya</h3>
						<p className="text-sm text-gray-600">
							Setiap laporan dicatat di sistem blockchain yang memastikan data
							tidak dapat diubah.
						</p>
					</div>
					<div>
						<Image
							src="/images/fitur3.png"
							alt="Respons Cepat & Tepat Sasaran"
							width={40}
							height={40}
							className="mx-auto mb-4"
						/>
						<h3 className="font-semibold mb-2">
							Respons Cepat & Tepat Sasaran
						</h3>
						<p className="text-sm text-gray-600">
							Sistem AI akan menganalisis dan meneruskan laporan Anda ke lembaga
							yang tepat.
						</p>
					</div>
				</section>

				{/* Video Section */}
				<section className="bg-white px-[20%] py-10 max-md:px-6 max-md:pt-0">
					<div className="rounded-xl overflow-hidden shadow-xl max-w-5xl mx-auto aspect-video">
						<iframe
							src="https://www.youtube.com/embed/YUbzTrbaAXM"
							title="YouTube video"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
							allowFullScreen
							className="w-full h-full"
						></iframe>
					</div>
				</section>
			</HomepageLayout>
		</main>
	);
}
