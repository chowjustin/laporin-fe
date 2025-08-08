import type { ReactNode } from "react";

import Typography from "@/components/Typography";
import clsxm from "@/lib/clsxm";

export default function LabelText({
	children,
	labelTextClasname,
	required,
}: {
	children: ReactNode;
	labelTextClasname?: string;
	required?: boolean;
}) {
	return (
		<Typography
			as="p"
			variant="h5"
			weight="semibold"
			className={clsxm("text-typo", labelTextClasname)}
		>
			{children} {required && <span className="text-red-500">*</span>}
		</Typography>
	);
}
