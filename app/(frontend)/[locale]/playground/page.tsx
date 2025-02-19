import { PDFDocument } from 'pdf-lib';
import { PfdClient } from './PdfClient';
import createClient from '@/supabase/clients/server';
import { Box, Flex, Heading } from '@radix-ui/themes';
import { FlaskConical } from 'lucide-react';

export default async function PlayGround () {
	if (process.env.NODE_ENV === 'production') {
		return (null);
	}
	
	const supabase = createClient();
	const capsuleId = "77535f1a-c672-43ab-b62f-511305b8f4ef";
	let pdfUrl = "";
	try
	{
		const { data, error } = await supabase.from('capsules').select('metadata').eq('id', capsuleId).single<any>();
		if (error) {
			console.error("Error fetching metadata:", error);
			return (null);
		}
		console.log("DATA", data);
		if (!data || data.length === 0) 
			return (null);
		const blobUrls: string[] = data.metadata?.data ? [data.metadata.data] : [];
		const pdfDoc = await PDFDocument.create();
		for (let i = 0; i < blobUrls.length; i++) {
			const blobUrl = blobUrls[i];
			
			const pngImage = await pdfDoc.embedPng(blobUrl);
			const page = pdfDoc.addPage();
			page.drawImage(pngImage, {
				x: 0,
				y: 0,
				width: page.getWidth(),
				height: page.getHeight(),
			});
		}

		const pdfBytes = await pdfDoc.save();
		const blob = new Blob([pdfBytes], { type: "application/pdf" });
		pdfUrl = URL.createObjectURL(blob);
		console.log("PDF URL", pdfUrl);

	} catch (error) {
		console.error("Failed to create PDF", error);
	}
	
	return (
		<Box p="9" style={{ justifyContent: 'center', backgroundColor: "var(--gray-5)" }}>
			<Flex gap="5" direction="column" align="center">
				<Heading><FlaskConical color="green" /> This is the playground, baby ! <FlaskConical color="green" /></Heading>
				<PfdClient pdfUrl={pdfUrl} />
			</Flex>
		</Box>
	)
};