import { useGeneratePdf } from "@/app/(frontend)/_hooks/useGeneratePDF";
import logger from "@/app/_utils/logger";
import createClient from "@/supabase/clients/client";
import { Button, Card, Dialog, Flex, IconButton, Tooltip } from "@radix-ui/themes";
import { FileDown } from "lucide-react";
import { useFormatter } from "next-intl";
import { useEffect, useState } from "react";
import { Editor, Tldraw, TLEditorSnapshot } from "tldraw";

export function CapsuleToPdfShortcutBtn({snapshot, capsuleId, isRoom}: {snapshot: TLEditorSnapshot, capsuleId: string, isRoom: boolean}) {
	const { generatePdf } = useGeneratePdf ();
	const [editor, setEditor] = useState<Editor | null>(null);
	const [openDialog, setOpenDialog] = useState(false);
	const supabase = createClient();
	const formatter = useFormatter();
	const [ filename, setFilename ] = useState("capsule.pdf");


	const handleClick = async () => {
		console.log("CLICKED", editor);
		if (!editor)
			return ;
		if (!isRoom) {
			const data = await getCapsuleData();
			if (data?.title) {
				if (data?.title === "Sans titre")
					setFilename(`capsule-${formatter.dateTime(new Date(data.created_at)).split(" ").join("-")}.pdf`);
				else
				{
					const title = data?.title
						.normalize('NFD') // Decomposes accented characters into base characters and diacritical marks
						.replace(/[\u0300-\u036f]/g, '') // Removes diacritical marks
						.replace(/[^a-zA-Z0-9]/g, '_'); // Replaces non-alphanumeric characters with underscores
					setFilename(`${title}-${formatter.dateTime(new Date(data.created_at)).split(" ").join("-")}.pdf`);
				}
			}
		}
		await generatePdf(editor, filename);
	};
	const getCapsuleData = async () => {
		const { data, error } = await supabase.from('capsules').select("title, created_at").eq('id', capsuleId).single();
		if (error)
			logger.error("react:component", "CapsuleToPDFBtn", "getCapsuleData", error);
		else
			return (data);
	};

	return (
		<Dialog.Root  open={openDialog} onOpenChange={setOpenDialog}>
			
			<Tooltip content="Exporter en PDF">
				<Dialog.Trigger>
					<IconButton variant="ghost" onClick={() => setOpenDialog(true)} >
						<FileDown />
					</IconButton>
				</Dialog.Trigger>
			</Tooltip>

			<Dialog.Content>
			<Dialog.Title>Exporter en PDF</Dialog.Title>

				<Card>
					<Flex>
						<Tldraw hideUi onMount={(editor) => setEditor(editor)} snapshot={snapshot} />

						<Dialog.Description>Exporter le contenu de la capsule en PDF</Dialog.Description>
						<Button onClick={handleClick}>Exporter</Button>
					</Flex>
					
				</Card>
			</Dialog.Content>
		</Dialog.Root>
	);
}