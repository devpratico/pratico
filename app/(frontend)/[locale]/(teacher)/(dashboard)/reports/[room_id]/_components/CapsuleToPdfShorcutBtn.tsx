import { useGeneratePdf } from "@/app/(frontend)/_hooks/useGeneratePdf";
import logger from "@/app/_utils/logger";
import createClient from "@/supabase/clients/client";
import { Box, Button, Card, Dialog, Flex, IconButton, Tooltip } from "@radix-ui/themes";
import { FileDown } from "lucide-react";
import { useFormatter } from "next-intl";
import { useCallback, useState } from "react";
import { Editor, getUserPreferences, setUserPreferences, TLComponents, Tldraw, TldrawImage, TLEditorSnapshot, track, useEditor, useReactor } from "tldraw";

export function CapsuleToPdfShortcutBtn({snapshot, capsuleId, isRoom}: {snapshot: TLEditorSnapshot, capsuleId: string, isRoom: boolean}) {
	const { generatePdf } = useGeneratePdf ();
	const [editor, setEditor] = useState<Editor | null>(null);
	const [openDialog, setOpenDialog] = useState(false);
	const supabase = createClient();
	const formatter = useFormatter();
	const [ filename, setFilename ] = useState("capsule.pdf");

	const handleClick = async () => {
		console.log("CLICKED", snapshot, editor);
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
		const result = await generatePdf(editor, filename);
		if (result && !result.error)
		{
			const { pdf } = result;
			console.log("PDF", pdf);
			pdf.output('dataurlnewwindow');
			// pdf.save(filename);
		}
		else
			logger.error("react:component", "CapsuleToPDFBtn", "handleClick", result?.error);
		
	};
	const getCapsuleData = async () => {
		const { data, error } = await supabase.from('capsules').select("title, created_at").eq('id', capsuleId).single();
		if (error)
			logger.error("react:component", "CapsuleToPDFBtn", "getCapsuleData", error);
		else
			return (data);
	};

	const handleMount = useCallback((theEditor: Editor) => {
		if (!editor)
			setEditor(theEditor);
		setUserPreferences({
            ...getUserPreferences(),
            edgeScrollSpeed: 0
        })
	}, [editor]);

	const components: TLComponents = {
		SharePanel: InfoPanel,
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
					<Flex direction="column-reverse" gap="3">
						<Box style={{ inset: "inherit" /*padding: "0", width: "0px", height: "0px"*/ }}>
								<Tldraw options={{ maxPages: 1 }} components={components} hideUi onMount={handleMount} snapshot={snapshot} />
						</Box>
						{/* <Box style={{ boxShadow:"var(--shadow-3)", borderRadius: "var(--radius-4)"}}>
							<TldrawImage snapshot={snapshot} pageId={snapshot.session.pageStates[0].pageId}/>	
						</Box> */}
						<Dialog.Description>Exporter le contenu de la capsule en PDF</Dialog.Description>
						<Button onClick={handleClick}>Exporter</Button>
					</Flex>
					
				</Card>
			</Dialog.Content>
		</Dialog.Root>
	);
}

const InfoPanel = track(() => {
	const editor = useEditor();
	const tool = editor?.getCurrentToolId()
	const zoom = editor?.getZoomLevel().toFixed(2)
	useReactor(
		'change title',
		() => {
			const shapes = editor?.getCurrentPageShapes()
			document.title = `shapes: ${shapes?.length}`
		},
		[editor]
	)
	return (
		<div style={{ pointerEvents: 'all', backgroundColor: 'thistle', fontSize: 14, padding: 8 }}>
			<div>tool: {tool}</div>
			<div>zoom: {zoom}</div>
		</div>
	)
})