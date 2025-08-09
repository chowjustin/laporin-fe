"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import Button from "@/components/button/Button";
import ButtonLink from "@/components/links/ButtonLink";
import UnstyledLink from "@/components/links/UnstyledLink";
import NextImage from "@/components/NextImage";
import Typography from "@/components/Typography";
import useAuthStore from "@/stores/useAuthStore";

type NavLink = {
	href: string;
	label: string;
	onClick?: () => void;
};

export default function Navbar() {
	const [isOpen, setIsOpen] = useState(false);
	const pathname = usePathname();
	const user = useAuthStore.useUser();
	const logout = useAuthStore.useLogout();

	const isActive = (href: string) => pathname === href;

	const userNavLinks: NavLink[] = [
		{ href: "/report/form", label: "Buat Laporan" },
		{ href: "/report/track", label: "Track Laporan" },
	];

	const officerNavLinks: NavLink[] = [
		{ href: "/officer/dashboard", label: "Dashboard" },
		{
			href: "#",
			label: "Logout",
			onClick: () => logout(),
		},
	];
	const navLinks: NavLink[] = user ? officerNavLinks : userNavLinks;

	return (
		<nav className="bg-primary-50/60 shadow-md w-full sticky z-50 h-[64px] md:h-[80px]">
			<div className="px-4 sm:px-6 md:px-8 lg:px-[10%] mx-auto">
				<div className="flex items-center justify-between h-20 max-md:h-16">
					{/* Logo */}
					<UnstyledLink href={`/`} className="flex items-center gap-2">
						<NextImage
							src="/logo.png"
							alt="Laporin Logo"
							width={170}
							height={200}
							className="w-[35px] sm:w-[45px]"
						/>
						<Typography
							variant="h1"
							weight="bold"
							className=" text-primary-800 ml-2"
						>
							Laporin
						</Typography>
					</UnstyledLink>

					{/* Desktop Menu */}
					<div className="hidden md:flex items-center space-x-8">
						<div className="flex items-baseline space-x-4">
							{!user ? (
								<>
									<ButtonLink href="/report/form">Buat Laporan</ButtonLink>
									<ButtonLink href="/report/track" variant="outline">
										Track Laporan
									</ButtonLink>
								</>
							) : (
								<>
									<ButtonLink
										href="/officer/dashboard"
										variant="primary"
										className="bg-primary-700 hover:bg-primary-800"
									>
										Dashboard
									</ButtonLink>
									<Button onClick={() => logout()} variant="red">
										Logout
									</Button>
								</>
							)}
						</div>
					</div>

					{/* Mobile Menu */}
					<div className="md:hidden">
						{/* Mobile Menu Button */}
						<button
							type="button"
							onClick={() => setIsOpen(!isOpen)}
							className="inline-flex items-center cursor-pointer justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-colors duration-200"
							aria-expanded={isOpen}
							aria-label="Toggle navigation menu"
						>
							<span className="sr-only">Open main menu</span>
							{isOpen ? (
								<svg
									className="h-6 w-6"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									aria-hidden="true"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							) : (
								<svg
									className="h-6 w-6"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									aria-hidden="true"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M4 6h16M4 12h16M4 18h16"
									/>
								</svg>
							)}
						</button>

						{/* Mobile Menu Dropdown */}
						<div
							className={`absolute top-full left-0 right-0 md:hidden transition-all duration-500 ease-in-out ${
								isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
							} overflow-hidden bg-white border-t border-primary-200 shadow-lg z-50`}
						>
							<div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
								{navLinks.map((link: NavLink) =>
									link.onClick ? (
										<Button
											key={link.href}
											variant="red"
											className={`block w-full px-3 py-2 rounded-md text-base font-medium transition-colors duration-300`}
											onClick={() => {
												link.onClick?.();
												setIsOpen(false);
											}}
										>
											{link.label}
										</Button>
									) : (
										<UnstyledLink
											key={link.href}
											href={link.href}
											className={`block px-3 py-2 text-center rounded-md text-base font-medium transition-colors duration-300 ${
												isActive(link.href)
													? "bg-primary-700 text-white"
													: "text-gray-400 hover:bg-primary-400/50 hover:text-typo"
											}`}
											onClick={() => setIsOpen(false)}
										>
											{link.label}
										</UnstyledLink>
									),
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</nav>
	);
}
