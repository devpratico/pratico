import styles from './MediaOptions.module.css';
import { useRef } from 'react';
import ToolOptionsContainer from '../ToolOptionsContainer/ToolOptionsContainer';
import { faCamera, faVideo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeSvg } from '@/utils/Icons';
import FileInputBtn from '../../media-tool/FileInputBtn/FileInputBtn';

interface MediaOptionsProps {
    dispatch: <A,P>(action: A, payload: P) => void;
}

export default function MediaOptions({dispatch}: MediaOptionsProps) {

    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleClick = () => {
        dispatch<string, string>("clickedTool", "image");
        fileInputRef.current?.click();
    }

    return (
        <ToolOptionsContainer rows={2}>

            <button className={styles.optionBtn} onClick={handleClick}>
                <FontAwesomeSvg icon={faCamera} className={styles.optionIcon}/>
                <FileInputBtn dispatch={dispatch} ref={fileInputRef}/>
            </button>

            <button className={styles.optionBtn} onClick={()=>dispatch<string, string>("clickedTool", "video")}>
                <FontAwesomeSvg icon={faVideo} className={styles.optionIcon}/>
            </button>

        </ToolOptionsContainer>
    )
}