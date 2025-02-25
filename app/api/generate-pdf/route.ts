import logger from '@/app/_utils/logger';
import createClient from '@/supabase/clients/server';
import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';

export async function POST(req: NextRequest) {
	try {
		const { blobsUrls } = await req.json();
		if (!Array.isArray(blobsUrls) || blobsUrls.length === 0)
			return NextResponse.json({ error: "No blobs URLs provided" }, { status: 400 });

		logger.log("next:api", "api/generate-pdf", "Downloading capsule...", blobsUrls);

		const pdfDoc = await PDFDocument.create();

		const images = await Promise.all(blobsUrls.map(async (url) => {
			const response = await fetch(url);
			if (!response.ok) throw new Error(`Failed to fetch ${url}`);
			const buffer = Buffer.from(await response.arrayBuffer());
			return (buffer);
		}));
		for (const image of images) {
			const img = await pdfDoc.embedPng(image);
			const page = pdfDoc.addPage([img.width, img.height]);

			page.drawImage(img, { x: 0, y: 0 });
			
		}
		logger.log("next:api", "api/generate-pdf", "Saving PDF...");
		const pdfBytes = await pdfDoc.save();
		const supabase = createClient();
		const { data, error } = await supabase.storage
		.from('capsules_pdf')
		.upload(`pdf_${Date.now()}.pdf`, pdfBytes, {
			contentType: 'application/pdf',
			upsert: true,
		});

		if (error) {
			console.error("Erreur lors de l'upload dans Supabase Storage:", error);
			return NextResponse.json({ error: 'Erreur lors de l\'upload du PDF' }, { status: 500 });
		}
		const publicURL = supabase.storage.from('capsules_pdf').getPublicUrl(data.path).data.publicUrl;
		const pdfResponse = await fetch(publicURL);
		supabase.storage.from('capsules_pdf').remove([data.path]);
		if (!pdfResponse.ok)
			throw new Error(`Failed to fetch ${publicURL}`);
		const pdfBuffer = new Uint8Array(await pdfResponse.arrayBuffer());

		return new NextResponse(pdfBuffer, {
			headers: {
				'Content-Type': 'application/pdf',
				'Content-Disposition': 'attachment; filename="document.pdf"',
				'Content-Length': pdfBuffer.byteLength.toString(),
			},
			status: 200,
		});
	} catch (error) {
		logger.error("next:api", "api/generate-pdf", "Error generating PDF:", error);
		return NextResponse.json({ error: 'Error generating PDF' }, { status: 500 });
	}
}
