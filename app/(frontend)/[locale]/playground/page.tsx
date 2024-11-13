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


const ExportAllPagesButton = () => {
 	const editor = useEditor();
	const [ svgPages, setSvgPages ] = useState<any[]>();
	const handleExportAllPages = async () => {
		const allBlobs = [];
		const allPages = editor.getPages();
		if (allPages.length === 0)
			return ;

		for (const page of allPages) {
			const shapeIds = editor.getPageShapeIds(page);
			
			if (shapeIds.size === 0)
				continue ;

				try {
					const blob = await editor.getSvgElement(Array.from(shapeIds));
					allBlobs.push(blob);
				} catch (error) {
					console.error(`Failed to export page ${page.id}:`, error);
				}
				finally {
					setSvgPages(allBlobs);
					console.log(allBlobs);
				}
			};
		}
		

  return (
    <button
      style={{ pointerEvents: 'all', fontSize: 18, backgroundColor: 'lightgreen' }}
      onClick={handleExportAllPages}
    >
      Export All Pages as Images
    </button>
  );
};


// function ExportAllCanvasButton() {


// 	const editor = useEditor()
// 	return (
// 		<button
// 			style={{ pointerEvents: 'all', fontSize: 18, backgroundColor: 'thistle' }}
// 			onClick={async () => {
// 				const shapeIds = editor.getCurrentPageShapeIds()
// 				const pages = editor.getPages();
// 				const blobs: Blob[] = [];
// 				if (pages.length === 0) return alert('No pages to export');
// 				pages.map(async (item) => {
// 					const ids = editor.getPageShapeIds(item);
// 					const blob = await exportToBlob({
// 						editor,
// 						ids: [...ids], // downlevelIteration: true dans tsconfig permet des constructions ES6 même lors de la transpilation vers des versions plus anciennes (comme es5).
// 						format: 'png',
// 						opts: { background: false },
// 					});
// 					blobs.push(blob);
// 				})
				
// 				// blobs.forEach((item) => {
// 				// 	const link = document.createElement('a')
// 				// 		link.href = window.URL.createObjectURL(item)
// 				// 		link.download = 'every-shape-on-the-canvas.jpg'
// 				// 		link.click()
// 				// });
// 				const mergedBlob = new Blob(blobs, { type: 'image/png' });

// 				const link = document.createElement('a');
// 				link.href = window.URL.createObjectURL(mergedBlob);
// 				link.download = 'every-pages.jpg';

// 				link.click();
	
// 			}}
// 		>
// 			Export all canvas as images
// 		</button>
// 	)
// }



function CanvasArea() {
    return <Card variant='classic' style={{width:'1920px', height:'1080px', position:'absolute'}}/>
}

function Background() {
    return <div style={{position:'absolute', backgroundColor:'green', width:'100%', height:'100%'}}></div>
}