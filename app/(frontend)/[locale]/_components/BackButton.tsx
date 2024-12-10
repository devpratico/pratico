"use client";
import { Button } from "@radix-ui/themes";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function BackButton ({ backTo }: { backTo: string }) {
	const router = useRouter();

	const handleBack = () => {
		router.prefetch(backTo);
		router.push(backTo || "/");
	};
	return (
		<Button onClick={handleBack} variant="soft">
			<ArrowLeft />Retour
		</Button>)

};