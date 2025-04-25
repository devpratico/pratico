import logger from '@/app/_utils/logger';
import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';

export async function POST(req: NextRequest) {
	try {
		const beginning = Date.now();
		const { blobsUrls } = await req.json();
		if (!Array.isArray(blobsUrls) || blobsUrls.length === 0)
			return NextResponse.json({ error: "No blobs URLs provided" }, { status: 400 });
		logger.log("next:api", "api/generate-pdf", "Downloading capsule...", blobsUrls);
		const pdfDoc = await PDFDocument.create();
		const images = await Promise.all(blobsUrls.map(async (url: string) => {
			const response = await fetch(url);
			const arrayBuffer = await response.arrayBuffer();
			const uint8Array = new Uint8Array(arrayBuffer);
			return (uint8Array);
		}));
		for (const image of images) {
			const img = await pdfDoc.embedJpg(image);
			const page = pdfDoc.addPage([img.width, img.height]);
			page.drawImage(img,
				{ 
					x: 0,
					y: 0,
					width: img.width,
					height: img.height
				});
		}
		logger.log("next:api", "api/generate-pdf", "Saving PDF...");
		const startTime = Date.now();
		const pdfBytes = await pdfDoc.save();
		const endTime = Date.now();
		logger.log("next:api", "api/generate-pdf", `PDF save took ${endTime - startTime}ms`);
		const end = Date.now();
		logger.log("next:api", "api/generate-pdf", `PDF generated in ${end - beginning}ms`);
		return new NextResponse(pdfBytes, {
			status: 200,
			headers: {
				'Content-Type': 'application/pdf',
				'Content-Disposition': 'attachment; filename="generated.pdf"'
			}
		});
	} catch (error) {
		logger.error("next:api", "api/generate-pdf", "Error generating PDF:", error);
		return (NextResponse.json({ error: 'Error generating PDF' }, { status: 500 }));
	}
}