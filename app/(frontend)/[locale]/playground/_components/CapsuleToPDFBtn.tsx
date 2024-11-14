import {jsPDF} from "jspdf";
import { useState } from "react";
import { exportToBlob, useEditor } from "tldraw";

export function CapsuleToPDF () {
	const editor = useEditor();
	const [svgPages, setSvgPages] = useState<any[]>([]);
	const pdf = new jsPDF('p', 'mm', 'a4');

	const addSvgToPdf = (blob: Blob): Promise<void> => {
		return new Promise((resolve, reject) => {
			const url = URL.createObjectURL(blob);
			window.open(url, '_blank');
			const img = new Image();
			img.src = url;
		
			img.onload = () => {
				pdf.addImage(img, 'PNG', 0, 0, 210, 297);
				URL.revokeObjectURL(img.src);
				resolve();
				console.log("OK");
			};
		
			img.onerror = (error) => {
				console.error('Failed to load the SVG image:', error);
				URL.revokeObjectURL(img.src);
				reject(error);
				console.log(" NOT OK");
			};
		});
	
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
	
			try {
				await addSvgToPdf(blob);
			  } catch (error) {
				console.error(`Error adding page to PDF:`, error);
			  }
			// const testSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"> <rect width="100%" height="100%" fill="red" /> </svg>`;
			// const testBlob = new Blob([testSvg], { type: 'image/svg+xml' });
			// console.log("TEST", testBlob);
			// await addSvgToPdf(testBlob);
		  } catch (error) {
			console.error(`Failed to get svgElement in page ${page.id}`, error);
		  }
		});
	  
		await Promise.all(promises);
		
		pdf.save('output.pdf');
	  
		setSvgPages(allBlobs);
		console.log(allBlobs);
	  };
	  

  return (
    <button
      style={{ pointerEvents: 'all', fontSize: 18, backgroundColor: 'lightgreen' }}
      onClick={handleExportAllPages}
    >
      Export All Pages as Images
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
