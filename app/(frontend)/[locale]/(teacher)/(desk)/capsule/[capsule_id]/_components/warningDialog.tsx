"use client";

import { useDisable } from "@/app/(frontend)/_hooks/contexts/useDisable";
import { Button, AlertDialog, Flex, Checkbox } from "@radix-ui/themes";
import { cloneElement, isValidElement, ReactElement, useState } from "react";

export function WarningDialog(args: {
	message: string | React.ReactNode, 
	title: string,
	description: string,
	buttonAction: React.ReactNode,
	variant?: 'surface' | 'outline' | 'classic' | 'solid' | 'soft' | 'ghost'
}) {
	const { message, title, description, buttonAction, variant="surface" } = args;
	const [loading, setLoading] = useState(false);
	const { disabled, setDisabled } = useDisable();

	const handleClose = () => {
		setLoading(false);
		setDisabled(false);
	};

	const enhancedButtonAction = isValidElement(buttonAction) && "onClick" in buttonAction.props
		? cloneElement(buttonAction as ReactElement, {
				onClick: (event: React.MouseEvent) => {
					handleClose();
					buttonAction.props.onClick?.(event);
				},
		 	})
		: buttonAction;
	return (
		<AlertDialog.Root>
			<AlertDialog.Trigger>
				<Button
					variant={variant}
					loading={loading}
					disabled={disabled}
					style={{ boxShadow: 'none', ...(variant === 'surface' ? { backgroundColor: 'var(--background)' } : {}) }}
				>
					{message}
				</Button>
			</AlertDialog.Trigger>
			<AlertDialog.Content>
				<AlertDialog.Title align="center">{title}</AlertDialog.Title>
				<Flex direction="column" gap="4">
					<AlertDialog.Description style={{ whiteSpace: "pre-line" }}>{description}</AlertDialog.Description>
					<Flex justify="center" align="center" gap="1">
						<Checkbox />Ne plus afficher ce message
					</Flex>
					<Flex justify="center" gap="5" >
						<AlertDialog.Cancel>
							<Button>
								annuler
							</Button>
						</AlertDialog.Cancel>				
						{enhancedButtonAction}
					</Flex>
				</Flex>
			</AlertDialog.Content>
		</AlertDialog.Root>);
};