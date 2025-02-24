import logger from '@/app/_utils/logger';
import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';

export async function POST(req: NextRequest) {
	const formData = await req.formData();
	const blobs = [];
	for (const [key, value] of formData.entries()) {
		const blob = value as Blob;
		blobs.push(blob);
	}
	if (!blobs || blobs.length === 0) {
		return (NextResponse.json({ error: "base64Data not provided" }, { status: 400 }));
	}
	
	try {
		const pdfDoc = await PDFDocument.create();
		for (const blob of blobs) {
			const buffer = Buffer.from(await blob.arrayBuffer());
			const img = await pdfDoc.embedJpg(buffer);
			const page = pdfDoc.addPage([img.width, img.height]);
			page.drawImage(img, { x: 0, y: 0 });
		}
		const pdfBytes = await pdfDoc.save();
		const pdfBuffer = new Uint8Array(pdfBytes);
		const contentLength = pdfBuffer.byteLength.toString();
		const response = new NextResponse(pdfBuffer, {
			headers: {
				'Content-Type': 'application/pdf',
				"Content-Disposition": 'attachment; filename="document.pdf"',
				'Content-Length': contentLength
			},
			status: 200
		});
	
		return (response);
	} catch (error) {
		logger.error("next:api", "api/generate-pdf", "Error generating PDF:", error);
		return (NextResponse.json({ error: 'Error generating PDF' }, { status: 500 }));
	}
}