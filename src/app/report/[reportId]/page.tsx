// src/app/report/[reportId]/page.tsx
"use client";

import { useParams } from "next/navigation";
import ChatClient from "@/components/chat/ChatClient";
import Layout from "@/layouts/Layout";
import { useEffect, useState } from "react";

export default function UserReportPage() {
  const params = useParams();
  const reportId = params.reportId as string;

  // In a real app, you would retrieve the seed phrase securely after the user logs in.
  // For demonstration, we'll use localStorage.
  const [seedPhrase, setSeedPhrase] = useState<string | null>(null);

  useEffect(() => {
    // This simulates fetching the seed phrase after the component mounts on the client.
    const storedSeed = localStorage.getItem(`seedPhrase_${reportId}`);
    if (storedSeed) {
      setSeedPhrase(storedSeed);
    } else {
      // Handle case where seed phrase is not found (e.g., redirect to login)
      console.error("Seed phrase not found for this report.");
    }
  }, [reportId]);

  return (
    <Layout withNavbar withFooter>
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        {seedPhrase ? (
          <ChatClient reportId={reportId} role="user" seedPhrase={seedPhrase} />
        ) : (
          <p>Loading or requires login...</p>
        )}
      </div>
    </Layout>
  );
}
