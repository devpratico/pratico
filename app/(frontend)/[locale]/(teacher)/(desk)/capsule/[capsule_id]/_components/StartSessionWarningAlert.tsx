"use client";
import { Button, AlertDialog, Flex, Checkbox, Text } from "@radix-ui/themes";
import { Play } from "lucide-react";
import StartBtn from "./StartBtn";


const dialog = {
	title: "Vous lancez une session !",
	description: `N'ayez pas peur de dynamiser votre présentation avec du dessin, des post-it, des images et des nouvelles pages.

		À la fin, votre capsule sera rétablie dans son état original !
		Les modifications sont sauvegardées dans les rapports.`
}

export function StartSessionWarningAlert() {
	
	return (
		<AlertDialog.Root>
			<AlertDialog.Trigger>
				<Button variant="surface" style={{ boxShadow: 'none', backgroundColor: 'var(--accent-1)' }}>
					<Play size={21} />
                    <Text trim="end">lancer la session</Text>
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
							<StartBtn message="continuer" />
						</AlertDialog.Action>
					</Flex>
				</Flex>
			</AlertDialog.Content>
		</AlertDialog.Root>);
};