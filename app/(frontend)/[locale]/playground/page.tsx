'use client';
import { useCallback, useEffect, useState } from "react";
import { createShapeId, Editor, exportToBlob, IndexKey, Tldraw, TLFrameShape, TLPageId, TLParentId, TLShape, TLShapeId, TLUiComponents, uniqueId, useEditor } from "tldraw";
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
	
	useEffect(() => {
		if (!editor)
			return ;

		const searchId = pageIds?.find((item) => {
			return (item === currentPageId);
		});

		if ((!searchId || !searchId.length) && currentPageId)
		{
			const { x,y,w,h } = editor.getViewportPageBounds();
			editor.createShape<TLFrameShape>({type: 'frame',
				x: x,
				y: y,
				isLocked: true,

				props: {
					w: w,
					h: h,
				}
			});
			setPageIds((prev) => [...(prev || []), currentPageId]);
		}
		
	}, [editor, currentPageId, pageIds]);
	
    const handleOnMount = useCallback((editor: Editor) => {
		if (editor)
			setEditor(editor);
      
		const { x,y,w,h } = editor.getViewportPageBounds();
		editor.createShape<TLFrameShape>({type: 'frame',
			x: x,
			y: y,
			isLocked: true,
			props: {
				w: 1920,
				h: 1080,
				// color: 'var(--violet-8)'
			}
		});
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
    }, [setEditor]);



	const components = {
		SharePanel: ExportCanvasButton,
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


function CanvasArea() {
    return <Card variant='classic' style={{width:'1920px', height:'1080px', position:'absolute'}}/>
}

function Background() {
    return <div style={{position:'absolute', backgroundColor:'green', width:'100%', height:'100%'}}></div>
}