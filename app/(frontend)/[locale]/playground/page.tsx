'use client';
import { useCallback } from "react";
import { createShapeId, Editor, exportToBlob, IndexKey, Tldraw, TLFrameShape, TLPageId, TLParentId, TLShapeId, TLUiComponents, uniqueId, useEditor } from "tldraw";
import 'tldraw/tldraw.css'
import { useTLEditor } from "../../_hooks/useTLEditor";
import { CardShapeUtil } from "./_components/ShapeUtilClass";

const MyCustomShapes = [CardShapeUtil]

export default function PlayGround () {
	// if (process.env.NODE_ENV === 'production') {
	// 	return (null);
	// }
	const { editor, setEditor } = useTLEditor();

    const handleOnMount = useCallback((editor: Editor) => {
		setEditor(editor);
		
        editor?.createPage({
			id: `page:${uniqueId()}` as TLPageId
        })
	
		// editor.createShapes([{type: 'card'}]);
		editor.sideEffects.registerAfterCreateHandler('page', (newpage) => {
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
		})
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
					ids: [...shapeIds],
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