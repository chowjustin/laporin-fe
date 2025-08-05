// src/app/report/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import Layout from "@/layouts/Layout";
import Button from "@/components/button/Button";
import Input from "@/components/form/Input";
import toast from "react-hot-toast";
import * as bip39 from "bip39";

type LoginForm = {
  reportId: string;
  seedPhrase: string;
};

export default function ReportLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const methods = useForm<LoginForm>({
    defaultValues: {
      reportId: searchParams.get("reportId") || "",
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = (data: LoginForm) => {
    setIsLoading(true);
    // Validate the seed phrase format
    if (!bip39.validateMnemonic(data.seedPhrase)) {
      toast.error("Invalid seed phrase. Please check and try again.");
      setIsLoading(false);
      return;
    }

    // If valid, store it and redirect to the chat page
    localStorage.setItem(`seedPhrase_${data.reportId}`, data.seedPhrase);
    router.push(`/report/${data.reportId}`);
  };

  return (
    <Layout withNavbar withFooter>
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg"
          >
            <h1 className="text-2xl font-bold mb-6">Access Your Report</h1>
            <p className="mb-4 text-sm text-gray-600">
              Enter your Report ID and the secret seed phrase you saved to
              access the encrypted chat.
            </p>
            <div className="space-y-4">
              <Input
                id="reportId"
                label="Report ID"
                placeholder="Enter the Report ID"
                validation={{ required: "Report ID is required." }}
              />
              <Input
                id="seedPhrase"
                label="Secret Seed Phrase"
                placeholder="Enter your 12-word seed phrase"
                validation={{ required: "Seed phrase is required." }}
              />
            </div>
            <Button type="submit" isLoading={isLoading} className="mt-6 w-full">
              Access Chat
            </Button>
          </form>
        </FormProvider>
      </div>
    </Layout>
  );
}
