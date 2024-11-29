"use client";

import { Flex, Button, Progress, AlertDialog, RadioGroup, Heading, Card, Text, Box } from "@radix-ui/themes"
import { CircleCheck, FolderDown } from "lucide-react";
import { useEffect, useState } from "react";

// halfwayProgress is a boolean that is true when the pages are converted in webp blob and false when the pdf is being gerenated
export function DownloadProgressDialog({pagesInfos, progress, disabled, halfwayProgress, setHalfwayProgress, filename}:
	{pagesInfos: {loading: number, total: number}, progress: number, disabled: boolean, halfwayProgress: boolean, setHalfwayProgress: (value: boolean) => void, filename: string})
{
	const [state, setState] = useState<'idle' | 'loading' | 'uploading' >('idle')
	const [ openDialog, setOpenDialog ] = useState(state == 'idle' ? false : true);
	const [ success, setSuccess ] = useState(false);
    const [pagesProgress, setPagesProgress] = useState<{ loading: number, total: number }>({ loading: 0, total: 0 })

	useEffect(() => {
		if (disabled)
		{
			if (halfwayProgress)
				setState("loading");
			else
			{
				setSuccess(true);
				setState("uploading");
			}
			setOpenDialog(true);
		}
		else
		{
			setState("idle");
			setSuccess(false);
			setOpenDialog(false);
		}
	}, [disabled, halfwayProgress, openDialog]);

	useEffect(() => {
		setPagesProgress({ loading: pagesInfos.loading, total: pagesInfos.total});
	}, [pagesInfos]);

	return (
			<AlertDialog.Root open={openDialog} onOpenChange={setOpenDialog}>

				<AlertDialog.Content>
					<AlertDialog.Title>Génération de votre capsule en PDF</AlertDialog.Title>
					
					<Card variant='surface' my='4'>
						
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


						{/* SUCCESS */}
						<Flex align='center' style={{justifyContent:'space-around'}} gap='3' display={success ? 'flex' : 'none'}>

							<Flex mb="5" align='center' gap='1' style={{ color: 'var(--green)' }}>
								<CircleCheck size='15' style={{ color: 'var(--green)' }} />
								<Text trim='both'>{`Conversion réussie, téléchargement du PDF en cours...`}</Text>
							</Flex>
						</Flex>

						{/* UPLOADING */}
						<Flex direction='column' align='center' gap='3' display={state == 'uploading' ? 'flex' : 'none'}>

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