import type { Metadata } from "next";
import LoginForm from "./containers/LoginForm";

export const metadata: Metadata = {
	title: "Masuk",
};

export default function Page() {
	return <LoginForm />;
}
