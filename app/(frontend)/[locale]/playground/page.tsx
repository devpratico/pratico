import { PDFDocument } from 'pdf-lib';
import { PfdClient } from './PdfClient';
import createClient from '@/supabase/clients/server';
import { Box, Flex, Heading } from '@radix-ui/themes';
import { FlaskConical } from 'lucide-react';

export default async function PlayGround () {
	if (process.env.NODE_ENV === 'production') {
		return (null);
	}
	
	// const supabase = createClient();
	// const capsuleId = "10c07317-af38-4014-9f4c-b86725faff03";
	// let pdfUrl = "";
	// try
	// {
	// 	const { data, error } = await supabase.from('capsules').select('metadata').eq('id', capsuleId).single<any>();
	// 	if (error) {
	// 		console.error("Error fetching metadata:", error);
	// 		return (null);
	// 	}
	// 	if (!data || data.length === 0) 
	// 		return (null);
	// 	const svgPaths: string[] = Array.isArray(data.metadata.data)
    //     ? data.metadata.data
    //     : Object.values(data.metadata.data);

	// 	const pdfDoc = await PDFDocument.create();

	// 	for (const path of svgPaths) {
	// 		if (typeof path !== "string") {
	// 			console.error("Invalid SVG path:", path);
	// 			continue;
	// 		}

	// 		const page = pdfDoc.addPage();
	// 		page.drawSvgPath(path, {
	// 			x: 50,
	// 			y: page.getHeight() - 50
	// 		});
	// 	}

	// 	const pdfUrl = await pdfDoc.save();
	// 	console.log("PDF URL", pdfUrl);
	// 	return (
	// 		<Box p="9" style={{ justifyContent: 'center', backgroundColor: "var(--gray-5)" }}>
	// 			<Flex gap="5" direction="column" align="center">
	// 				<Heading><FlaskConical color="green" /> This is the playground, baby ! <FlaskConical color="green" /></Heading>
	// 				<PfdClient />
	// 			</Flex>
	// 		</Box>
	// 	)

	// } catch (error) {
	// 	console.error("Failed to create PDF", error);
	// }
	
	return (
		<Box p="9" style={{ justifyContent: 'center', backgroundColor: "var(--gray-5)" }}>
			<Flex gap="5" direction="column" align="center">
				<Heading><FlaskConical color="green" /> This is the playground, baby ! <FlaskConical color="green" /></Heading>
				<PfdClient />
			</Flex>
		</Box>
	)
};