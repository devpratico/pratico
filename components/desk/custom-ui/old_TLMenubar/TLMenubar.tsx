import DeskMenuBar from '@/components/menu-bars/DeskMenuBar/DeskMenuBar';
import { getTranslations } from 'next-intl/server';


/**
 * This is the menu bar of the canvas.
 * It is positioned on the top of the canvas.
 */
export default async function TLMenubar() {

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

    return <DeskMenuBar messages={messages} />
}