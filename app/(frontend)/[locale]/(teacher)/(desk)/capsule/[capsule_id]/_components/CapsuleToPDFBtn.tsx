import { useTLEditor } from "@/app/(frontend)/_hooks/useTLEditor";
import { Button } from "@radix-ui/themes";
import jsPDF from "jspdf";
import { FolderDown } from "lucide-react";
import { exportToBlob } from "tldraw";
import "svg2pdf.js";
import { defaultBox } from "@/app/(frontend)/[locale]/_components/canvases/custom-ui/Resizer";
import createClient from "@/supabase/clients/client";
import logger from "@/app/_utils/logger";
import { formatDate } from "@/app/_utils/utils_functions";


export function CapsuleToPDFBtn({capsuleId, isRoom}: {capsuleId: string | string[], isRoom: boolean}) {
	const editor = useTLEditor().editor;
	const supabase = createClient();
	const pdf = new jsPDF('landscape', 'px', 'a4');
	// const pdf = new jsPDF('landscape', 'px', [defaultBox.w, defaultBox.h]);

	const getCapsuleData = async () => {
		const { data, error } = await supabase.from('capsules').select("title, created_at").eq('id', capsuleId).single();
		if (error)
			logger.error("react:component", "CapsuleToPDFBtn", "getCapsuleData", error);
		else
			return (data);
	};
	
	const createPdf = async (blobs: Blob[]) => {

		// const pageWidth =  793.7066666666666; // A4 (landscape) dans jsPDF px: 793.7066666666666 pt: 595.28
		// const pageHeight = 1122.52; // A4 (landscape) dans jsPDF px: 1122.52 pt: 841.89


        const pageWidth = pdf.internal.pageSize.getWidth();
        const elementWidth = defaultBox.w;
        const ratio = pageWidth / elementWidth;

		const promises = blobs.map(async (blob, index) => {
			const svgText = await blob.text();
			const parser = new DOMParser();
			const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
			const svgElement = svgDoc.documentElement;

			await pdf.svg(svgElement, {
				x: 0,
				y: 0,
				width: defaultBox.w * ratio,
				height: defaultBox.h * ratio,
			});
	
		
			if (index < blobs.length - 1) {
			  pdf.addPage();
			}
		  });
		  await Promise.all(promises);
	};
	

	const handleExportAllPages = async () => {
		if (!editor)
			return ;
		const allBlobs: any[] = [];
		const allPages = editor.getPages();
	  	let pdfName = "capsule.pdf";

		if (allPages.length === 0) return;
	  
		const promises = allPages.map(async (page) => {
		  const shapeIds = editor.getPageShapeIds(page);
		  if (shapeIds.size === 0) return;
	  
		  try {
			const blob = await exportToBlob({
			  editor,
			  ids: Array.from(shapeIds),
			  format: 'svg',
			  opts: {
                background: false,
                bounds: defaultBox,
                padding: 0,
            }});
			allBlobs.push(blob);
	
		  } catch (error) {
			logger.error("react:component", "CapsuleToPDFBtn", `Failed to get svgElement in page ${page.id}`, error);
		  }
		});
		await Promise.all(promises);
		await createPdf(allBlobs);

		if (!isRoom)
		{
			const data = await getCapsuleData();
			if (data)
			{
				const title = data?.title === "Sans titre" ? "capsule" : data?.title;
				pdfName = `${title}-${formatDate(data.created_at)}.pdf`
			}
		}
		
		pdf.save(pdfName);
	};
	  

  return (
    <Button style={{ width:"100%", justifyContent: 'center' }} onClick={handleExportAllPages}>
        <FolderDown size='15' /> Exporter la capsule en PDF
    </Button>
  );
}