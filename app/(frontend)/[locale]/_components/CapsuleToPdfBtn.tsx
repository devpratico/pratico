"use client";
import { useGeneratePdf } from "@/app/(frontend)/_hooks/useGeneratePdf";
import logger from "@/app/_utils/logger";
import { Json } from "@/supabase/types/database.types";
import { AlertDialog, Box, Card, Flex, Progress, Text, Button, ButtonProps, Tooltip } from "@radix-ui/themes";
import { CircleAlert, CircleCheck, FileDown } from "lucide-react";
import { useFormatter } from "next-intl";
import { useCallback, useEffect, useState, cloneElement, ReactElement, isValidElement } from "react";
import { Editor, Tldraw, TLEditorSnapshot } from "tldraw";

// CAPSULE TO PDF WITHOUT A CANVAS EDITOR
export function CapsuleToPdfBtn(props: {
	snapshot: TLEditorSnapshot | Json,
	title: string,
	capsuleDate: string,
	tooltip?: string,
	children?: ReactElement<{onClick: React.MouseEventHandler<HTMLButtonElement>}>,
} & ButtonProps) {
	const { title, snapshot, capsuleDate, tooltip, children, ...btnProps} = props;
	const { generatePdf, inProgress, progress, pagesProgress } = useGeneratePdf ();
	const [editor, setEditor] = useState<Editor | null>(null);
	const [openDialog, setOpenDialog] = useState(false);
	const formatter = useFormatter();
	const [ filename, setFilename ] = useState("capsule.pdf");
	const [ state, setState ] = useState<'idle' | 'loading' | 'downloading'  | 'error'>('idle');
	const [ errorMsg, setErrorMsg ] = useState<string | null>(null);
	useEffect(() => {
		if (title) {
			const date = capsuleDate.length > 0 ? `-${capsuleDate.replace(/[^a-zA-Z0-9]/g, ''.split(" ").join("-"))}` : "";	
			if (title === "Sans titre")
			{
				setFilename(`capsule${date}.pdf`);
			}
			else
			{
				const validTitle = title
					.normalize('NFD') // Decomposes accented characters into base characters and diacritical marks
					.replace(/[\u0300-\u036f]/g, '') // Removes diacritical marks
					.replace(/[^a-zA-Z0-9]/g, '_'); // Replaces non-alphanumeric characters with underscores
				setFilename(`${validTitle}-${date}.pdf`);
			}
		}
	}, [title, capsuleDate, formatter]);

	useEffect(() => {
		if (errorMsg)
			setState('error');
		else if (inProgress)
			setState('loading');
		else if (progress > 0 && progress < 100)
			setState('downloading');
	}, [editor, inProgress, progress, errorMsg]);

	const handleClick = useCallback(async () => {
		if (!editor)
			return ;
		setOpenDialog(true);
		const { blob, error } = await generatePdf(editor);
		if (blob)
		{
			const blobUrl = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = blobUrl;
			link.setAttribute("download", filename);
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(blobUrl);
			setState('idle');
			setOpenDialog(false);			
		}
		else
		{	
			logger.error("react:component", "CapsuleToPDFBtn", "handleClick", "no result");
			setState('idle');
			setOpenDialog(false);	
		}
	}, [editor, filename, generatePdf]);

	const handleMount = useCallback((newEditor: Editor) => {
		setEditor(newEditor);
    }, []);

	const theButton =
		children && isValidElement(children)
		?
			cloneElement(children, { onClick: handleClick})
		:
		<Button onClick={handleClick} {...btnProps}>
			<FileDown size={21}/>Télécharger le diaporama en PDF
		</Button>
	return (
        <>

            {/* Hidden Tldraw component, needed to download the pdf */}
            <Box height='0' width='0' style={{opacity: 0}} overflow='hidden'>
                <Tldraw hideUi onMount={handleMount} snapshot={snapshot as TLEditorSnapshot} />
            </Box>

			<Tooltip hidden={!tooltip} content={tooltip}>
				{theButton}
			</Tooltip>

            <AlertDialog.Root open={openDialog} onOpenChange={setOpenDialog}>

                <AlertDialog.Content>
					<AlertDialog.Title>Export du diaporama en PDF</AlertDialog.Title>
					<AlertDialog.Description />
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
                                </Flex>

                                <Box width='100%'>
                                    <Progress value={progress} />
                                </Box>
                            </Flex>

                        </Card>
                </AlertDialog.Content>
            </AlertDialog.Root>

        </>
	);
}

