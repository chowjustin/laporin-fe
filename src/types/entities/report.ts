import type { Message } from "./message";
import type { User } from "./user";

export type Report = {
	id: string;
	seed_phrase: string;
	details: string | null;
	created_at: string;
	summary?: string;
	category?: string;
	urgency?: string;
	recommended_instance?: string;
	user_public_key?: string;
	officer_public_key?: string;
	messages?: Message[];
	handler_id?: string;
	handler: User;
};
