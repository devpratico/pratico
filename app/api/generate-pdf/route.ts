import createClient from '@/supabase/clients/server';
import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';

export async function OPTIONS() {
    return NextResponse.json({}, { 
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        }
    });
}

// export async function GET(res: NextResponse) {
//     return NextResponse.json({ message: 'GET request received!' });
// }


// export async function POST(req: NextRequest) {
//     try {
//         const body = await req.json();
//         return NextResponse.json({ message: 'POST request received!', data: body });
//     } catch (error) {
//         return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
//     }}


export async function POST(req: NextRequest) {
	const { base64Files } = await req.json();
	if (!base64Files || base64Files.length === 0) {
		return NextResponse.json({ error: "base64Files not provided" }, { status: 400 });
	}

	try {

		const pdfDoc = await PDFDocument.create();

		for (const base64File of base64Files) {
			console.log("BASE64 FILE", base64File);
			if (!base64File.startsWith("data:image/png;base64,")) {
				return NextResponse.json({ error: "Invalid PNG format" }, { status: 400 });
			}
			const base64Data = base64File.replace(/^data:image\/png;base64,/, "");
        	const byteArray = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));

			const image = await pdfDoc.embedPng(byteArray);
			const page = pdfDoc.addPage([image.width, image.height]);

            page.drawImage(image, {
                x: 0,
                y: 0,
				width: image.width,
				height: image.height
            });
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
		console.error('Error generating PDF:', error);
		return (NextResponse.json({ error: 'Error generating PDF' }, { status: 500 }));
	}
}