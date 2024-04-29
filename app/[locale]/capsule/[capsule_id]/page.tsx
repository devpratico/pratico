import CanvasSwitcher from './_components/CanvasSwitcher';
import { getTranslations } from 'next-intl/server';
import DeskMenuBar from '@/app/[locale]/capsule/[capsule_id]/_components/menu-bars/DeskMenuBar/DeskMenuBar';
import TLToolbar from '@/app/[locale]/_components/canvases/custom-ui/tool-bar/TLToolbar';
import Carousel from '@/app/[locale]/capsule/[capsule_id]/_components/Carousel';
import Controls from './_components/Controls';
import styles from './page.module.css'
import Participants from "./_components/menus/Participants";
import Add from "./_components/menus/Add";


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
        <div className={styles.container}>

            <div className={styles.canvas}>
                <CanvasSwitcher />
            </div>

            <div className={styles.menuBar}>
                <DeskMenuBar messages={messages} />
            </div>

            <div className={styles.toolBar}>
                <TLToolbar />
            </div>

            <div className={styles.carousel}>
                <Carousel />
            </div>

            <div className={styles.controls}>
                <Controls />
            </div>

            <div className={styles.menu}>
                <Participants />
                <Add />
            </div>

        </div>
        
    )
}