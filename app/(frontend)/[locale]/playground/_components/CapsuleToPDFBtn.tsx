import logger from "@/app/_utils/logger";
import {jsPDF} from "jspdf";
import { useState } from "react";
import { exportToBlob, useEditor } from "tldraw";
import "svg2pdf.js";
import { svg2pdf } from "svg2pdf.js";

export function CapsuleToPDF () {
	const editor = useEditor();
	const [svgPages, setSvgPages] = useState<any[]>([]);
	const pdf = new jsPDF("landscape", "px", "a4");	
	
	const createPdf = async (blobs: Blob[]) => {
		const promises = blobs.map(async (blob, index) => {
			const svgText = await blob.text();
			const parser = new DOMParser();
			const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
			const svgElement = svgDoc.documentElement;
			const scale = 72 / 96; // pixels to points
			// await svg2pdf(svgElement, pdf);
			// await svg2pdf(svgElement, pdf, {x: svgElement.getBoundingClientRect().x, y: svgElement.getBoundingClientRect().y, width: svgElement.clientWidth, height: svgElement.clientHeight});
			console.log("SVG ELEMENT", svgElement.clientHeight, svgElement.clientWidth, svgElement.getBoundingClientRect().x, svgElement.getBoundingClientRect().y);
			
			await pdf.svg(svgElement, {width: 630, height: 500});
		
			if (index < blobs.length - 1) {
			  pdf.addPage();
			}
		  });
		  await Promise.all(promises);
		
		//   return pdf.output("blob");
		window.open(pdf.output('bloburl'), '_blank');
	};
	

	const handleExportAllPages = async () => {
		const allBlobs: any[] = [];
		const allPages = editor.getPages();
	  
		if (allPages.length === 0) return;
	  
		const promises = allPages.map(async (page) => {
		  const shapeIds = editor.getPageShapeIds(page);
	  
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
		// setSvgPages(allBlobs);
		await createPdf(allBlobs);

		
		// pdf.save('output.pdf');

		console.log("ALL BLOBS", allBlobs);
	  };
	  

  return (
    <button
      style={{ pointerEvents: 'all', fontSize: 18, backgroundColor: 'lightgreen' }}
      onClick={handleExportAllPages}
    >
	<>
      Export All Pages as Images
	</>
    </button>
  );
};

	
// https://tldraw.dev/examples/data/assets/export-canvas-as-image
export function ExportCanvasButton() {
	const editor = useEditor()
	return (
		<button
			style={{ pointerEvents: 'all', fontSize: 18, backgroundColor: 'thistle' }}
			onClick={async () => {
				const shapeIds = editor.getCurrentPageShapeIds()
				if (shapeIds.size === 0) return alert('No shapes on the canvas')
				const blob = await exportToBlob({
					editor,
					ids: [...shapeIds], // downlevelIteration: true dans tsconfig permet des constructions ES6 même lors de la transpilation vers des versions plus anciennes (comme es5).
					format: 'png',
					opts: { background: false },
				})

				const link = document.createElement('a')
				link.href = window.URL.createObjectURL(blob)
				link.download = 'every-shape-on-the-canvas.jpg'
				link.click()
			}}
		>
			Export canvas as image
		</button>
	)
}
