import { Montserrat, Poppins } from "next/font/google";
import type * as React from "react";
import clsxm from "@/lib/clsxm";

const poppins = Poppins({
	subsets: ["latin"],
	weight: ["200", "300", "400", "500", "600", "700", "800"],
	style: ["normal", "italic"],
	variable: "--font-poppins",
});
const montserrat = Montserrat({
	subsets: ["latin"],
	weight: ["200", "300", "400", "500", "600", "700", "800"],
	variable: "--font-montserrat",
});

enum FontVariant {
	Inter,
	Poppins,
	Montserrat,
}

enum FontWeight {
	thin,
	extralight,
	light,
	regular,
	medium,
	semibold,
	bold,
	extrabold,
	black,
}

const TypographyVariant = [
	"j1",
	"j2",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"s1",
	"s2",
	"s3",
	"s4",
	"b1",
	"b2",
	"b3",
	"c1",
	"c2",
	"l1",
	"l2",
] as const;

type TypographyProps<T extends React.ElementType> = {
	as?: T;
	className?: string;
	weight?: keyof typeof FontWeight;
	font?: keyof typeof FontVariant;
	children: React.ReactNode;
	/**
	 * | Variant | Size Class | Font Size | Font Weight |
	 * | :------ | :--------- | :-------- | :---------- |
	 * | j1      | text-4xl   | 36px      | 700         |
	 * | j2      | text-3xl   | 30px      | 700         |
	 * | h1      | text-2xl   | 24px      | 600         |
	 * | h2      | text-xl    | 20px      | 600         |
	 * | h3      | text-lg    | 18px      | 600         |
	 * | h4      | text-base  | 16px      | 700         |
	 * | h5      | text-base  | 16px      | 600         |
	 * | h6      | text-sm    | 14px      | 600         |
	 * | s1      | text-lg    | 18px      | 500         |
	 * | s2      | text-base  | 16px      | 500         |
	 * | s3      | text-sm    | 14px      | 500         |
	 * | s4      | text-xs    | 12px      | 500         |
	 * | b1      | text-lg    | 18px      | 400         |
	 * | b2      | text-base  | 16px      | 400         |
	 * | b3      | text-sm    | 14px      | 400         |
	 * | c1      | text-xs    | 12px      | 400         |
	 * | c2      | -          | 11px      | 400         |
	 */
	variant?: (typeof TypographyVariant)[number];
};

export default function Typography<T extends React.ElementType>({
	as,
	children,
	weight = "regular",
	className,
	font = "Inter",
	variant = "b2",
	...props
}: TypographyProps<T> &
	Omit<React.ComponentProps<T>, keyof TypographyProps<T>>) {
	const Component = as || "p";
	return (
		<Component
			className={clsxm(
				// *=============== Font Type ==================
				"text-black",
				//#region  //*=========== Variants ===========
				[
					variant === "j1" && ["text-4xl font-bold"],
					variant === "j2" && ["text-3xl font-bold"],
					variant === "h1" && ["text-2xl font-semibold"],
					variant === "h2" && ["text-xl font-semibold"],
					variant === "h3" && ["text-lg font-semibold"],
					variant === "h4" && ["text-base font-bold"],
					variant === "h5" && ["text-base font-semibold"],
					variant === "h6" && ["text-sm font-semibold"],
					variant === "s1" && ["text-lg font-medium"],
					variant === "s2" && ["text-base font-medium"],
					variant === "s3" && ["text-sm font-medium"],
					variant === "s4" && ["text-xs font-medium"],
					variant === "b1" && ["text-lg"],
					variant === "b2" && ["text-base"],
					variant === "b3" && ["text-sm font-normal"],
					variant === "c1" && ["text-xs"],
					variant === "c2" && ["text-[11px] leading-[14px]"],
				],
				//#endregion  //*======== Variants ===========
				[
					font === "Inter" && [
						"font-inter",
						[
							weight === "regular" && "font-normal",
							weight === "medium" && "font-medium",
							weight === "semibold" && "font-semibold",
							weight === "bold" && "font-bold",
						],
					],
				],
				[
					font === "Poppins" && [
						`${poppins.className}`,
						[
							weight === "extralight" && "font-extralight",
							weight === "light" && "font-light",
							weight === "medium" && "font-medium",
							weight === "semibold" && "font-semibold",
							weight === "bold" && "font-bold",
							weight === "extrabold" && "font-extrabold",
						],
					],
				],
				[
					font === "Montserrat" && [
						`${montserrat.className}`,
						[
							weight === "extralight" && "font-extralight",
							weight === "light" && "font-light",
							weight === "medium" && "font-medium",
							weight === "semibold" && "font-semibold",
							weight === "bold" && "font-bold",
							weight === "extrabold" && "font-extrabold",
						],
					],
				],
				className,
			)}
			{...props}
		>
			{children}
		</Component>
	);
}
