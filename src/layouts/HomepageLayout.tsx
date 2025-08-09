import Image from "next/image";
import Link from "next/link";

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
	return (
		<>
			{withNavbar && (
				<header className="flex items-center justify-between py-4 px-[20%] max-md:px-6 shadow-sm">
					<Link href="/" className="flex items-center gap-2">
						<Image
							src="/images/logo.png"
							alt="Laporin Logo"
							width={32}
							height={32}
						/>
						<span className="font-bold text-lg">Laporin</span>
					</Link>
					<nav className="hidden md:flex items-center gap-6 text-sm text-gray-700 ">
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
					<div className="flex items-center gap-2 max-md:hidden">
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
				</header>
			)}
			<main className={className}>{children}</main>
			{withFooter && (
				<footer className="bg-white border-t px-[20%] py-10 text-sm max-md:px-6">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mx-auto">
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
