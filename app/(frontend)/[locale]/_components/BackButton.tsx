"use client";
import { Button } from "@radix-ui/themes";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function BackButton ({ backTo }: { backTo: string }) {
	const router = useRouter();

	const handleBack = (e: React.MouseEvent) => {
		e.preventDefault();
		router.prefetch(backTo);
		router.push(backTo || "/");
	};
	return (
		<Button mb="4" onClick={handleBack} variant="soft">
			<ArrowLeft />Retour
		</Button>)

};