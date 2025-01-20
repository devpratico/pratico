import { useGeneratePdf } from "@/app/(frontend)/_hooks/useGeneratePdf";
import logger from "@/app/_utils/logger";
import { AlertDialog, Box, Card, Flex, Progress, Text, Button, ButtonProps } from "@radix-ui/themes";
import { CircleAlert, CircleCheck, FileDown } from "lucide-react";
import { useFormatter } from "next-intl";
import { useCallback, useEffect, useState, cloneElement, ReactElement, ReactNode, isValidElement } from "react";
import { Editor, Tldraw, TLEditorSnapshot } from "tldraw";

//export function CapsuleToPdfShortcutBtn({ snapshot, title, capsuleDate, tooltip, ...btnProps }: { snapshot: TLEditorSnapshot, title: string, capsuleDate: string }) {
export function CapsuleToPdfBtn(props: {
	snapshot: TLEditorSnapshot,
	title: string,
	capsuleDate: string,
	children?: ReactElement<{onClick: React.MouseEventHandler<HTMLButtonElement>}>,
} & ButtonProps) {
	const { snapshot, title, capsuleDate, children, ...btnProps} = props;

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
				const date = capsuleDate.replace(/[^a-zA-Z0-9]/g, ''.split(" ").join("-"));

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
        <>

            {/* Hidden Tldraw component, needed to download the pdf */}
            <Box height='0' width='0' style={{opacity: 0}} overflow='hidden'>
                <Tldraw hideUi onMount={handleMount} snapshot={snapshot} />
            </Box>


            {/* <Tooltip content={tooltip}>
                <Button variant="ghost" onClick={handleClick} {...btnProps}>
                    <FileDown />
                </Button>
            </Tooltip> */}

			{
				children
				?
				cloneElement(children, { onClick: handleClick })
				:
				<Button onClick={handleClick} {...btnProps}>
					<FileDown size={21}/>Télécharger le diaporama en PDF
				</Button>
			}




            <AlertDialog.Root open={openDialog} onOpenChange={setOpenDialog}>

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

        </>
	);
}
  