import styles from './page.module.css'
import CanvasSwitcher from './_components/CanvasSwitcher';
import DeskLayout from '@/components/layouts/DeskLayout/DeskLayout';
import { getTranslations } from 'next-intl/server';
import DeskMenuBar from '@/components/menu-bars/DeskMenuBar/DeskMenuBar';
import SlideBar from '@/components/desk/slide-bar/SlideBar/SlideBar';
import TLToolbar from '@/components/desk/custom-ui/TLToolbar/TLToolbar';
import DeskMenus from '@/components/menus/DeskMenus/DeskMenus';


export default async function CapsulePage() {

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
        <main className={styles.main}>
            <CanvasSwitcher />
            <DeskLayout
                menuBar={<DeskMenuBar messages={messages} />}
                slideBar={<SlideBar />}
                toolBar={<TLToolbar />}
                menu={<DeskMenus />}
            />
        </main>
    )
}