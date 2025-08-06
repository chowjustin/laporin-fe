// chowjustin/laporin-fe/src/components/chat/ChatClient.tsx
"use client";

import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import useWebSocket, { ReadyState } from "react-use-websocket";
import Button from "@/components/button/Button";
import Input from "@/components/form/Input";
import clsxm from "@/lib/clsxm";
import {
	decryptMessage,
	encryptMessage,
	generateEncryptionKeyPair,
} from "@/lib/crypto";

// This is a hardcoded "master" seed phrase for the officer role.
const OFFICER_MASTER_SEED_PHRASE =
	"legal winner thank year wave sausage worth useful legal winner thank yellow";

interface Message {
	sender: "user" | "officer";
	content: string;
	timestamp: string;
}

interface KeyPair {
	privateKey: string;
	publicKey: string;
}

interface ChatClientProps {
	reportId: string;
	roles: "user" | "officer";
	seedPhrase?: string;
}

const WEBSOCKET_URL = "ws://localhost:5000";

export default function ChatClient({
	reportId,
	roles,
	seedPhrase,
}: ChatClientProps) {
	const [messages, setMessages] = useState<Message[]>([]);
	const [myKeys, setMyKeys] = useState<KeyPair | null>(null);
	const [theirPublicKey, setTheirPublicKey] = useState<string | null>(null);
	const [isTyping, setIsTyping] = useState(false);
	const [presence, setPresence] = useState("offline");
	const messageContainerRef = useRef<HTMLDivElement>(null);

	const methods = useForm<{ message: string }>();
	const { handleSubmit, reset } = methods;

	const { sendMessage, lastMessage, readyState } = useWebSocket(WEBSOCKET_URL, {
		onOpen: () => {
			console.log(`${roles} WebSocket connection established.`);
			sendMessage(
				JSON.stringify({
					type: "register",
					payload: { reportId, role: roles },
				}),
			);
		},
		onClose: () => {
			console.log(`${roles} WebSocket connection closed.`);
			setPresence("offline");
		},
		shouldReconnect: (_closeEvent) => true,
	});

	// Effect for initializing keys and fetching the other party's public key
	useEffect(() => {
		const initializeKeysAndFetchTheirKey = async () => {
			let generatedKeys: KeyPair | null = null;
			const currentSeed =
				roles === "user" ? seedPhrase : OFFICER_MASTER_SEED_PHRASE;

			if (!currentSeed) return;

			generatedKeys = await generateEncryptionKeyPair(currentSeed);
			setMyKeys(generatedKeys);

			try {
				const res = await fetch(
					`http://localhost:5000/api/reports/${reportId}`,
				);
				const reportData = await res.json();
				const report = reportData.data;

				if (roles === "user") {
					if (report.officerPublicKey) {
						setTheirPublicKey(report.officerPublicKey);
					}
				} else {
					if (report.userPublicKey) {
						setTheirPublicKey(report.userPublicKey);
					}
					if (!report.officerPublicKey && generatedKeys) {
						await fetch(
							`http://localhost:5000/api/reports/${reportId}/assign`,
							{
								method: "PUT",
								headers: { "Content-Type": "application/json" },
								body: JSON.stringify({
									officerPublicKey: generatedKeys.publicKey,
								}),
							},
						);
					}
				}
			} catch (error) {
				console.error("Failed to fetch report details:", error);
			}
		};

		initializeKeysAndFetchTheirKey();
	}, [roles, seedPhrase, reportId]);

	// Effect for fetching and decrypting message history
	// biome-ignore lint/correctness/useExhaustiveDependencies: This effect depends on keys and public key.
	useEffect(() => {
		const fetchAndDecryptHistory = async () => {
			if (myKeys && theirPublicKey) {
				try {
					const res = await fetch(
						`http://localhost:5000/api/chat/${reportId}/messages`,
					);
					if (!res.ok) throw new Error("Failed to fetch message history.");

					const historicalMessages = (await res.json()).data;
					const decryptedHistory = await Promise.all(
						// biome-ignore lint/suspicious/noExplicitAny: message type may vary
						historicalMessages.map(async (msg: any) => {
							// --- THIS IS THE FIX ---
							// Decryption always uses MY private key and THEIR public key,
							// regardless of who sent the message.
							const decryptedContent = await decryptMessage(
								msg.content,
								theirPublicKey, // Always use the other party's public key
								myKeys.privateKey,
							);
							return {
								...msg,
								content: decryptedContent,
								timestamp: new Date(msg.createdAt).toLocaleTimeString(),
							};
						}),
					);
					setMessages(decryptedHistory);
				} catch (error) {
					console.error("Failed to decrypt message history:", error);
				}
			}
		};

		fetchAndDecryptHistory();
	}, [myKeys, theirPublicKey, reportId, roles]);

	// Effect for handling incoming WebSocket messages
	useEffect(() => {
		const processMessage = async () => {
			if (lastMessage !== null && myKeys && theirPublicKey) {
				const data = JSON.parse(lastMessage.data as string);
				const { type, payload } = data;

				switch (type) {
					case "message": {
						const decryptedContent = await decryptMessage(
							payload.content,
							theirPublicKey,
							myKeys.privateKey,
						);
						setMessages((prev) => [
							...prev,
							{
								...payload,
								content: decryptedContent,
								timestamp: new Date().toLocaleTimeString(),
							},
						]);
						break;
					}
					case "typing":
						setIsTyping(payload.isTyping);
						break;
					case "presence":
						setPresence(payload.status);
						if (payload.status === "online" && !theirPublicKey) {
							sendMessage(JSON.stringify({ type: "requestPublicKey" }));
						}
						break;
				}
			}
		};
		processMessage();
	}, [lastMessage, myKeys, theirPublicKey, sendMessage]);

	// Effect to scroll to the bottom of the chat
	// biome-ignore lint/correctness/useExhaustiveDependencies: This effect depends on the message container ref.
	useEffect(() => {
		if (messageContainerRef.current) {
			messageContainerRef.current.scrollTop =
				messageContainerRef.current.scrollHeight;
		}
	}, [messages]);

	const onSendMessage = async (data: { message: string }) => {
		const content = data.message.trim();
		if (content === "" || !myKeys || !theirPublicKey) return;

		const encryptedContent = await encryptMessage(
			content,
			theirPublicKey,
			myKeys.privateKey,
		);
		const messagePayload = {
			sender: roles,
			content: encryptedContent,
			timestamp: new Date().toLocaleTimeString(),
		};

		sendMessage(JSON.stringify({ type: "message", payload: messagePayload }));

		await fetch(`http://localhost:5000/api/chat/${reportId}/messages`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ sender: roles, content: encryptedContent }),
		});

		setMessages((prev) => [...prev, { ...messagePayload, content }]);
		reset();
		sendMessage(
			JSON.stringify({ type: "typing", payload: { isTyping: false } }),
		);
	};

	const handleTypingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		sendMessage(
			JSON.stringify({
				type: "typing",
				payload: { isTyping: e.target.value.length > 0 },
			}),
		);
	};

	return (
		<div className="flex flex-col h-[500px] w-full max-w-lg border rounded-lg shadow-lg bg-white">
			<div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-lg">
				<h2 className="font-bold text-lg text-gray-800">
					Chat for Report #{reportId.substring(0, 8)}...
				</h2>
				<div className="flex items-center gap-2">
					<span
						className={clsxm(
							"h-3 w-3 rounded-full",
							presence === "online" && readyState === ReadyState.OPEN
								? "bg-green-500"
								: "bg-gray-400",
						)}
					/>
					<span className="text-sm text-gray-600 capitalize">
						{presence === "online" && readyState === ReadyState.OPEN
							? "Online"
							: "Offline"}
					</span>
				</div>
			</div>
			<div
				ref={messageContainerRef}
				className="flex-1 p-4 overflow-y-auto bg-gray-100"
			>
				{messages.map((msg, index) => (
					<div
						key={`${msg.timestamp}-${index}`}
						className={clsxm(
							"flex mb-3",
							msg.sender === roles ? "justify-end" : "justify-start",
						)}
					>
						<div
							className={clsxm(
								"rounded-lg py-2 px-4 max-w-xs",
								msg.sender === roles
									? "bg-blue-500 text-white"
									: "bg-gray-300 text-gray-900",
							)}
						>
							<p className="text-sm">{msg.content}</p>
							<p className="text-xs text-right opacity-70 mt-1">
								{msg.timestamp}
							</p>
						</div>
					</div>
				))}
				{isTyping && (
					<div className="text-sm text-gray-500 italic">Typing...</div>
				)}
			</div>
			<div className="p-4 border-t bg-gray-50 rounded-b-lg">
				<FormProvider {...methods}>
					<form
						onSubmit={handleSubmit(onSendMessage)}
						className="flex items-center gap-2"
					>
						<Input
							id="message"
							placeholder={
								theirPublicKey
									? "Type your message..."
									: "Waiting for other party..."
							}
							className="flex-1"
							autoComplete="off"
							disabled={!theirPublicKey || readyState !== ReadyState.OPEN}
							validation={{ required: true }}
							onChange={handleTypingChange}
						/>
						<Button
							type="submit"
							variant="primary"
							disabled={!theirPublicKey || readyState !== ReadyState.OPEN}
							className="!px-4"
						>
							<Send size={20} />
						</Button>
					</form>
				</FormProvider>
			</div>
		</div>
	);
}
