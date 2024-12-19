"use client";

import jsPDF from "jspdf";
import { exportToBlob } from "tldraw";
import { defaultBox } from "@/app/(frontend)/[locale]/_components/canvases/custom-ui/Resizer";
import createClient from "@/supabase/clients/client";
import logger from "@/app/_utils/logger";
import { formatDate } from "@/app/_utils/utils_functions";
import { Flex, Button, Progress, AlertDialog, Card, Text, Box } from "@radix-ui/themes"
import { CircleAlert, CircleCheck, FileDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useTLEditor } from "@/app/(frontend)/_hooks/useTLEditor";

export function CapsuleToPdfDialog({capsuleId, isRoom}: {capsuleId: string | string[], isRoom: boolean})
{
	const { editor } = useTLEditor();
	const supabase = createClient();
	const [ disabled, setDisabled ] = useState(false);
	const [ progress, setProgress ] = useState(0);
	const [ filename, setFilename ] = useState("capsule.pdf");
	const [ pagesProgress, setPagesProgress  ] = useState<{loading: number, total: number}>({loading: 0, total: 0});
	const [ openDialog, setOpenDialog ] = useState(false);
	const [ state, setState ] = useState<'loading' | 'downloading'  | 'error'>('loading');
	const [ errorMsg, setErrorMsg ] = useState<string | null>(null);

	const createPdf = async (blobs: Blob[], pdf: jsPDF) => {
		const processBlob = async (index: number) => {
			if (index >= blobs.length) {
				setDisabled(false);
				setOpenDialog(false);
				setProgress(0);
				pdf.save(filename);
				return ;
			}
			const blob = blobs[index];
			setState('downloading');
			setPagesProgress((prev) => ({loading: index + 1, total: prev?.total}));
			const reader = new FileReader();
			reader.onload = async () => {
				const base64data = reader.result as string;
				try {
					pdf.addImage(base64data, "WEBP", 0, 0, defaultBox.w, defaultBox.h);
				} catch (error) {
					logger.error("react:component", "CapsuleToPDFBtn", "pdf.addImage", index, error);
				}

				if (index < blobs.length - 1) {
					pdf.addPage();
				}
				setProgress((prev) => Math.min((prev || 0) + 100 / (blobs.length || 1), 100));

				const timeout = setTimeout(() => {processBlob(index + 1)}, 100);
				return (() => clearTimeout(timeout));
			};
			reader.onerror = (error) => {
				logger.error("react:component", "CapsuleToPDFBtn", "FileReader", index, error);
				setState('error');
			};
			reader.readAsDataURL(blob);
		};

		try {
			processBlob(0);
		} catch (error) {
			logger.error("react:component", "CapsuleToPDFBtn", "createPdf", error);
			setState('error');
		};
	};

	const handleExportAllPages = async () => {
		if (!editor)
			return ;
		setDisabled(true);
		setState('loading');
		const pdf = new jsPDF('landscape', 'px', [defaultBox.w, defaultBox.h]);
		const allBlobs: any[] = [];
		const allPages = editor.getPages();

		
		setPagesProgress({loading: 0, total: allPages.length});
		if (allPages.length === 0)
		{	
			setDisabled(false);
			setErrorMsg("Aucune page à exporter ou page vide...");
			setProgress(0);
			setState('error');
			const timeout = setTimeout(() => {
				setErrorMsg(null);
				setOpenDialog(false);
			}, 2000);
			return (() => clearTimeout(timeout));
		}
		try {
			for (let i = 0; i < allPages.length; i++) {
			  	const shapeIds = editor.getPageShapeIds(allPages[i]);
				if (shapeIds.size === 0)
					continue;
				setPagesProgress((prev) => ({loading: prev?.loading + 1, total: prev?.total}));
				try {
					const blob = await exportToBlob({
					editor,
					ids: Array.from(shapeIds),
					format: 'webp',
					opts: {
						bounds: defaultBox,
						padding: 0,
						darkMode: false,
					}
					});
					allBlobs.push(blob);
				
					setProgress((prev) => Math.min((prev || 0) + 100 / (allPages.length || 1), 100));

				} catch (error) {
					logger.error("react:component", "CapsuleToPDFBtn", `Failed to get svgElement in page ${allPages[i].id}`, error);
					setState('error');
				}
			}
		} catch (error) {
			logger.error("react:component", "CapsuleToPDFBtn", "handleExportAllPages", error);
			setState('error');
		}
		if (allBlobs.length === 0)
		{
			setDisabled(false);
			setErrorMsg("Aucune page à exporter ou page vide...");
			setProgress(0);
			setState('error');
			const timeout = setTimeout(() => {
				setErrorMsg(null);
				setOpenDialog(false);
			}, 2000);
			return (() => clearTimeout(timeout));
		}
		const validBlobs = allBlobs.filter(blob => blob.size > 0);
		setProgress(0);
		await createPdf(validBlobs, pdf);
	};

	useEffect(() => {
		const getCapsuleData = async () => {
			const { data, error } = await supabase.from('capsules').select("title, created_at").eq('id', capsuleId).single();
			if (error)
				logger.error("react:component", "CapsuleToPDFBtn", "getCapsuleData", error);
			else
				return (data);
		};
		(async () => {
			if (!isRoom) {
				const data = await getCapsuleData();
				if (data?.title) {
					if (data?.title === "Sans titre")
						setFilename(`capsule-${formatDate(data.created_at, "fr-FR", undefined, true)}.pdf`);
					else
					{
						const title = data?.title
							.normalize('NFD') // Decomposes accented characters into base characters and diacritical marks
							.replace(/[\u0300-\u036f]/g, '') // Removes diacritical marks
							.replace(/[^a-zA-Z0-9]/g, '_'); // Replaces non-alphanumeric characters with underscores
						setFilename(`${title}-${formatDate(data.created_at, "fr-FR", undefined, true)}.pdf`);
					}
				}
			}
		})();
	}, [isRoom, capsuleId, supabase]);

	return (
			<AlertDialog.Root open={openDialog} onOpenChange={setOpenDialog}>
				<AlertDialog.Trigger>
					<Button style={{  width:"100%", justifyContent: 'center' }} onClick={handleExportAllPages} disabled={disabled}>
						<FileDown size='20' style={{ marginRight: '5px' }} />
						<Text>Télécharger en PDF</Text>
					</Button>
				</AlertDialog.Trigger>
				<AlertDialog.Content>
					<AlertDialog.Title>Génération de votre capsule en PDF</AlertDialog.Title>
					
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
};