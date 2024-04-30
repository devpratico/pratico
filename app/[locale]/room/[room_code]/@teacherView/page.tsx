import TLToolbar from '@/app/[locale]/_components/canvases/custom-ui/tool-bar/TLToolbar';
import Carousel from '@/app/[locale]/capsule/[capsule_id]/_components/Carousel';
import Controls from '@/app/[locale]/capsule/[capsule_id]/_components/Controls';
import Participants from '@/app/[locale]/capsule/[capsule_id]/_components/menus/Participants';
import Add from '@/app/[locale]/capsule/[capsule_id]/_components/menus/Add';
import CanvasRT from '@/app/[locale]/_components/canvases/CanvasRT';
import AnimationMenuBar from '@/app/[locale]/room/[room_code]/@teacherView/_components/AnimationMenuBar';
import styles from '@/app/[locale]/capsule/[capsule_id]/page.module.css'


export default async function TeacherView({ params }: { params: { room_code: string } }) {
    return (
        <div className={styles.container}>

            <div className={styles.canvas}>
                <CanvasRT />
            </div>

            <div className={styles.menuBar}>
                <AnimationMenuBar roomCode={params.room_code} />
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