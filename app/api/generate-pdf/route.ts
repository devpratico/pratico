import logger from '@/app/_utils/logger';
import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

export function DELETE() {
	const pdfDirectory = path.resolve(process.cwd(), 'public', 'pdfs');
	if (fs.existsSync(pdfDirectory)) {
		const files = fs.readdirSync(pdfDirectory);
		files.forEach(file => {
			const filePath = path.join(pdfDirectory, file);
			fs.unlinkSync(filePath);
		});
		if (fs.readdirSync(pdfDirectory).length === 0)
			fs.rmdirSync(pdfDirectory);
	}

	return (NextResponse.json({ message: 'Fichiers et dossier pour pdf supprimés.' }, { status: 200 }));
}

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
		const pdfDirectory = path.resolve(process.cwd(), 'public', 'pdfs');
		if (!fs.existsSync(pdfDirectory)) {
			fs.mkdirSync(pdfDirectory, { recursive: true });
		}
		const pdfFileName = `${Date.now()}.pdf`;
		const pdfPath = path.join(pdfDirectory, pdfFileName);
		fs.writeFileSync(pdfPath, pdfBytes);
		const pdfUrl = `/pdfs/${pdfFileName}`;
		const end = Date.now();
		logger.log("next:api", "api/generate-pdf", `PDF generated in ${end - beginning}ms`);
		return (NextResponse.json({ pdfUrl, pdfPath, pdfDirectory }, { status: 200 }));
	} catch (error) {
		logger.error("next:api", "api/generate-pdf", "Error generating PDF:", error);
		return (NextResponse.json({ error: 'Error generating PDF' }, { status: 500 }));
	}
}