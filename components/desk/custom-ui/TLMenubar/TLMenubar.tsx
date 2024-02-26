import styles from './TLMenubar.module.css'
import DeskMenuBar from '@/components/menu-bars/DeskMenuBar/DeskMenuBar';
import { getTranslations } from 'next-intl/server';


interface TLMenubarProps {
    capsuleId?: string;
}

/**
 * This is the menu bar of the canvas.
 * It is positioned on the top of the canvas.
 */
export default async function TLMenubar({ capsuleId }: TLMenubarProps) {

    const t = await getTranslations('menu-bar')
    const messages = {
        play: t('play'),
        stop: t('stop session'),
        polls: t('polls'),
        chat: t('chat'),
        participants: t('participants'),
        more: t('more'),
        done: t('done'),
    }

    return (
        <div className={styles.container}>
            <DeskMenuBar capsuleId={capsuleId} messages={messages} />
        </div>
    )
}