import logger from '@/app/_utils/logger';
import createClient from '@/supabase/clients/server';
import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';

// export async function OPTIONS() {
//     return NextResponse.json({}, { 
//         headers: {
//             'Access-Control-Allow-Origin': '*',
//             'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
//             'Access-Control-Allow-Headers': 'Content-Type',
//         }
//     });
// }

export async function POST(req: NextRequest) {
	const { base64Datas } = await req.json();
	if (!base64Datas || base64Datas.length === 0) {
		return (NextResponse.json({ error: "base64Data not provided" }, { status: 400 }));
	}
	console.log("ICI BACK ", base64Datas);
	try {

		const pdfDoc = await PDFDocument.create();

		for (const base64Data of base64Datas) {
			if (base64Data.startsWith("data:image/png;base64,")) {
				const data = base64Data.replace(/^data:image\/png;base64,/, "");
				const byteArray = Uint8Array.from(atob(data), (c) => c.charCodeAt(0));

				const image = await pdfDoc.embedPng(byteArray);
				const page = pdfDoc.addPage([image.width, image.height]);

				page.drawImage(image, {
					x: 0,
					y: 0,
					width: image.width,
					height: image.height
				});
			} else if (base64Data.startsWith("data:application/pdf;base64,")) {
				const data = base64Data.replace(/^data:application\/pdf;base64,/, "");
				const byteArray = Uint8Array.from(atob(data), (c) => c.charCodeAt(0));

				const existingPdf = await PDFDocument.load(byteArray);
				const copiedPages = await pdfDoc.copyPages(existingPdf, existingPdf.getPageIndices());

				copiedPages.forEach((page) => pdfDoc.addPage(page));
			} else {
				return (NextResponse.json({ error: "Invalid file format" }, { status: 400 }));
			}
		}
		
		const pdfBytes = await pdfDoc.save();
		const response = new NextResponse(new Uint8Array(pdfBytes), {
			headers: {
				'Content-Type': 'application/pdf',
				"Content-Disposition": 'attachment; filename="document.pdf"'
			},
			status: 200
		});
	
		return (response);
	} catch (error) {
		logger.error("next:api", "api/generate-pdf", "Error generating PDF:", error);
		return (NextResponse.json({ error: 'Error generating PDF' }, { status: 500 }));
	}
}