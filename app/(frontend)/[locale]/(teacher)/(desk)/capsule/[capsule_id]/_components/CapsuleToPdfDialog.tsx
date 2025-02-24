"use client";
import createClient from "@/supabase/clients/client";
import logger from "@/app/_utils/logger";
import { Flex, Button, Progress, AlertDialog, Card, Text, Box } from "@radix-ui/themes"
import { CircleAlert, CircleCheck, FileDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useFormatter } from "next-intl";
import { useTLEditor } from "@/app/(frontend)/_hooks/contexts/useTLEditor";
import { exportToBlob } from "tldraw";
import { defaultBox } from "@/app/(frontend)/[locale]/_components/canvases/custom-ui/Resizer";

export function CapsuleToPdfDialog({capsuleId, isRoom}: {capsuleId: string | string[], isRoom: boolean})
{
	const { editor } = useTLEditor();
	const supabase = createClient();
	const formatter = useFormatter();
	const [ progress, setProgress ] = useState(0);
	const [ filename, setFilename ] = useState("capsule.pdf");
	const [ pagesProgress, setPagesProgress  ] = useState<{loading: number, total: number}>({loading: 0, total: 0});
	const [ openDialog, setOpenDialog ] = useState(false);
	const [ state, setState ] = useState<'loading' | 'downloading'  | 'error'>('loading');
	const [ errorMsg, setErrorMsg ] = useState<string | null>(null);

	const uploadToSupabase = async (blob: Blob, fileName: string): Promise<string | null> => {
		const { data, error } = await supabase.storage.from('capsules_pdf').upload(fileName, blob, {
			contentType: 'image/png',
			upsert: true
		});
		
		if (error) {
			logger.error("react:component", "uploadToSupabase", error.message);
			return (null);
		}
		
		return (supabase.storage.from('capsules_pdf').getPublicUrl(fileName).data.publicUrl);
	};

	const deleteFileFromSupabaseBucket = async (filePath: string) => {
		const { error } = await supabase.storage.from('capsules_pdf').remove([filePath]);
	
		if (error)
			logger.error("react:component", "CapsuleToPdfDialog", "deleteFileFromSupabaseBucket", error.message);
	}
	  
	
	const getPNGBlobsUrl = async (): Promise<string[] | undefined> => {
		if (!editor) return;
		logger.log("react:component", "CapsuleToPdfDialog", "getPNGBlobsUrl", "getting PNG blobs from all pages");
		setProgress(0);
		const allPages = editor.getPages();
		const allUrls: string[] = [];
	
		if (allPages.length > 0) {
			try {
				setPagesProgress({ loading: 0, total: allPages.length });
				for (let i = 0; i < allPages.length; i++) {
					const shapeIds = editor.getPageShapeIds(allPages[i]);
					if (shapeIds.size === 0)
						continue;
					
					setPagesProgress((prev) => ({ loading: prev.loading + 1, total: prev.total }));
					
					try {
						const blob = await exportToBlob({
							editor,
							ids: Array.from(shapeIds),
							format: 'png',
							opts: {
								bounds: defaultBox,
								padding: 0,
								darkMode: false,
							}
						});
			
						if (blob.size > 0) {
							const url = await uploadToSupabase(blob, `slide_${Date.now()}_${i}.png`);
							if (url)
								allUrls.push(url);
						}
						setProgress((prev) => Math.min((prev || 0) + 100 / (allPages.length || 1), 100));
					} catch (error) {
						logger.error("react:component", "CapsuleToPdfDialog", "getPNGBlobsUrl", `Failed to get blob in page ${allPages[i].id}`, error);
						return;
					}
				}
			} catch (error) {
				logger.error("react:component", "CapsuleToPdfDialog", "getPNGBlobsUrl", error);
				return;
			}
			return (allUrls);
		}
	};
	  

	const handleExportAllPages = async () => {
		const blobsUrls = await getPNGBlobsUrl();
		if (!blobsUrls || blobsUrls.length === 0) {
			setErrorMsg("Échec de la récupération des données de la capsule");
			setState('error');
			setOpenDialog(false);
			return ;
		}
		setState('downloading');
		setProgress(0);
		let progressInterval;
		try {
			progressInterval = setInterval(() => {
				setProgress(prev => Math.min(prev + 5, 95));
			},100);
			
			const response = await fetch('/api/generate-pdf', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ blobsUrls }),
			});
	
			if (!response || !response.ok) {
				setErrorMsg("Échec de la récupération du PDF, réponse vide");
				setState('error');
				setOpenDialog(false);
				throw new Error('Failed to fetch PDF');
			}
			const contentLength = response.headers.get('Content-Length');
			if (contentLength) {
				const total = parseInt(contentLength, 10);
				const reader = response.body?.getReader();
				if (reader) {
					let loaded = 0;
					let lastProgress = 0;
					const chunks: Uint8Array[] = [];
					
					const readStream = async () => {
						while (true) {
							const { done, value } = await reader.read();
							if (done)
								break;
							if (value) {
								loaded += value.length;
								chunks.push(value);
								const progress = (loaded / total) * 100;
								if (progress - lastProgress > 1) {
									lastProgress = progress;
									requestAnimationFrame(() => {
										setPagesProgress(prev => ({
											loading: prev.loading + 1,
											total: prev.total,
										}));
										setProgress(progress);
									});
								}
							}
						}
					};
					await readStream();
					clearInterval(progressInterval);
	
					const blob = new Blob(chunks);
					const url = URL.createObjectURL(blob);
					const link = document.createElement('a');
					link.href = url;
					link.setAttribute('download', filename);
					document.body.appendChild(link);
					link.click();
					link.remove();
					setOpenDialog(false);
					blobsUrls.forEach(async (url) => {
						const fileName = url.split('/').pop();
						if (fileName)
							deleteFileFromSupabaseBucket(fileName);
					});
				}
			}
		} catch (error) {
			logger.error("react:component", "CapsuleToPdfDialog", "Error downloading PDF:", error);
			setOpenDialog(false);
		} finally {
			clearInterval(progressInterval);
		}
	};
	

	useEffect(() => {
		const getCapsuleData = async () => {
			const { data, error } = await supabase.from("capsules").select("title, created_at").eq("id", capsuleId).single();
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
						setFilename(`capsule-${formatter.dateTime(new Date(data.created_at), {dateStyle: 'short', timeStyle: 'short'})
  							.replace(/[\/:]/g, '').replace(' ', '-')}.pdf`);
					else
					{
						const title = data?.title
							.normalize('NFD') // Decomposes accented characters into base characters and diacritical marks
							.replace(/[\u0300-\u036f]/g, '') // Removes diacritical marks
							.replace(/[^a-zA-Z0-9]/g, '_'); // Replaces non-alphanumeric characters with underscores
						setFilename(`${title}-${formatter.dateTime(new Date(data.created_at), {dateStyle: 'short', timeStyle: 'short'})
							.replace(/[\/:]/g, '').replace(' ', '-')}.pdf`);
					}
				}
			}
		})();
	}, [isRoom, capsuleId, supabase, formatter]);

	return (
			<AlertDialog.Root open={openDialog} onOpenChange={setOpenDialog}>
				<AlertDialog.Trigger>
					<Button style={{  width:"100%", justifyContent: 'center' }} onClick={handleExportAllPages}>
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
								{/* <Text size='1'>{`Chargement page ${pagesProgress.loading} sur ${pagesProgress.total}`}</Text> */}
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

async function getBase64FromBlob(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}