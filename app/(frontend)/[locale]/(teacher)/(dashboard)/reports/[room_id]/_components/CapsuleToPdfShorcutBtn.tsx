import { useGeneratePdf } from "@/app/(frontend)/_hooks/useGeneratePdf";
import logger from "@/app/_utils/logger";
import { AlertDialog, Box, Card, Flex, IconButton, Progress, Text, Tooltip } from "@radix-ui/themes";
import { CircleAlert, CircleCheck, FileDown } from "lucide-react";
import { useFormatter } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { Editor, Tldraw, TLEditorSnapshot } from "tldraw";

export function CapsuleToPdfShortcutBtn({ snapshot, title, capsuleDate }: { snapshot: TLEditorSnapshot, title: string, capsuleDate: string }) {
	const { generatePdf, inProgress, progress, pagesProgress } = useGeneratePdf ();
	const [editor, setEditor] = useState<Editor | null>(null);
	const [openDialog, setOpenDialog] = useState(false);
	const formatter = useFormatter();
	const [ filename, setFilename ] = useState("capsule.pdf");
	const [ state, setState ] = useState<'idle' | 'loading' | 'downloading'  | 'error'>('idle');
	const [ errorMsg, setErrorMsg ] = useState<string | null>(null);

	useEffect(() => {
		if (title) {
			if (title === "Sans titre")
			{
				const date = capsuleDate.replace(/[^a-zA-Z0-9]/g, ''.split(" ").join("-"));	
				setFilename(`capsule-${date}.pdf`);
			}
			else
			{
				const validTitle = title
					.normalize('NFD') // Decomposes accented characters into base characters and diacritical marks
					.replace(/[\u0300-\u036f]/g, '') // Removes diacritical marks
					.replace(/[^a-zA-Z0-9]/g, '_'); // Replaces non-alphanumeric characters with underscores
				const date = formatter.dateTime(new Date(capsuleDate)).replace(/[^a-zA-Z0-9]/g, ''.split(" ").join("-"));

				setFilename(`${validTitle}-${date}.pdf`);
			}
		}
	}, [title]);

	useEffect(() => {
		if (errorMsg)
			setState('error');
		else if (inProgress)
			setState('loading');
		else if (progress > 0 && progress < 100)
			setState('downloading');
	}, [editor, inProgress, progress, errorMsg]);

	const handleClick = async () => {
		if (!editor)
			return ;
		setOpenDialog(true);
		const result = await generatePdf(editor);
		if (result)
		{
			const { pdf, error } = result;
			if (error)
			{
				logger.error("react:component", "CapsuleToPDFShortcutBtn", "handleClick", error);
				setErrorMsg(error);
				return ;
			}
			pdf.save(filename);
			setState('idle');
			setOpenDialog(false);			
		}
		else
		{	
			logger.error("react:component", "CapsuleToPDFShortcutBtn", "handleClick", "no result");
			setState('idle');
			setOpenDialog(false);	
		}
	};

	const handleMount = useCallback((newEditor: Editor) => {
		setEditor(newEditor);
    }, []);

	return (
		<AlertDialog.Root open={openDialog} onOpenChange={setOpenDialog}>
			<Box display="none">
				<Tldraw hideUi onMount={handleMount} snapshot={snapshot}/>
			</Box>

			<Tooltip content="Exporter la capsule modifiée en PDF">	
				<IconButton variant="ghost" onClick={handleClick} >
					<FileDown />
				</IconButton>
			</Tooltip>


			<AlertDialog.Content>
			<AlertDialog.Title>Export du diaporama en PDF</AlertDialog.Title>
				<Card variant='surface' my='4'>
						

						{/* ERROR */}
						<Flex direction='column' align='center' gap='3' display={state=='error' ? 'flex' : 'none'}>
							<Flex align='center' gap='1' style={{ color: 'var(--red)' }}>
								<CircleAlert size='15' style={{ color: 'var(--red)' }} />
								<Text trim='both'>{`${errorMsg ? errorMsg : "Une erreur s'est produite"}`}</Text>
							</Flex>
						</Flex>


						{/* LOADING */}
						<Flex direction='column' align='center' gap='3' display={state=='loading' ? 'flex' : 'none'}>
							<Flex align='center' justify='between' gap='1' width='100%' style={{color:'var(--gray-10)'}}>
								<Text trim='both'>{filename}</Text>
								<Text size='1'>{`Conversion page ${pagesProgress.loading} sur ${pagesProgress.total}`}</Text>
							</Flex>

							<Box width='100%'>
								<Progress value={progress} />
							</Box> 
						</Flex>

						{/* DOWNLOADING */}
						<Flex direction='column' align='center' gap='3' display={state == 'downloading' ? 'flex' : 'none'}>
							<Flex mb="5" align='center' gap='1' style={{ color: 'var(--green)' }}>
								<CircleCheck size='15' style={{ color: 'var(--green)' }} />
								<Text trim='both'>{`Conversion réussie, téléchargement du PDF en cours...`}</Text>
							</Flex>
							<Flex align='center' justify='between' gap='1' width='100%' style={{ color: 'var(--gray-10)' }}>
								<Text trim='both'>{filename}</Text>
								<Text size='1'>{`Chargement page ${pagesProgress.loading} sur ${pagesProgress.total}`}</Text>
							</Flex>

							<Box width='100%'>
								<Progress value={progress} />
							</Box>
						</Flex>

					</Card>
			</AlertDialog.Content>
		</AlertDialog.Root>
	);
}
