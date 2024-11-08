'use client';
import { useCallback } from "react";
import { createShapeId, Editor, Tldraw, TLFrameShape, TLPageId, TLShapeId, uniqueId, useEditor } from "tldraw";
import 'tldraw/tldraw.css'
import { useTLEditor } from "../../_hooks/useTLEditor";


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

		editor.sideEffects.registerAfterCreateHandler('page', (newpage) => {
			if (newpage.typeName === 'page') {
				console.log('A new page was created', newpage)
			}
			const { x,y,w,h } = editor.getViewportPageBounds();
			editor?.createShape<TLFrameShape>({
				 id: createShapeId(),
				 type: 'frame',
				 x: x,
				 y: y,
				 // isLocked: true,
				 props:{
					 name:'frame',
					 //geo:'rectangle',
					 //color:'red',
					 w: w,
					 h: h,
				 }
			 })
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



	return (
        <div style={{position: 'fixed', inset: 0 }}>
            <Tldraw
                onMount={handleOnMount}
				persistenceKey="example"
            >

            </Tldraw>
        </div>
    )
};