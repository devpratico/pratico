import {jsPDF} from "jspdf";
import { useState } from "react";
import { exportToBlob, useEditor } from "tldraw";

export function CapsuleToPDF () {
	const editor = useEditor();
	const [svgPages, setSvgPages] = useState<any[]>([]);
	const pdf = new jsPDF('p', 'mm', 'a4');

 	const addSvgToPdf = async (svgString: string, blob: Blob) => {
	// const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
	const url = URL.createObjectURL(blob);
  
	const img = new Image();
	img.src = url;
  
	img.onload = () => {
  
	  pdf.addSvgAsImage(url, 0, 0, 210, 297);
  
  
	  URL.revokeObjectURL(url);
	};
  
	img.onerror = (error) => {
	  console.error('Failed to load the SVG image:', error);
	};
  };

  const handleExportAllPages = async () => {
    const allSVGs: any[] = [];
    const allPages = editor.getPages();

    if (allPages.length === 0) return;

    for (const page of allPages) {
      const shapeIds = editor.getPageShapeIds(page);

      if (shapeIds.size === 0) continue;

      try {
        const svg = await editor.getSvgElement(Array.from(shapeIds));
        const svgString = await editor.getSvgString(Array.from(shapeIds));
		const blob = await exportToBlob({
			editor,
			ids: Array.from(shapeIds),
			format: 'svg',
			opts: { background: false },
		})

        allSVGs.push(svg);

        if (svgString) {
			console.log(svgString);
          addSvgToPdf(svgString.svg, blob);
        }
      } catch (error) {
        console.error(`Failed to get svgElement in page ${page.id}`, error);
      }
    }
	pdf.save('output.pdf');

    setSvgPages(allSVGs);
    console.log(allSVGs);

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
