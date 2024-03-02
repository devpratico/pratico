'use client'
import styles from './TLSlidebar.module.css'
import { track } from "@tldraw/tldraw"
import SlideBar from '@/components/desk/slide-bar/SlideBar/SlideBar'
import { MiniatureProps } from '@/components/desk/carousel/Miniature/Miniature'
import { NavProvider } from '@/hooks/navContext'

/**
 * This is the slide bar of the canvas.
 * It takes the Slidebar component and wrap it inside `track` which is useful for tldraw.
 * It also positions the slide bar on the bottom of the canvas,
 * And provides the provider for hooks.
 */
const TLSlidebar = track(() => {
    return (
        <div className={styles.container}>
            <NavProvider>
                <SlideBar/>
            </NavProvider>
        </div>
    )
})

export default TLSlidebar