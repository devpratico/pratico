'use client';
import { useCallback, useEffect, useState } from "react";
import { createShapeId, Editor, exportToBlob, IndexKey, Tldraw, TLFrameShape, TLPageId, TLParentId, TLShapeId, TLUiComponents, uniqueId, useEditor } from "tldraw";
import 'tldraw/tldraw.css'
import { useTLEditor } from "../../_hooks/useTLEditor";
import { CardShapeUtil } from "./_components/ShapeUtilClass";
import { useNav } from "../../_hooks/useNav";

const MyCustomShapes = [CardShapeUtil]

export default function PlayGround () {
	// if (process.env.NODE_ENV === 'production') {
	// 	return (null);
	// }
	const [ editor, setEditor ] = useState<Editor>();
	const [ currentPageId, setCurrentPageId ] = useState<TLPageId>();
	const [ pageIds, setPageIds ] = useState<TLPageId[] | undefined>([]); 

	useEffect(() => {
		console.log("useeffect", editor);
		if (!editor)
			return ;
		console.log("Editor exists", editor);

		const searchId = pageIds?.find((item) => {
			return (item === currentPageId);
		});
		console.log("searchId", searchId, currentPageId);

		if ((!searchId || !searchId.length) && currentPageId)
		{
			const { x,y,w,h } = editor.getViewportPageBounds();
			editor.createShape({type: 'card',
				x: x,
				y: y,
				isLocked: true,
				props: {
					w: w,
					h: h,
					color: 'var(--violet-8)'
				}
			});
			setPageIds((prev) => [...(prev || []), currentPageId]);
			console.log(pageIds);
		}
		
		// });
	}, [editor, currentPageId, pageIds]);
	
    const handleOnMount = useCallback((editor: Editor) => {
		if (editor)
			setEditor(editor);
		console.log("Editor handleOnMount", editor);
      
		const { x,y,w,h } = editor.getViewportPageBounds();
		editor.createShape({type: 'card',
			x: x,
			y: y,
			isLocked: true,
			props: {
				w: w,
				h: h,
				color: 'var(--violet-8)'
			}
		});
		editor?.sideEffects.registerAfterCreateHandler('page', (newpage) => {

			console.log("NEW PAGE", newpage);
			setCurrentPageId(newpage.id);
			console.log("CURRENT", currentPageId);

			editor.createShape({type: 'card',
				x: x,
				y: y,
				isLocked: true,
				props: {
					w: w,
					h: h,
					color: 'var(--violet-8)'
				}
			});
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
    }, [setEditor, currentPageId]);



	const components: TLUiComponents = {
		SharePanel: ExportCanvasButton,
	}

	return (
        <div style={{position: 'fixed', inset: 0 }}>
            <Tldraw
                onMount={handleOnMount}
				// persistenceKey="example4"
				shapeUtils={MyCustomShapes}
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