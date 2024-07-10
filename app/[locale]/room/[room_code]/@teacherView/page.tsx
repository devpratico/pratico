import TLToolbar from '@/app/[locale]/_components/canvases/custom-ui/tool-bar/TLToolbar';
import Carousel from '@/app/[locale]/capsule/[capsule_id]/_components/Carousel';
import Controls from '@/app/[locale]/capsule/[capsule_id]/_components/Controls';
import ParticipantsMenu from '@/app/[locale]/room/[room_code]/@teacherView/_components/menus/ParticipantsMenu';
import AddMenu from '@/app/[locale]/capsule/[capsule_id]/_components/menus/AddMenu';
import AnimationMenuBar from '@/app/[locale]/room/[room_code]/@teacherView/_components/AnimationMenuBar';
import styles from '@/app/[locale]/capsule/[capsule_id]/page.module.css'
import ChatMenu from './_components/menus/ChatMenu';
import ActivitiesMenu from '@/app/[locale]/capsule/[capsule_id]/_components/menus/ActivitiesMenu';
import MoreMenu from './_components/menus/MoreMenu';
import TeacherCanvasServer from './_components/TeacherCanvasServer';
import { Suspense } from 'react';
import StartDialog from './_components/StartDialog';
import DefilementMenu from './_components/menus/DefilementMenu';



export default async function TeacherView({ params }: { params: { room_code: string } }) {

    //const origin = process.env.NEXT_PUBLIC_

    return (
        <div className={styles.container}>

            <div className={styles.startModal} id='startModalContainer'>
                <StartDialog roomCode={params.room_code} />
            </div>

            <div className={styles.canvas} id='canvasArea'>
                <Suspense fallback={null}>
                    <TeacherCanvasServer roomCode={params.room_code} />
                </Suspense>
            </div>

            <div className={styles.menuBar}>
                <Suspense fallback={null}>
                    <AnimationMenuBar roomCode={params.room_code} />
                </Suspense>
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
                <DefilementMenu />
                <AddMenu />
                <ChatMenu />
                <ActivitiesMenu />
                <MoreMenu/>
            </div>

        </div>

    )
}