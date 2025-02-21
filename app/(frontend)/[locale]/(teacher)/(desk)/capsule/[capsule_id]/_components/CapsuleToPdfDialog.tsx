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

interface GeneratePdfResponse {
	data: Blob;
}
export function CapsuleToPdfDialog({capsuleId, isRoom}: {capsuleId: string | string[], isRoom: boolean})
{
	const { editor } = useTLEditor();
	const supabase = createClient();
	const formatter = useFormatter();
	const [ disabled, setDisabled ] = useState(false);
	const [ progress, setProgress ] = useState(0);
	const [ filename, setFilename ] = useState("capsule.pdf");
	const [ pagesProgress, setPagesProgress  ] = useState<{loading: number, total: number}>({loading: 0, total: 0});
	const [ openDialog, setOpenDialog ] = useState(false);
	const [ state, setState ] = useState<'loading' | 'downloading'  | 'error'>('loading');
	const [ errorMsg, setErrorMsg ] = useState<string | null>(null);
	const [ base64Datas, setBase64Datas ] = useState<string[]>([]);

	useEffect(() => {
		const getBase64Data = async () => {
			if (!editor)
				return ;
            logger.log("react:component", "AutoSaver", "Saving PNG base 64 to capsules table, metadata column");
            const allPages = editor.getPages();
            const allBlobs: Blob[] = [];
            if (allPages.length > 0) {
                try {
                    for (let i = 0; i < allPages.length; i++) {
                        const shapeIds = editor.getPageShapeIds(allPages[i]);
                        if (shapeIds.size === 0)
                            continue;
    
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
                            if (blob.size > 0)
                                allBlobs.push(blob);
                        } catch (error) {
                            logger.error("react:component", "CapsuleToSVGBtn", `Failed to get svgElement in page ${allPages[i].id}`, error);
                        }
                    }
                } catch (error) {
                    logger.error("react:component", "CapsuleToSVGBtn", "handleExportAllPages", error);
                }
    
                const allBase64 = await Promise.all(allBlobs.map(async (blob) => {
                    if (blob.size > 0)
                    {
                        const base64data = await getBase64FromBlob(blob);
                        return (base64data);
                    }
                }));
				const filteredBase64 = allBase64.filter((base64): base64 is string => base64 !== undefined);
				if (filteredBase64.length > 0) {
					setBase64Datas(filteredBase64);
				}
            }
        }
        getBase64Data();
	}, [capsuleId, editor, supabase]);
	const handleExportAllPages = async () => {
	
		try {
			const response: GeneratePdfResponse | undefined = await fetch('/api/generate-pdf', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ base64Datas }),
				})
				.then(async (res) => {
					if (!res.ok) throw new Error("Server returned an error while generating PDF");

					const contentLength = res.headers.get('Content-Length');
					if (contentLength) {
						const total = parseInt(contentLength, 10);
						const reader = res.body?.getReader();
						if (reader) {
							let loaded = 0;
							const read = async () => {
								const { done, value } = await reader.read();
								if (done) return;
								if (value) {
									loaded += value.length;
									setProgress((loaded / total) * 100);
									await read();
								}
							};
							await read();
						}
					}
					return ({ data: await res.blob() });
				})
				.catch((error) => {
					logger.error("react:component", "CapsuleToPDFDialog", "Error fetching PDF:", error);
					setErrorMsg(`Échec de la récupération du PDF avec erreur: ${error}`);
					setState('error');
					return (undefined);
				});

				if (!response) {
					setErrorMsg("Échec de la récupération du PDF, reponse vide");
					setState('error');
					throw new Error('Failed to fetch PDF');
				}

				const url = window.URL.createObjectURL(response.data);
				const link = document.createElement('a');
				link.href = url;
				link.setAttribute('download', filename);
				document.body.appendChild(link);
				link.click();
				link.remove();
				setOpenDialog(false);
			} catch (error) {
				logger.error("react:component", "CapsuleToPdfDialog", "Error downloading PDF:", error);
				setOpenDialog(false);
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

async function getBase64FromBlob(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}


const fileToBase64 = (file: File): Promise<string> => {
	return new Promise((resolve, reject) => {
	  const reader = new FileReader();
	  reader.readAsDataURL(file);
	  reader.onload = () => resolve(reader.result as string);
	  reader.onerror = (error) => reject(error);
	});
  };
  
const base64ToFile = (base64: string, filename: string): File => {
	const arr = base64.split(',');
	const mime = arr[0].match(/:(.*?);/)![1];
	const bstr = atob(arr[1]);
	let n = bstr.length;
	const u8arr = new Uint8Array(n);
	while (n--) {
	  u8arr[n] = bstr.charCodeAt(n);
	}
	return new File([u8arr], filename, { type: mime });
  };
  