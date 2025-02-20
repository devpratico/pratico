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
	const { capsuleId } = await req.json();
	const supabase = createClient();
	try {
		const { data, error } = await supabase
			.from("capsules")
			.select("metadata")
			.eq('id', capsuleId)
			.single<{ metadata: { data?: Record<string, string> | string[] } }>();
	
		if (error) {
			console.error('Error fetching capsule data:', error);
			return NextResponse.json({ error: 'Error fetching capsule data' }, { status: 500 });
		}
		if (!data || !data.metadata) {
			console.error('Metadata not found in capsule data');
			return NextResponse.json({ error: 'Metadata not found in capsule data' }, { status: 404 });
		}
		const metadata = data.metadata as { data?: Record<string, string> | string[] };
		if (!("data" in metadata)) {
			console.error('Data not found in metadata');
			return NextResponse.json({ error: 'Data not found in metadata' }, { status: 404 });
		}
		const svgPaths: string[] = Array.isArray(metadata.data)
			? metadata.data
			: Object.values(metadata.data || {});
		console.log("SVG Paths", svgPaths);
		const pdfDoc = await PDFDocument.create();
		const page = pdfDoc.addPage();
		page.drawSvgPath(svgPaths.join(' '));
	
		const pdfBytes = await pdfDoc.save();
		const response = new NextResponse(Buffer.from(pdfBytes), {
			headers: {
			'Content-Type': 'application/pdf',
			},
		});
	
		return (response);
	} catch (error) {
		console.error('Error generating PDF:', error);
		return (NextResponse.json({ error: 'Error generating PDF' }, { status: 500 }));
	}
}