'use client'
import styles from './Desk.module.css'
import ToolBar from '../ToolBar/ToolBar'
import { useRef, useState, useEffect } from 'react'
import Canvas from '../Canvas/Canvas'


export default function Desk() {

    const canvasContainerRef = useRef<HTMLDivElement>(null);
    const canvasRef          = useRef<HTMLDivElement>(null);
    const [size, setSize]    = useState({ width: 0, height: 0 })

    // Save the size of the container
    useEffect(() => {
        const updateSize = () => {
            if (canvasContainerRef.current) {
                setSize({
                    width:  canvasContainerRef.current.offsetWidth,
                    height: canvasContainerRef.current.offsetHeight
                })
            }
        }
        window.addEventListener('resize', updateSize);
        updateSize();

        return () => window.removeEventListener('resize', updateSize)
    }, []);

    // Depending on the size of the container, change the canvas class
    useEffect(() => {
        if (canvasContainerRef.current && canvasRef.current) {
            if (size.width >= 16/9 * size.height) {
                canvasRef.current.classList.remove(styles.touchLeftRight)
                canvasRef.current.classList.add(   styles.touchUpDown)
            } else {
                canvasRef.current.classList.remove(styles.touchUpDown)
                canvasRef.current.classList.add(   styles.touchLeftRight)
            }
        }
    
    }, [size])

    return (
        <div className={styles.container}>

            {/*<ToolBar/>*/}

            <div className={styles.canvasContainer} ref={canvasContainerRef}>
                <div className={`${styles.canvas} smallShadow`} ref={canvasRef}>
                    <Canvas/>
                </div>
            </div>

        </div>
    )
}