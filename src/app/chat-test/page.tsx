// src/app/chat-test/page.tsx
import ChatClient from "@/components/chat/ChatClient";
import Layout from "@/layouts/Layout";

export default function ChatTestPage() {
	// In a real scenario, the reportId would come from the URL params
	// and the seed phrase from a secure, client-side store.
	const mockReportId = "test-report-123";
	const mockSeedPhrase =
		"abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";

	return (
		<Layout withNavbar={false} withFooter={false}>
			<div className="flex flex-col md:flex-row items-start justify-center min-h-screen bg-gray-200 gap-8 p-8">
				{/* User's Chat Window */}
				<div className="w-full md:w-1/2">
					<h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
						User View
					</h1>
					<ChatClient
						reportId={mockReportId}
						roles="user"
						seedPhrase={mockSeedPhrase}
					/>
				</div>

				{/* Officer's Chat Window */}
				<div className="w-full md:w-1/2">
					<h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
						Officer View
					</h1>
					<ChatClient reportId={mockReportId} roles="officer" />
				</div>
			</div>
		</Layout>
	);
}
