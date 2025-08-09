export async function getOfficerKeys() {
	return {
		// biome-ignore lint/style/noNonNullAssertion: Env var is guaranteed to be set
		privateKey: process.env.OFFICER_PRIVATE_KEY!,
		// biome-ignore lint/style/noNonNullAssertion: Env var is guaranteed to be set
		publicKey: process.env.NEXT_PUBLIC_OFFICER_PUBLIC_KEY!,
	};
}
