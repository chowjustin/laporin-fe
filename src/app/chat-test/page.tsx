import ChatClient from "@/components/chat/ChatClient";
import Layout from "@/layouts/Layout";

export default function ChatTestPage() {
	return (
		<Layout withNavbar={false} withFooter={false}>
			<div className="flex flex-col md:flex-row items-start justify-center min-h-screen bg-gray-200 gap-8 p-8">
				{/* User's Chat Window */}
				<div className="w-full md:w-1/2">
					<h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
						User View
					</h1>
					<ChatClient
						reportId={process.env.NEXT_PUBLIC_MOCK_REPORT_ID as string}
						userRole="CLIENT"
						myPrivateKey={
							process.env.NEXT_PUBLIC_MOCK_CLIENT_PRIVATE_KEY as string
						}
						theirPublicKey={
							process.env.NEXT_PUBLIC_OFFICER_PUBLIC_KEY as string
						}
					/>
				</div>

				{/* Officer's Chat Window */}
				<div className="w-full md:w-1/2">
					<h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
						Officer View
					</h1>
					<ChatClient
						reportId={process.env.NEXT_PUBLIC_MOCK_REPORT_ID as string}
						userRole="OFFICER"
						myPrivateKey={process.env.OFFICER_PRIVATE_KEY as string}
						theirPublicKey={
							process.env.NEXT_PUBLIC_MOCK_CLIENT_PUBLIC_KEY as string
						}
					/>
				</div>
			</div>
		</Layout>
	);
}
