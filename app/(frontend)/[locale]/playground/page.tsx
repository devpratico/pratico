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

	const extractSvgPaths = (svgContent: string) => {
		const pathMatches = [...svgContent.matchAll(/<path[^>]+d="([^"]+)"/g)];
		return pathMatches.map(match => match[1]);
	};
	let pdfUrl = "";
	try{
		const { data } = await supabase.storage.from('capsules_pdfurl').download('capsule-0.svg');
		const {data: { publicUrl }} = await supabase.storage.from('capsules_pdfurl').getPublicUrl('capsule-0.svg');
		const svg = await data?.text();
		const attachmentBytes = await fetch(publicUrl).then(res => res.arrayBuffer())
		if (!svg)
			return (null);
		const paths = extractSvgPaths(svg)
		const pdfDoc = await PDFDocument.create();
		await pdfDoc.attach(attachmentBytes, "test.svg", { mimeType: "image/svg+xml" });
		console.log("SVG", paths[0]);
		const page = pdfDoc.addPage();

		// paths.forEach(path => page.drawSvgPath(path));
		const pdfBytes = await pdfDoc.save();
		
		const blob = new Blob([pdfBytes], { type: "application/pdf" });
		const link = document.createElement('a');
		link.href = URL.createObjectURL(blob);
		link.download = 'generated.pdf'; 
		link.click();
		// const tmpUrl = URL.createObjectURL(blob);
		// pdfUrl = tmpUrl;
		// URL.revokeObjectURL(tmpUrl);
		// console.log("PDF URL", pdfUrl);
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