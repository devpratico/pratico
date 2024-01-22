'use client'
import styles from './MediaOptions.module.css';
import { useRef, useState } from 'react';
import ToolOptionsContainer from '../ToolOptionsContainer/ToolOptionsContainer';
import { faCamera, faVideo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeSvg } from '@/utils/Icons';
import FileInputBtn from '../../media-tool/FileInputBtn/FileInputBtn';
import {Dialog, DialogContent, DialogTrigger} from '@/components/primitives/Dialog/Dialog';


interface MediaOptionsProps {
    setOpenVideoModal: (open: boolean) => void;
    dispatch: <A,P>(action: A, payload: P) => void;
}

export default function MediaOptions({setOpenVideoModal, dispatch}: MediaOptionsProps) {

    //const [openVideoModal, setOpenVideoModal] = useState<boolean>(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleImageClick = () => {
        dispatch<string, string>("clickedTool", "image");
        fileInputRef.current?.click();
    }

    const ImageBtn = () => (
        <>
        <button className={styles.optionBtn} onClick={handleImageClick}>
            <FontAwesomeSvg icon={faCamera} className={styles.optionIcon}/>
        </button>
        <FileInputBtn dispatch={dispatch} ref={fileInputRef}/>
        </>
    )

    const VideoBtn = () => (
        <button className={styles.optionBtn} onClick={() => {
            setOpenVideoModal(true)
            //dispatch<string, string>("clickedTool", "video");
        }
        }>
            <FontAwesomeSvg icon={faVideo} className={styles.optionIcon}/>
        </button>
    )


    return (
        <ToolOptionsContainer rows={2}>
            <ImageBtn/>
            <VideoBtn/>
        </ToolOptionsContainer>
    )
}