import { ArrowLeft } from "lucide-react";
import ChatClient from "@/components/chat/ChatClient";
import ButtonLink from "@/components/links/ButtonLink";
import Typography from "@/components/Typography";
import Layout from "@/layouts/Layout";

export type ClientChatPageProps = {
	reportId: string;
	privateKey: string;
	details: string;
};

export default function ClientChatPage({
	reportId,
	privateKey,
	details,
}: ClientChatPageProps) {
	return (
		<Layout withNavbar>
			<div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)] md:min-h-[calc(100vh-80px)] shadow-lg rounded-lg">
				<div className="p-8 md:pr-12 flex flex-col gap-6 md:w-2/5 md:flex-none">
					<ButtonLink
						href="/"
						variant="ghost"
						className="w-fit text-left text-primary-800 p-1"
						leftIcon={ArrowLeft}
						size="base"
					>
						Kembali ke Beranda
					</ButtonLink>
					<Typography variant="h2" weight="bold" className="text-typo">
						Laporan <span className="text-primary-500">#{reportId}</span>
					</Typography>
					{/* Ringkasan */}
					<section>
						<Typography
							variant="h4"
							font="Poppins"
							weight="semibold"
							className="mb-2"
						>
							Detail Laporan
						</Typography>
						<Typography variant="b2" className="text-justify">
							{details}
						</Typography>
					</section>
				</div>
				{/* Chat Client */}

				<div className="flex-1 w-full bg-primary-50/50">
					<ChatClient
						reportId={reportId}
						userRole="CLIENT"
						myPrivateKey={privateKey}
						theirPublicKey={
							process.env.NEXT_PUBLIC_OFFICER_PUBLIC_KEY as string
						}
					/>
				</div>
			</div>
		</Layout>
	);
}
