import { useTLEditor } from "@/app/(frontend)/_hooks/useTLEditor";
import { Button } from "@radix-ui/themes";
import jsPDF from "jspdf";
import { FolderDown } from "lucide-react";
import { exportToBlob } from "tldraw";
import "svg2pdf.js";

export function CapsuleToPDF() {
	const editor = useTLEditor().editor;
	const pdf = new jsPDF('landscape', 'px', 'a4');	
	
	const createPdf = async (blobs: Blob[]) => {

		const screenWidth = window.innerWidth;
		const screenHeight = window.innerHeight;

		const pageWidth =  793.706; // A4 (landscape) dans jsPDF px: 793.7066666666666 pt: 595.28
		const pageHeight = 1122.52; // A4 (landscape) dans jsPDF px: 1122.52 pt: 841.89

		const promises = blobs.map(async (blob, index) => {
			const svgText = await blob.text();
			const parser = new DOMParser();
			const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
			const svgElement = svgDoc.documentElement;
	
			const scale = Math.min(pageWidth / screenWidth, pageHeight / screenHeight);
	
			await pdf.svg(svgElement, {
				x: svgElement.getBoundingClientRect().x,
				y: svgElement.getBoundingClientRect().y,
				width: pageWidth * scale,
				height: pageHeight * scale, 
			});
	
		
			if (index < blobs.length - 1) {
			  pdf.addPage();
			}
		  });
		  await Promise.all(promises);
		
		//   return pdf.output("blob");
		window.open(pdf.output('bloburl'), '_blank');
	};
	

	const handleExportAllPages = async () => {
		if (!editor)
			return ;
		const allBlobs: any[] = [];
		const allPages = editor.getPages();
	  
		if (allPages.length === 0) return;
	  
		const promises = allPages.map(async (page) => {
		  const shapeIds = editor.getPageShapeIds(page);
			console.log("PAGE", page);
		  if (shapeIds.size === 0) return;
	  
		  try {
			const blob = await exportToBlob({
			  editor,
			  ids: Array.from(shapeIds),
			  format: 'svg',
			  opts: { background: false },
			});
			if (blob) {
				console.log('Blob created successfully:', blob);
			} else {
				console.error('Blob is null or undefined');
			}
			allBlobs.push(blob);
	
		  } catch (error) {
			console.error(`Failed to get svgElement in page ${page.id}`, error);
		  }
		});
		await Promise.all(promises);
		await createPdf(allBlobs);

		
		// pdf.save('output.pdf');

		console.log("ALL BLOBS", allBlobs);
	  };
	  

  return (
    <Button variant='outline' style={{ justifyContent: 'start' }} onClick={handleExportAllPages}>
        <FolderDown size='15' /> Exporter
    </Button>
  );
}