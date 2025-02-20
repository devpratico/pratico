"use client";
import { PDFDocument } from 'pdf-lib';
import { PfdClient } from './PdfClient';
import createClient from '@/supabase/clients/client';
import { Box, Flex, Heading, Button, AlertDialog, Text, Card, Progress } from '@radix-ui/themes';
import { FileDown, FlaskConical } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function PlayGround () {
	const supabase = createClient();
	const [filename, setFilename] = useState('');
	const [progress, setProgress] = useState(0);
	const [ openDialog, setOpenDialog ] = useState(false);
	const [ disabled, setDisabled ] = useState(false);
	const capsuleId = "6744ce33-0da8-49e7-94fa-87f93e8463cc";
	// if (process.env.NODE_ENV === 'production') {
	// 	return (null);
	// }
	

	
	useEffect(() => {
	const getCapsuleData = async () => {
		const { data, error } = await supabase.from('capsules').select('title, created_at').eq('id', capsuleId).single();
		if (error) {
		console.error('Error fetching capsule data:', error);
		} else {
		return data;
		}
	};

	(async () => {
		const data = await getCapsuleData();
		if (data?.title) {
			if (data?.title === 'Sans titre') {
			setFilename(
				`capsule-${new Date(data.created_at)
				.toISOString()
				.replace(/[\/:]/g, '')
				.replace(' ', '-')}.pdf`
			);
			} else {
			const title = data?.title
				.normalize('NFD')
				.replace(/[\u0300-\u036f]/g, '')
				.replace(/[^a-zA-Z0-9]/g, '_');
			setFilename(
				`${title}-${new Date(data.created_at)
				.toISOString()
				.replace(/[\/:]/g, '')
				.replace(' ', '-')}.pdf`
			);
			}
		}
	})();
	}, [supabase]);

	const handleExportAllPages = async () => {
	try {
		interface ProgressEvent {
			total: number;
			loaded: number;
		}

		interface GeneratePdfResponse {
			data: Blob;
		}

		const response: GeneratePdfResponse | undefined = await fetch('/api/generate-pdf', {
			method: 'POST',
			headers: {
			'Content-Type': 'application/json',
			},
			body: JSON.stringify({ capsuleId }),
		}).then(async (res) => {
			const contentLength = res.headers.get('Content-Length');
			if (contentLength) {
				const total = parseInt(contentLength, 10);
				const reader = res.body?.getReader();
				if (reader) {
					let loaded = 0;
					const read = async () => {
						const { done, value } = await reader.read();
						if (done) {
							return;
						}
						if (value) {
							loaded += value.length;
							setProgress((loaded / total) * 100);
							read();
						}
					};
					read();
				}
			}
			const data = await res.blob();
			return { data };
		}).catch(() => undefined);
		if (!response) {
			throw new Error('Failed to fetch PDF');
		}
		const url = window.URL.createObjectURL(new Blob([response.data]));
		const link = document.createElement('a');
		link.href = url;
		link.setAttribute('download', filename);
		document.body.appendChild(link);
		link.click();
		link.remove();
		setOpenDialog(false);
	} catch (error) {
		console.error('Error downloading PDF:', error);
		setOpenDialog(false);
	}
	};

	return (
		<AlertDialog.Root open={openDialog} onOpenChange={setOpenDialog}>
			<AlertDialog.Trigger>
			<Button style={{ width: '100%', justifyContent: 'center' }} onClick={handleExportAllPages} disabled={disabled}>
				<FileDown size='20' style={{ marginRight: '5px' }} />
				<Text>Télécharger en PDF</Text>
			</Button>
			</AlertDialog.Trigger>
			<AlertDialog.Content>
				<AlertDialog.Title>Capsule en PDF</AlertDialog.Title>
				<AlertDialog.Description>Telechargement en cours</AlertDialog.Description>
			<Card variant='surface' my='4'>
				<Flex direction='column' align='center' gap='3'>
				<Box width='100%'>
					<Progress value={progress} />
				</Box>
				</Flex>
			</Card>
			</AlertDialog.Content>
		</AlertDialog.Root>
	);
};

