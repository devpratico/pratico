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
		  
		const fetchWithTimeout = async (url: string, timeout: number) => {
			const timeoutPromise = new Promise<never>((_, reject) => 
			setTimeout(() => reject(new Error(`Timeout after ${timeout}ms`)), timeout)
			);
		
			const fetchPromise = fetch(url).then(response => {
			if (!response.ok) throw new Error(`Failed to fetch ${url}`);
			return response.arrayBuffer();
			});
		
			return Promise.race([fetchPromise, timeoutPromise]);
		};
		
		const fetchImage = async (url: string) => {
			try {
				const buffer = await fetchWithTimeout(url, 5000);
				return Buffer.from(buffer);
			} catch (err) {
				logger.error("next:api", "api/generate-pdf", `Error fetching image ${url}:`, err);
				throw err;
			}
		};
		
		const images = await Promise.all(blobsUrls.map(fetchImage));
		for (const image of images) {
			const img = await pdfDoc.embedPng(image);
			const page = pdfDoc.addPage([img.width, img.height]);

			page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height});
			
		}
		logger.log("next:api", "api/generate-pdf", "Saving PDF...");
		const startTime = Date.now();
		const pdfBytes = await pdfDoc.save();
		const endTime = Date.now();
		logger.log("next:api", "api/generate-pdf", `PDF save took ${endTime - startTime}ms`);
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
		const { data: { publicUrl } } = supabase.storage.from('capsules_pdf').getPublicUrl(data.path);
		const path = data.path;

		return NextResponse.json({ publicUrl, path }, { status: 200 });
	} catch (error) {
		logger.error("next:api", "api/generate-pdf", "Error generating PDF:", error);
		return NextResponse.json({ error: 'Error generating PDF' }, { status: 500 });
	}
}
