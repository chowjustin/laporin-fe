// src/components/chat/ChatClient.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { Send } from "lucide-react";
import {
  generateEncryptionKeyPair,
  encryptMessage,
  decryptMessage,
  generateSeedPhrase,
} from "@/lib/crypto";
import Button from "@/components/button/Button";
import Input from "@/components/form/Input";
import { FormProvider, useForm } from "react-hook-form";
import clsxm from "@/lib/clsxm";

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
  role: "user" | "officer";
  seedPhrase?: string;
}

const WEBSOCKET_URL = "ws://localhost:5000";

export default function ChatClient({
  reportId,
  role,
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
      console.log(`${role} WebSocket connection established.`);
      sendMessage(
        JSON.stringify({ type: "register", payload: { reportId, role } })
      );
    },
    onClose: () => {
      console.log(`${role} WebSocket connection closed.`);
      setPresence("offline");
    },
    shouldReconnect: (closeEvent) => true,
  });

  useEffect(() => {
    const initialize = async () => {
      if (role === "officer") {
        // Officer fetches the user's public key from the report details
        try {
          const res = await fetch(
            `http://localhost:5000/api/reports/${reportId}`
          );
          const data = await res.json();
          if (data.data.userPublicKey) {
            setTheirPublicKey(data.data.userPublicKey);
          }
        } catch (error) {
          console.error("Officer failed to fetch user public key:", error);
        }
        // Officer generates ephemeral (temporary) keys for the session
        const ephemeralSeed = generateSeedPhrase();
        const officerKeys = await generateEncryptionKeyPair(ephemeralSeed);
        setMyKeys(officerKeys);
      } else if (role === "user" && seedPhrase) {
        // User generates their deterministic keys from their saved seed phrase
        const userKeys = await generateEncryptionKeyPair(seedPhrase);
        setMyKeys(userKeys);
      }
    };
    initialize();
  }, [role, seedPhrase, reportId]);

  useEffect(() => {
    if (myKeys && readyState === ReadyState.OPEN) {
      // Broadcast public key when ready
      sendMessage(
        JSON.stringify({
          type: "publicKey",
          payload: { publicKey: myKeys.publicKey },
        })
      );
    }
  }, [myKeys, readyState, sendMessage]);

  useEffect(() => {
    const processMessage = async () => {
      if (lastMessage !== null && myKeys) {
        const data = JSON.parse(lastMessage.data as string);
        const { type, payload } = data;

        switch (type) {
          case "publicKey":
            if (payload.publicKey !== myKeys.publicKey) {
              setTheirPublicKey(payload.publicKey);
            }
            break;
          case "message":
            if (theirPublicKey) {
              const decryptedContent = await decryptMessage(
                payload.content,
                theirPublicKey,
                myKeys.privateKey
              );
              setMessages((prev) => [
                ...prev,
                {
                  ...payload,
                  content: decryptedContent,
                  timestamp: new Date().toLocaleTimeString(),
                },
              ]);
            }
            break;
          case "typing":
            setIsTyping(payload.isTyping);
            break;
          case "presence":
            setPresence(payload.status);
            break;
          case "requestPublicKey":
            if (myKeys) {
              sendMessage(
                JSON.stringify({
                  type: "publicKey",
                  payload: { publicKey: myKeys.publicKey },
                })
              );
            }
            break;
        }
      }
    };
    processMessage();
  }, [lastMessage, myKeys, theirPublicKey, sendMessage]);

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
      myKeys.privateKey
    );
    const messagePayload = {
      sender: role,
      content: encryptedContent,
      timestamp: new Date().toLocaleTimeString(),
    };

    sendMessage(JSON.stringify({ type: "message", payload: messagePayload }));

    await fetch(`http://localhost:5000/api/chat/${reportId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sender: role, content: encryptedContent }),
    });

    setMessages((prev) => [...prev, { ...messagePayload, content }]);
    reset();
    sendMessage(
      JSON.stringify({ type: "typing", payload: { isTyping: false } })
    );
  };

  const handleTypingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    sendMessage(
      JSON.stringify({
        type: "typing",
        payload: { isTyping: e.target.value.length > 0 },
      })
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
                : "bg-gray-400"
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
            key={index}
            className={clsxm(
              "flex mb-3",
              msg.sender === role ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={clsxm(
                "rounded-lg py-2 px-4 max-w-xs",
                msg.sender === role
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-900"
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
