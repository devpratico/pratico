import TLToolbar from '@/app/[locale]/_components/canvases/custom-ui/tool-bar/TLToolbar';
import Carousel from '@/app/[locale]/oldcapsule/[capsule_id]/_components/Carousel';
import Controls from './_components/Controls';
import styles from './page.module.css'
import AddMenu from "./_components/menus/AddMenu";
import ActivitiesMenu from './_components/menus/ActivitiesMenu';
import CanvasSL from './_components/CanvasSL';
import CreationMenuBar from './_components/CreationMenuBar/CreationMenuBar';
import MoreMenu from '../../room/[room_code]/@teacherView/_components/menus/MoreMenu';


export default async function CapsulePage() {

    return (
        <div className={styles.container}>

            <div className={styles.canvas} id='canvasArea'>
                <CanvasSL/>
            </div>

            <div className={styles.menuBar}>
                <CreationMenuBar/>
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
                <AddMenu />
                <ActivitiesMenu/>
                <MoreMenu />
            </div>

        </div>
        
    )
}