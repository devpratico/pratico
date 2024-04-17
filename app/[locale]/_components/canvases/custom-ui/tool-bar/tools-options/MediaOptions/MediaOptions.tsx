'use client'
import styles from './MediaOptions.module.css';
import { useRef } from 'react';
import ToolOptionsContainer from '../ToolOptionsContainer/ToolOptionsContainer';
import FileInputBtn from '../../media-tool/FileInputBtn/FileInputBtn';
import CameraIcon from '@/app/[locale]/_components/icons/CameraIcon';
import YoutubeIcon from '@/app/[locale]/_components/icons/YoutubeIcon';
import FileEarmarkImageIcon from '@/app/[locale]/_components/icons/FileEarmarkImageIcon';


interface MediaOptionsProps {
    setOpenVideoModal: (open: boolean) => void;
    dispatch: (action: string, payload: string) => void;
}

export default function MediaOptions({setOpenVideoModal, dispatch}: MediaOptionsProps) {

    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleImageClick = () => {
        dispatch("CLICK_MEDIA_TYPE", "image");
        fileInputRef.current?.click();
    }

    const handleVideoClick = () => {
        dispatch("CLICK_MEDIA_TYPE", "video");
        setOpenVideoModal(true);
    }

    const ImageBtn = () => (
        <>
        <button className={styles.optionBtn} onClick={handleImageClick} title="Upload Image">
            <FileEarmarkImageIcon/>
        </button>
        <FileInputBtn dispatch={dispatch} ref={fileInputRef}/>
        </>
    )

    const VideoBtn = () => (
        <button className={styles.optionBtn} onClick={handleVideoClick} title="Embed Video">
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