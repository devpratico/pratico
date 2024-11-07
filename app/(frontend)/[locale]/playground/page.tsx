'use client';
import { Editor, Tldraw, TLFrameShape } from "tldraw";
import 'tldraw/tldraw.css'


export default function PlayGround () {
	if (process.env.NODE_ENV === 'production') {
		return (null);
	}

    function onMount(editor: Editor) {
        editor.createShape({
            type: 'geo',
            x: 100,
            y: 100,
            props:{
                geo:'rectangle',
                color:'blue',
                w: 100,
                h: 100,
            }
        })

        editor.createShape<TLFrameShape>({
            type: 'frame',
            x: 200,
            y: 200,
            props:{
                name:'frame',
                //geo:'rectangle',
                //color:'red',
                w: 200,
                h: 200,
            }
        })
    }



	return (
        <div style={{height: '100vh', width: '100vw'}}>
            <Tldraw
                onMount={onMount}
            >

            </Tldraw>
        </div>
    )
};