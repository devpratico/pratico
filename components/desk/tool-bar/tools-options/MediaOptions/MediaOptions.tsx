import styles from './MediaOptions.module.css';
import ToolOptionsContainer from '../ToolOptionsContainer/ToolOptionsContainer';
import { faCamera, faVideo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeSvg } from '@/utils/Icons';

interface MediaOptionsProps {
    dispatch: <A,P>(action: A, payload: P) => void;
}

export default function MediaOptions({dispatch}: MediaOptionsProps) {
    return (
        <ToolOptionsContainer rows={2}>

            <button className={styles.optionBtn} onClick={()=>dispatch<string, string>("clickedTool", "image")}>
                <FontAwesomeSvg icon={faCamera} className={styles.optionIcon}/>
            </button>

            <button className={styles.optionBtn} onClick={()=>dispatch<string, string>("clickedTool", "video")}>
                <FontAwesomeSvg icon={faVideo} className={styles.optionIcon}/>
            </button>

        </ToolOptionsContainer>
    )
}