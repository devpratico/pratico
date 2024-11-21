import logger from "@/app/_utils/logger";
import {jsPDF} from "jspdf";
import { create } from "lodash";
import { useState } from "react";
import { exportToBlob, useEditor } from "tldraw";

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
		for (let i = 0; i < blobs.length; i++) {
			const blob = blobs[i];
			const url = URL.createObjectURL(blob);
			const svgElement = await fetch(url).then((res) => res.text());
	
			try {
				const pngDataUrl = await svgToPng(
					svgElement,
					pdf.internal.pageSize.getWidth(),
					pdf.internal.pageSize.getHeight()
				);
				pdf.addImage(pngDataUrl, 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
			} catch (error) {
				console.error(`Failed to convert SVG to PNG for page ${i}`, error);
			}
	
			if (i < blobs.length - 1) {
				pdf.addPage();
			}
			URL.revokeObjectURL(url);
			// window.open(pdf.output('bloburl'), '_blank');
		}
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

		
		pdf.save('output.pdf');

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
