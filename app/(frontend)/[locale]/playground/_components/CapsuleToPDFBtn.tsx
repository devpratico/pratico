import logger from "@/app/_utils/logger";
import {jsPDF} from "jspdf";
import { useState } from "react";
import { exportToBlob, useEditor } from "tldraw";
import "svg2pdf.js";
import { svg2pdf } from "svg2pdf.js";

export function CapsuleToPDF () {
	const editor = useEditor();
	const [svgPages, setSvgPages] = useState<any[]>([]);
	const pdf = new jsPDF();

	const svgToPng = async (svg: string, width: number, height: number): Promise<string> => {
		return new Promise((resolve, reject) => {
			const img = new Image();
			const svgBlob = new Blob([svg], { type: 'image/svg+xml' });
			const url = URL.createObjectURL(svgBlob);
	
			img.onload = () => {
				const canvas = document.createElement('canvas');
				canvas.width = width;
				canvas.height = height;
				const ctx = canvas.getContext('2d');
				if (ctx) {
					ctx.drawImage(img, 0, 0, width, height);
					const pngDataUrl = canvas.toDataURL('image/png');
					URL.revokeObjectURL(url);
					resolve(pngDataUrl);
				} else {
					URL.revokeObjectURL(url);
					reject(new Error('Failed to get canvas context'));
				}
			};
	
			img.onerror = (err) => {
				URL.revokeObjectURL(url);
				reject(err);
			};
	
			img.src = url;
		});
	};
	
	
	const createPdf = async (blobs: Blob[]) => {
		// for (let i = 0; i < blobs.length; i++) {
		// 	const blob = blobs[i];
		// 	const url = URL.createObjectURL(blob);
		// 	const svgElement = await fetch(url).then((res) => res.text());
		// 	fetch(svgElement)
		// 	.then((response) => {
		// 		if (!response.ok) {
		// 		throw new Error('Failed to fetch SVG file');
		// 		}
		// 		return response.text();
		// 	})
		// 	.then((svgText) => {
		// 		const parser = new DOMParser();
		// 		const svgDocument = parser.parseFromString(svgText, 'image/svg+xml');
		// 		const svgElement = svgDocument.documentElement;
		// 		pdf.svg(svgElement);

		// 		const svgAsText = new XMLSerializer().serializeToString(svgElement);

		// 		// pdf.addSvgAsImage(svgAsText, 20, 20, pdf.internal.pageSize.width - 20 * 2, pdf.internal.pageSize.height - 20 * 2, "capsule", false, 0);
		// 	})
		// 	.catch((error) => {
		// 		console.error('Error loading SVG:', error);
		// });

		// 	// try {
		// 	// 	const pngDataUrl = await svgToPng(
		// 	// 		svgElement,
		// 	// 		pdf.internal.pageSize.getWidth(),
		// 	// 		pdf.internal.pageSize.getHeight()
		// 	// 	);

		// 	// 	// pdf.addImage(pngDataUrl, 'SVG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
		// 	// } catch (error) {
		// 	// 	console.error(`Failed to convert SVG to PNG for page ${i}`, error);
		// 	// }
		// 	console.log("SVG ELEMENT", svgElement);
		// 	// pdf.svg(svgElement);
		// 	// pdf.addSvgAsImage(svgElement, 0, 0, pdf.internal.pageSize.width * 2, pdf.internal.pageSize.height * 2, "capsule", true, 0);

		// 	if (i < blobs.length - 1) {
		// 		pdf.addPage();
		// 	}
		// 	URL.revokeObjectURL(url);
		for (const [index, svgBlob] of blobs.entries()) {
			const svgText = await svgBlob.text();
			const parser = new DOMParser();
			const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
			const svgElement = svgDoc.documentElement;
		
			await svg2pdf(svgElement, pdf);
		
			if (index < blobs.length - 1) {
			  pdf.addPage();
			}
		  }
		
		//   return pdf.output("blob");
			window.open(pdf.output('bloburl'), '_blank');
		// }
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
