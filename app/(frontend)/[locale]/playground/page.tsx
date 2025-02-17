import { PDFDocument } from 'pdf-lib';
import { PfdClient } from './PdfClient';
import createClient from '@/supabase/clients/server';

export default async function PlayGround () {
	if (process.env.NODE_ENV === 'production') {
		return (null);
	}
	
const supabase = createClient();

		const extractSvgPaths = (svgContent: string) => {
			const pathMatches = [...svgContent.matchAll(/<path[^>]+d="([^"]+)"/g)];
			return pathMatches.map(match => match[1]);
		};
	
		const { data } = await supabase.storage.from('capsules_pdfurl').download('capsule1.svg');
		const { data: url } = supabase.storage.from('capsules_pdfurl').getPublicUrl('capsule1.svg');
		const svg = await data?.text();
		
		if (!svg)
			return (null);
		const paths = extractSvgPaths(svg);
		
		console.log(paths);
		
	
		// const {data} = await supabase.storage.from('capsules_pdfurl').download('capsule1.svg');

		// const svg = await data?.text();

		

		const pdfDoc = await PDFDocument.create();
		const page = pdfDoc.addPage();
		console.log("SVG", paths[0]);
		paths.forEach(path => page.drawSvgPath(path));
		const pdfBytes = await pdfDoc.save();
		const blob = new Blob([pdfBytes], { type: "application/pdf" });
		
		const pdfUrl = URL.createObjectURL(blob);
		console.log("PDF URL", pdfUrl);
		if (!pdfUrl)
			return (null);
	return (
		<PfdClient pdfUrl={pdfUrl} />
	)
};