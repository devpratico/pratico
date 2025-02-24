import logger from '@/app/_utils/logger';
import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';

export async function POST(req: NextRequest) {
	try {
		const { blobsUrls } = await req.json();
		console.log("API BLOBVS", blobsUrls);
		if (!Array.isArray(blobsUrls) || blobsUrls.length === 0)
			return NextResponse.json({ error: "No blobs URLs provided" }, { status: 400 });

		logger.log("next:api", "api/generate-pdf", "Downloading capsule...", blobsUrls);

		const pdfDoc = await PDFDocument.create();

		for (const url of blobsUrls) {
			try {
				const response = await fetch(url);
				if (!response.ok) throw new Error(`Failed to fetch ${url}`);

				const buffer = Buffer.from(await response.arrayBuffer());
				const img = await pdfDoc.embedPng(buffer);
				const page = pdfDoc.addPage([img.width, img.height]);

				page.drawImage(img, { x: 0, y: 0 });
			} catch (error) {
				logger.error("next:api", "api/generate-pdf", `Error processing ${url}:`, error);
			}
			}

			const pdfBytes = await pdfDoc.save();
			const pdfBuffer = new Uint8Array(pdfBytes);

			return new NextResponse(pdfBuffer, {
			headers: {
				'Content-Type': 'application/pdf',
				"Content-Disposition": 'attachment; filename="document.pdf"',
				'Content-Length': pdfBuffer.byteLength.toString()
			},
			status: 200
		});
	} catch (error) {
		logger.error("next:api", "api/generate-pdf", "Error generating PDF:", error);
		return NextResponse.json({ error: 'Error generating PDF' }, { status: 500 });
	}
}
