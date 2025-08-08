"use client";

import { FormProvider, useForm } from "react-hook-form";

import { useLoginMutation } from "@/app/(auth)/login/hooks/useLoginMutation";
import Button from "@/components/button/Button";
import Input from "@/components/form/Input";
import Typography from "@/components/Typography";

export type LoginForm = {
	email: string;
	password: string;
};

export default function LoginPage() {
	const methods = useForm<LoginForm>({
		mode: "onTouched",
	});
	const {
		handleSubmit,
		formState: { isValid },
	} = methods;
	const { mutate, isPending } = useLoginMutation();
	const onSubmit = (data: LoginForm) => {
		mutate(data);
	};

	return (
		<section className="h-screen flex flex-col items-center justify-center">
			<Typography
				as="h1"
				variant="j2"
				weight="bold"
				className="text-center text-primary-800"
			>
				Masuk
			</Typography>

			<FormProvider {...methods}>
				<form
					className="w-[600px] max-sm:w-[90%] mt-4 flex flex-col gap-4"
					onSubmit={handleSubmit(onSubmit)}
				>
					<Input
						id="email"
						label="Email"
						placeholder="Masukkan email Anda"
						validation={{
							required: "Email harus diisi",
							pattern: {
								value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
								message: "Format email tidak valid",
							},
						}}
					/>
					<Input
						id="password"
						label="Kata Sandi"
						type="password"
						placeholder="Masukkan kata sandi Anda"
						validation={{
							required: "Kata sandi harus diisi",
						}}
					/>
					<Button
						type="submit"
						variant="primary"
						className="mt-4 py-2"
						disabled={!isValid || isPending}
						isLoading={isPending}
					>
						Masuk
					</Button>
				</form>
			</FormProvider>
		</section>
	);
}
