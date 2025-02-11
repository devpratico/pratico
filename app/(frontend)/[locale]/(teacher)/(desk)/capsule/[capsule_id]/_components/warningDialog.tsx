"use client";

import { useDisable } from "@/app/(frontend)/_hooks/contexts/useDisable";
import { Button, Dialog } from "@radix-ui/themes";
import { useState } from "react";

export function WarningDialog(args: {
	message: string | React.ReactNode, 
	title?: string,
	description?: string,
	buttonAction: React.ReactNode,
	variant?: 'surface' | 'outline' | 'classic' | 'solid' | 'soft' | 'ghost'
}) {
	const { message, title, description, buttonAction, variant="surface" } = args;
	const [loading, setLoading] = useState(false);
	const { disabled, setDisabled } = useDisable();
	return (
	<Dialog.Root>
		<Dialog.Trigger>
			<Button
			    variant={variant}
				loading={loading}
				disabled={disabled}
				onClick={() => {
					setLoading(true);
					setDisabled(true);
				}}
				style={{ boxShadow: 'none', ...(variant === 'surface' ? { backgroundColor: 'var(--background)' } : {}) }}
			>
				{message}
			</Button>
		</Dialog.Trigger>
		<Dialog.Content>
			<Dialog.Title>{title}</Dialog.Title>
			<Dialog.Description>{description}</Dialog.Description>
			{buttonAction}
		</Dialog.Content>
	</Dialog.Root>);
};