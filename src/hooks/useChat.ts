import { useEffect, useMemo, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { decryptMessage, encryptMessage } from "@/lib/crypto";
import type { Message } from "@/types/entities/message";

type useChatProps = {
	reportId: string;
	userRole: "OFFICER" | "CLIENT";
	myPrivateKey: string;
	theirPublicKey: string;
};

type Presence = "online" | "offline";
type PresenceStatus = {
	role: "OFFICER" | "CLIENT";
	status: Presence;
};

type Typing = {
	payload: boolean;
	role: "OFFICER" | "CLIENT";
};

export function useChat({
	reportId,
	userRole,
	myPrivateKey,
	theirPublicKey,
}: useChatProps) {
	const [messages, setMessages] = useState<Message[]>([]);
	const [isTyping, setIsTyping] = useState<boolean>(false);
	const [presence, setPresence] = useState<Presence>("offline");
	const [socket, setSocket] = useState<Socket | null>(null);

	const memoMyPrivateKey = useMemo(() => myPrivateKey, [myPrivateKey]);
	const memoTheirPublicKey = useMemo(() => theirPublicKey, [theirPublicKey]);

	useEffect(() => {
		if (!memoMyPrivateKey || !memoTheirPublicKey) return;
		const s = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}/chat`, {
			transports: ["websocket"],
		});
		setSocket(s);

		s.on("connect", () => {
			console.log("Connected to chat socket", s.id);

			s.emit("join_room", { report_id: reportId, role: userRole });
		});

		s.on("load_history", async (history: Message[]) => {
			const decryptedHisory = await Promise.all(
				history.map(async (message: Message) => {
					const decryptedContent = await decryptMessage(
						message.content,
						memoTheirPublicKey,
						memoMyPrivateKey,
					);
					return { ...message, content: decryptedContent };
				}),
			);
			setMessages(decryptedHisory);
		});

		s.on("chat_message", async (message: Message) => {
			const decryptedContent = await decryptMessage(
				message.content,
				memoTheirPublicKey,
				memoMyPrivateKey,
			);
			setMessages((prev) => [
				...prev,
				{ ...message, content: decryptedContent },
			]);
		});

		s.on("presence_update", ({ role: _role, status }: PresenceStatus) => {
			if (_role !== userRole) {
				setPresence(status);
			}
		});

		s.on("typing", ({ payload, role: senderRole }: Typing) => {
			if (senderRole !== userRole) {
				setIsTyping(payload);
			}
		});

		return () => {
			s.disconnect();
		};
	}, [memoMyPrivateKey, memoTheirPublicKey, reportId, userRole]);

	const sendMessage = async (content: string) => {
		if (!socket) return;

		const encryptedContent = await encryptMessage(
			content,
			theirPublicKey,
			myPrivateKey,
		);

		socket.emit("chat_message", {
			report_id: reportId,
			sender: userRole,
			content: encryptedContent,
		});
	};

	const sendTyping = (typing: boolean) => {
		if (!socket) return;
		socket.emit("typing", {
			report_id: reportId,
			type: "typing",
			payload: typing,
		});
	};

	return {
		messages,
		sendMessage,
		sendTyping,
		isTyping,
		presence,
	};
}
