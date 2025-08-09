import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface HomepageLayoutProps {
	children: React.ReactNode;
	withFooter?: boolean;
	withNavbar?: boolean;
	className?: string;
}

export default function HomepageHomepageLayout({
	children,
	withFooter,
	withNavbar,
	className,
}: HomepageLayoutProps) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			{withNavbar && (
				<header className="relative flex items-center justify-between py-4 px-6 md:px-[10%] lg:px-[20%] shadow-sm">
					{/* Logo */}
					<Link href="/" className="flex items-center gap-2">
						<Image
							src="/images/logo.png"
							alt="Laporin Logo"
							width={32}
							height={32}
						/>
						<span className="font-bold text-lg">Laporin</span>
					</Link>

					{/* Desktop nav */}
					<nav className="hidden md:flex items-center gap-6 text-sm text-gray-700">
						<Link
							href="/about"
							className="hover:font-medium duration-300 transition-all"
						>
							Tentang Kami
						</Link>
						<Link
							href="/education"
							className="hover:font-medium duration-300 transition-all"
						>
							Edukasi
						</Link>
					</nav>

					{/* Action buttons - desktop */}
					<div className="hidden md:flex items-center gap-2">
						<Link
							href="/report/form"
							className="rounded-full border border-[#002D57] px-4 py-2 text-sm font-medium text-[#002D57]"
							type="button"
						>
							Buat Laporan
						</Link>
						<Link
							href="/report/track"
							className="rounded-full bg-[#008FE0] px-4 py-2 text-sm font-medium text-white"
							type="button"
						>
							Track Laporan
						</Link>
					</div>

					{/* Hamburger - mobile */}
					<div className="md:hidden">
						<button
							type="button"
							onClick={() => setIsOpen(!isOpen)}
							className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300"
						>
							{isOpen ? <X size={24} /> : <Menu size={24} />}
						</button>
					</div>

					{/* Mobile menu dropdown */}
					<div
						className={`absolute top-full left-0 w-full bg-white border-t shadow-md md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
							isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
						}`}
					>
						<nav className="flex flex-col p-4 gap-3 text-sm text-gray-700">
							<Link
								href="/about"
								className="hover:font-medium transition-all"
								onClick={() => setIsOpen(false)}
							>
								Tentang Kami
							</Link>
							<Link
								href="/education"
								className="hover:font-medium transition-all"
								onClick={() => setIsOpen(false)}
							>
								Edukasi
							</Link>
							<hr />
							<Link
								href="/report/form"
								className="rounded-full border border-[#002D57] px-4 py-2 text-sm font-medium text-[#002D57] text-center"
								onClick={() => setIsOpen(false)}
							>
								Buat Laporan
							</Link>
							<Link
								href="/report/track"
								className="rounded-full bg-[#008FE0] px-4 py-2 text-sm font-medium text-white text-center"
								onClick={() => setIsOpen(false)}
							>
								Track Laporan
							</Link>
						</nav>
					</div>
				</header>
			)}

			<main className={className}>{children}</main>

			{withFooter && (
				<footer className="bg-white border-t px-6 md:px-[10%] lg:px-[20%] py-10 text-sm">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div>
							<h4 className="font-semibold mb-2">Cari Tahu</h4>
							<ul className="space-y-1 text-gray-600">
								<li>
									<Link href="/about">Tentang Kami</Link>
								</li>
								<li>
									<Link href="/contact">Kontak</Link>
								</li>
								<li>
									<Link href="#">Kebijakan</Link>
								</li>
								<li>
									<Link href="#">Privasi</Link>
								</li>
							</ul>
						</div>
						<div>
							<h4 className="font-semibold mb-2">Edukasi</h4>
							<ul className="space-y-1 text-gray-600">
								<li>
									<Link href="/education">Cara Kerja</Link>
								</li>
								<li>
									<Link href="/education">Lembaga</Link>
								</li>
							</ul>
						</div>
						<div>
							<h4 className="font-semibold mb-2">Hubungi Kami</h4>
							<p className="text-gray-600 mb-2">
								LAPORIN adalah sebuah website pelaporan kekerasan anonim
								berbasis kriptografi, AI, dan blockchain.
							</p>
						</div>
					</div>
					<div className="mt-8 text-center text-gray-400">© 2025 LAPORIN.</div>
				</footer>
			)}
		</>
	);
}
