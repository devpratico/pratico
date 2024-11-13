'use client';
import { useCallback, useEffect, useState } from "react";
import { createShapeId, Editor, exportToBlob, IndexKey, Tldraw, TLFrameShape, TLPage, TLPageId, TLParentId, TLShape, TLShapeId, TLUiComponents, transact, uniqueId, useEditor, useValue } from "tldraw";
import 'tldraw/tldraw.css'
import { useTLEditor } from "../../_hooks/useTLEditor";
import { CardShapeUtil } from "./_components/ShapeUtilClass";
import { useNav } from "../../_hooks/useNav";
import { Card } from "@radix-ui/themes";

const MyCustomShapes = [CardShapeUtil]

export default function PlayGround () {
	// if (process.env.NODE_ENV === 'production') {
	// 	return (null);
	// }
	const [ editor, setEditor ] = useState<Editor>();
	const [ currentPageId, setCurrentPageId ] = useState<TLPageId>();
	const [ pageIds, setPageIds ] = useState<TLPageId[] | undefined>([]);
	const [ frameIds, setFrameIds ] = useState<{index: number, id: TLShapeId}[]>();
	
	useEffect(() => {
		if (!editor)
			return ;

		const searchId = pageIds?.find((item) => {
			return (item === currentPageId);
		});

		if ((!searchId || !searchId.length) && currentPageId)
		{
			const { x,y,w,h } = editor.getViewportPageBounds();
			const newFrameId = createShapeId();
			editor.createShape<TLFrameShape>({type: 'frame',
				x: x,
				y: y,
				props: {
					w: 1920,
					h: 1080,
				}
			});
			const tmp = { index: frameIds ? frameIds.length + 1 : 0, id: newFrameId};
			setFrameIds((prev) => [...(prev || []), tmp]);
			setPageIds((prev) => [...(prev || []), currentPageId]);
		}
		
	}, [editor, currentPageId, pageIds, frameIds]);
	
    const handleOnMount = useCallback((editor: Editor) => {
		if (editor)
			setEditor(editor);
      
		const { x,y,w,h } = editor.getViewportPageBounds();
		const newFrameId = createShapeId();
		editor.createShape<TLFrameShape>({type: 'frame',
			id: newFrameId,
			x: x,
			y: y,
			props: {
				w: 1920,
				h: 1080,
				// color: 'var(--violet-8)'
			}
		});
		const tmp = { index: frameIds ? frameIds.length + 1 : 0, id: newFrameId};
		setFrameIds((prev) => [...(prev || []), tmp]);
		editor?.sideEffects.registerAfterCreateHandler('page', (newpage) => {

			setCurrentPageId(newpage.id);
			
		});
	
			// editor?.createShape<TLFrameShape>({
			// 		"parentId": "page:somePage" as TLParentId,
			// 		"id": "shape:someId" as TLShapeId,
			// 		"typeName": "shape",
			// 		"type": "frame",
			// 		"x": x,
			// 		"y": y,
			// 		"rotation": 0,
			// 		"index": "a28" as IndexKey,
			// 		"opacity": 1,
			// 		"isLocked": false,
			// 		"props": {
			// 			"w": w,
			// 			"h": h,
			// 		},
			// 		"meta": {},
			//  })
		// })
		// editor.createShape({
		// 	type: 'text',
		// 	x: 200,
		// 	y: 200,
		// 	props: {
		// 		text: 'Hello world!',
		// 	},
		// })

		// editor.selectAll()

		// editor.zoomToSelection({
		// 	animation: { duration: 5000 },
		// })
    }, [setEditor, frameIds]);

	useEffect(() => {
		if (!editor) return
		
			const ids = frameIds?.map((slide) => createShapeId(slide.id));
			const { x,y } = editor.getViewportPageBounds();

			if (!(pageIds && ids && frameIds))
				return ;
			transact(() => {
				for (let i = 0; i < frameIds.length; i++) {
					const shapeId = ids[i];
					const slide = frameIds[i];
					const shape = editor.getShape(shapeId);

					
					if (shape) {
						if (shape.x === 0 && shape.y === 0) continue;
		
						const regex = /Slide \d+/;
						let name = (shape as TLFrameShape).props.name;
						if (regex.test(name)) {
							name = `Slide ${slide.index + 1}`;
						}
		
						editor.updateShape<TLFrameShape>({
							id: shapeId,
							type: 'frame',
							x: x,
							y: y,
							props: {
								name,
							},
						});
					} else {
						editor.createShape<TLFrameShape>({
							id: shapeId,
							parentId: editor.getCurrentPageId(),
							type: 'frame',
							x: x,
							y: y,
							props: {
								name: `Slide ${slide.index + 1}`,
								w: 1920,
								h: 1080,
							},
						});
					}
				}
			});

		const unsubs = [] as (() => void)[]

		unsubs.push(
			editor.sideEffects.registerBeforeChangeHandler('shape', (prev, next) => {
				if (
					ids?.includes(next.id) &&
					(next as TLFrameShape).props.name === (prev as TLFrameShape).props.name
				)
					return prev
				return next
			})
		)

		unsubs.push(
			editor.sideEffects.registerBeforeChangeHandler('instance_page_state', (prev, next) => {
				next.selectedShapeIds = next.selectedShapeIds.filter((id) => !ids?.includes(id))
				if (next.hoveredShapeId && ids?.includes(next.hoveredShapeId)) next.hoveredShapeId = null
				return next
			})
		)

		return () => {
			unsubs.forEach((fn) => fn())
		}
	}, [editor, frameIds, pageIds])

	const components = {
		SharePanel: ExportAllPagesButton,
		Background: Background,
		OnTheCanvas: CanvasArea
	}

	return (
        <div style={{position: 'fixed', inset: 0 }}>
            <Tldraw
                onMount={handleOnMount}
				// persistenceKey="example4"
				// shapeUtils={MyCustomShapes}
				components={components}
            >

            </Tldraw>
        </div>
    )
};


// https://tldraw.dev/examples/data/assets/export-canvas-as-image
function ExportCanvasButton() {
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

import {jsPDF} from "jspdf";

const ExportAllPagesButton = () => {
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


function CanvasArea() {
    return <Card variant='classic' style={{width:'1920px', height:'1080px', position:'absolute'}}/>
}

function Background() {
    return <div style={{position:'absolute', backgroundColor:'green', width:'100%', height:'100%'}}></div>
}