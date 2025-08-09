"use client";

import { useEffect, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Button from "@/components/button/Button";
import Input from "@/components/form/Input";
import Typography from "@/components/Typography";
import { useChat } from "@/hooks/useChat";
import clsxm from "@/lib/clsxm";
import { ScrollArea } from "../ScrollArea";

type ChatClientProps = {
	reportId: string;
	userRole: "OFFICER" | "CLIENT";
	myPrivateKey: string;
	theirPublicKey: string;
};

type ChatForm = {
	message: string;
};

export default function ChatClient({
	reportId,
	userRole,
	myPrivateKey,
	theirPublicKey,
}: ChatClientProps) {
	const { messages, sendMessage, sendTyping, isTyping } = useChat({
		reportId,
		userRole,
		myPrivateKey,
		theirPublicKey,
	});

	const methods = useForm<ChatForm>({
		defaultValues: { message: "" },
	});

	const { handleSubmit, reset, watch } = methods;
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const messageValue = watch("message");
	useEffect(() => {
		if (messageValue.trim()) {
			sendTyping(true);
			const timeout = setTimeout(() => sendTyping(false), 1000);
			return () => clearTimeout(timeout);
		}
	}, [messageValue, sendTyping]);

	const onSubmit = (data: ChatForm) => {
		if (!data.message.trim()) return;
		sendMessage(data.message.trim());
		reset();
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: keeping isTyping for scroll behavior
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages, isTyping]);

	return (
		<div className="flex flex-col w-full bg-primary-50/50 h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] shadow-lg rounded-lg">
			<div className="px-4 py-3 border-b border-gray-200 bg-white">
				<Typography variant="h4" font="Poppins">
					Chat
				</Typography>
				{/* <Typography
					variant="s3"
					className={clsxm(
						presence === "online" ? "text-green-500" : "text-red-500"
					)}
				>
					Status {userRole === "OFFICER" ? "Pelapor" : "Petugas"}:{" "}
					{presence === "online" ? "Online" : "Offline"}
				</Typography> */}
			</div>

			{/* Messages */}
			<ScrollArea className="flex-1 h-[200px]">
				<div className=" p-4 space-y-3 bg-primary-50/50 ">
					{messages.map((msg) => (
						<div
							key={msg.id}
							className={`flex ${
								msg.sender === userRole ? "justify-end" : "justify-start"
							}`}
						>
							<div
								className={clsxm(
									"max-w-[75%] px-4 py-2 rounded-lg shadow-sm",
									msg.sender === userRole
										? "bg-primary-500"
										: "bg-white border border-gray-200",
								)}
							>
								<Typography
									variant="b3"
									className={clsxm(
										"break-words",
										msg.sender === userRole ? "text-white" : "text-typo",
									)}
									weight="medium"
								>
									{msg.content}
								</Typography>
							</div>
						</div>
					))}
				</div>
				{isTyping && (
					<Typography variant="c1" className="text-gray-500 italic">
						Typing...
					</Typography>
				)}
				<div ref={messagesEndRef} />
			</ScrollArea>

			{/* Input */}
			<FormProvider {...methods}>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="p-4 border-t border-gray-200 flex gap-2 bg-white"
				>
					<Input
						id="message"
						placeholder="Ketik pesan..."
						validation={{ required: "Pesan tidak boleh kosong" }}
						className="flex-1"
						hideError
					/>
					<Button type="submit">Kirim</Button>
				</form>
			</FormProvider>
		</div>
	);
}
