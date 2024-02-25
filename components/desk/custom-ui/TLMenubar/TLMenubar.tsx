import styles from './TLMenubar.module.css'
import MenuBar from "@/components/menu-bar/MenuBar/MenuBar";


interface TLMenubarProps {
    capsuleId?: string;
}

/**
 * This is the menu bar of the canvas.
 * It is positioned on the top of the canvas.
 */
export default function TLMenubar({ capsuleId }: TLMenubarProps) {
    return (
        <div className={styles.container}>
            <MenuBar mode={'creation'} capsuleId={capsuleId} />
        </div>
    )
}