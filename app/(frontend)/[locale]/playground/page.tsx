'use client';
import { useCallback, useEffect, useState } from "react";
import { createShapeId, Editor, exportToBlob, IndexKey, Tldraw, TLFrameShape, TLPage, TLPageId, TLParentId, TLShape, TLShapeId, TLUiComponents, transact, uniqueId, useEditor, useValue } from "tldraw";
import 'tldraw/tldraw.css'
import { useTLEditor } from "../../_hooks/useTLEditor";
import { CardShapeUtil } from "./_components/ShapeUtilClass";
import { useNav } from "../../_hooks/useNav";
import { Card } from "@radix-ui/themes";
import { CapsuleToPDF } from "./_components/CapsuleToPDFBtn";

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
      
		const { x,y } = editor.getViewportPageBounds();
		const newFrameId = createShapeId();
		editor.createShape<TLFrameShape>({type: 'frame',
			id: newFrameId,
			x: x,
			y: y,
			props: {
				w: 1920,
				h: 1080,
			}
		});
		const tmp = { index: frameIds ? frameIds.length + 1 : 0, id: newFrameId};
		setFrameIds((prev) => [...(prev || []), tmp]);
		editor?.sideEffects.registerAfterCreateHandler('page', (newpage) => {

			setCurrentPageId(newpage.id);
			
		});
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
		SharePanel: CapsuleToPDF,
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


function CanvasArea() {
    return <Card variant='classic' style={{width:'1920px', height:'1080px', position:'absolute'}}/>
}

function Background() {
    return <div style={{position:'absolute', backgroundColor:'green', width:'100%', height:'100%'}}></div>
}