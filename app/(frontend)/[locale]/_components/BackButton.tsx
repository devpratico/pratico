"use client";
import { Button, ButtonProps } from "@radix-ui/themes";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";


interface BackButtonProps extends ButtonProps {
    backTo: string;
}

export function BackButton ({ backTo, ...btnProps }: BackButtonProps) {
	const router = useRouter();

	const handleBack = (e: React.MouseEvent) => {
		e.preventDefault();
		router.push(backTo || "/");
	};
	return (
		<Button {...btnProps} onClick={handleBack} variant="soft">
			<ArrowLeft />Retour
		</Button>)

};