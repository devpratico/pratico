import styles from './TLSlidebar.module.css'
//import { track, useEditor } from "@tldraw/tldraw"
import SlideBar from '@/components/desk/slide-bar/SlideBar/SlideBar'

/**
 * This is the slide bar of the canvas.
 * It takes the Slidebar component and wrap it inside `track` which is useful for tldraw.
 * It also positions the slide bar on the bottom of the canvas,
 * And provides the props using tldraw's editor.
 */
export default function TLSlidebar() {
    return (
        <div className={styles.container}>
            <SlideBar/>
        </div>
    )
}