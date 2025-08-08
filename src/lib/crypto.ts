"use client";

import { x25519 } from "@noble/curves/ed25519";
import * as bip39 from "bip39";

// Helper to convert hex string to Uint8Array
function hexToBytes(hex: string): Uint8Array {
	const bytes = new Uint8Array(hex.length / 2);
	for (let i = 0; i < bytes.length; i++) {
		bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
	}
	return bytes;
}

// Helper to convert Uint8Array to hex string
function bytesToHex(bytes: Uint8Array): string {
	return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
		"",
	);
}

/**
 * Generates a new 12-word BIP39 mnemonic seed phrase.
 * @returns A new seed phrase.
 */
export function generateSeedPhrase(): string {
	return bip39.generateMnemonic();
}

/**
 * Deterministically generates an X25519 key pair for encryption from a seed phrase.
 * This ensures a user always has the same keys.
 * @param seedPhrase The user's unique seed phrase.
 * @returns A promise resolving to an object with public and private keys as hex strings.
 */
export async function generateEncryptionKeyPair(seedPhrase: string) {
	const seed = await bip39.mnemonicToSeed(seedPhrase);
	// Use a portion of the seed for the private key (first 32 bytes)
	const privateKeyBytes = seed.slice(0, 32);
	const publicKeyBytes = x25519.getPublicKey(privateKeyBytes);

	return {
		privateKey: bytesToHex(privateKeyBytes),
		publicKey: bytesToHex(publicKeyBytes),
	};
}

/**
 * Encrypts a message using a shared secret derived from the key pair.
 * @param message Plaintext message.
 * @param theirPublicKeyHex Recipient's public key (hex).
 * @param myPrivateKeyHex Sender's private key (hex).
 * @returns Stringified JSON with encrypted content and IV.
 */
export async function encryptMessage(
	message: string,
	theirPublicKeyHex: string,
	myPrivateKeyHex: string,
): Promise<string> {
	const sharedSecret = x25519.getSharedSecret(
		hexToBytes(myPrivateKeyHex),
		hexToBytes(theirPublicKeyHex),
	);

	// Import the shared secret to use it as an AES-GCM key
	const key = await crypto.subtle.importKey(
		"raw",
		sharedSecret,
		{ name: "AES-GCM" },
		false,
		["encrypt"],
	);

	const iv = crypto.getRandomValues(new Uint8Array(12));
	const encodedMessage = new TextEncoder().encode(message);

	const encryptedContent = await crypto.subtle.encrypt(
		{ name: "AES-GCM", iv },
		key,
		encodedMessage,
	);

	return JSON.stringify({
		iv: Array.from(iv),
		content: Array.from(new Uint8Array(encryptedContent)),
	});
}

/**
 * Decrypts a message.
 * @param encryptedData Stringified JSON with encrypted content and IV.
 * @param theirPublicKeyHex Sender's public key (hex).
 * @param myPrivateKeyHex Recipient's private key (hex).
 * @returns Decrypted plaintext message.
 */
export async function decryptMessage(
	encryptedData: string,
	theirPublicKeyHex: string,
	myPrivateKeyHex: string,
): Promise<string> {
	const { iv, content } = JSON.parse(encryptedData);
	const sharedSecret = x25519.getSharedSecret(
		hexToBytes(myPrivateKeyHex),
		hexToBytes(theirPublicKeyHex),
	);

	const key = await crypto.subtle.importKey(
		"raw",
		sharedSecret,
		{ name: "AES-GCM" },
		false,
		["decrypt"],
	);

	const decryptedContent = await crypto.subtle.decrypt(
		{ name: "AES-GCM", iv: new Uint8Array(iv) },
		key,
		new Uint8Array(content),
	);

	return new TextDecoder().decode(decryptedContent);
}
