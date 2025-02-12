"use client";
import { Button, AlertDialog, Flex, Checkbox } from "@radix-ui/themes";
import { Radio } from "lucide-react";
import StopBtn from "./StopBtn";

const dialog = {
	title: "Vous arrêtez la session",
	description: `Votre capsule va être rétablie dans son état original ! Les modifications sont sauvegardées dans les rapports.`
}

export function StopSessionWarningAlert() {

	return (
		<AlertDialog.Root>
			<AlertDialog.Trigger>
				<Button variant="surface" style={{ boxShadow: 'none', backgroundColor: 'var(--background)' }}>
					<Radio color="var(--tomato-10)"/>arrêter la session
				</Button>
			</AlertDialog.Trigger>
			<AlertDialog.Content>
				<AlertDialog.Title>{dialog.title}</AlertDialog.Title>
				<Flex direction="column" gap="4">
					<AlertDialog.Description size="2" style={{ whiteSpace: "pre-line" }}>{dialog.description}</AlertDialog.Description>
					{/* <Flex justify="center" align="center" gap="1">
						<Checkbox />Ne plus afficher ce message
					</Flex> */}
					<Flex justify="end" gap="2" >
						<AlertDialog.Cancel>
							<Button variant="soft" color="gray">
								annuler
							</Button>
						</AlertDialog.Cancel>
						<AlertDialog.Action>			
							<StopBtn message="continuer" />
						</AlertDialog.Action>
					</Flex>
				</Flex>
			</AlertDialog.Content>
		</AlertDialog.Root>);
};