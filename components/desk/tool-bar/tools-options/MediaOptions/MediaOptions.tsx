'use client'
import styles from './MediaOptions.module.css';
import { useRef } from 'react';
import ToolOptionsContainer from '../ToolOptionsContainer/ToolOptionsContainer';
import { faCamera, faVideo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeSvg } from '@/utils/Icons';
import FileInputBtn from '../../media-tool/FileInputBtn/FileInputBtn';
import CameraIcon from '@/components/icons/CameraIcon';
import YoutubeIcon from '@/components/icons/YoutubeIcon';


interface MediaOptionsProps {
    setOpenVideoModal: (open: boolean) => void;
    dispatch: <A,P>(action: A, payload: P) => void;
}

export default function MediaOptions({setOpenVideoModal, dispatch}: MediaOptionsProps) {

    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleImageClick = () => {
        dispatch<string, string>("clickedTool", "image");
        fileInputRef.current?.click();
    }

    const handleVideoClick = () => {
        dispatch<string, string>("clickedTool", "video");
        setOpenVideoModal(true);
    }

    const ImageBtn = () => (
        <>
        <button className={styles.optionBtn} onClick={handleImageClick}>
            {/*<FontAwesomeSvg icon={faCamera} className={styles.optionIcon}/>*/}
            <CameraIcon/>
        </button>
        <FileInputBtn dispatch={dispatch} ref={fileInputRef}/>
        </>
    )

    const VideoBtn = () => (
        <button className={styles.optionBtn} onClick={handleVideoClick}>
            {/*<FontAwesomeSvg icon={faVideo} className={styles.optionIcon}/>*/}
            <YoutubeIcon/>
        </button>
    )


    return (
        <ToolOptionsContainer rows={2}>
            <ImageBtn/>
            <VideoBtn/>
        </ToolOptionsContainer>
    )
}