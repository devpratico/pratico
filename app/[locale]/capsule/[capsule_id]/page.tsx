import { getTranslations } from 'next-intl/server';
import TLToolbar from '@/app/[locale]/_components/canvases/custom-ui/tool-bar/TLToolbar';
import Carousel from '@/app/[locale]/capsule/[capsule_id]/_components/Carousel';
import Controls from './_components/Controls';
import styles from './page.module.css'
import ParticipantsMenu from "../../room/[room_code]/@teacherView/_components/menus/ParticipantsMenu";
import AddMenu from "./_components/menus/AddMenu";
import ActivitiesMenu from './_components/menus/ActivitiesMenu';
import CanvasSL from '../../_components/canvases/CanvasSL';
import CreationMenuBar from './_components/CreationMenuBar/CreationMenuBar';
import ChatMenu from '../../room/[room_code]/@teacherView/_components/menus/ChatMenu';


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
                <CanvasSL />
            </div>

            <div className={styles.menuBar}>
                <CreationMenuBar messages={messages} />
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
                <ParticipantsMenu />
                <AddMenu />
                <ActivitiesMenu/>
                <ChatMenu />
            </div>

        </div>
        
    )
}