'use client'
import styles from './MediaTool.module.css';
import { useRef, useState } from 'react';
import ToolButton, {ToolId} from '../../ToolButton/ToolButton'
import MediaOptions from '../../tools-options/MediaOptions/MediaOptions';
import FileInputBtn from '../FileInputBtn/FileInputBtn';
import {Dialog, DialogContent } from '@/components/primitives/Dialog/Dialog';
import PlainBtn from '@/components/primitives/buttons/PlainBtn/PlainBtn';
import TextField from '@/components/primitives/TextField/TextField';
import YoutubeIcon from '@/components/icons/YoutubeIcon';


interface MediaToolProps {
    activeToolId:  string
    dispatch: <A,P>(action: A, payload: P) => void;
}

export default function MediaTool({activeToolId, dispatch}: MediaToolProps) {

    const [openVideoModal, setOpenVideoModal] = useState<boolean | undefined>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageClick = () => {
        dispatch<string, string>("clickedTool", "image");
        fileInputRef.current?.click();
    }

    const handleVideoSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const url = formData.get("video-url") as string;
        dispatch<string, string>("SubmitYouTubeVideoURL", url);
        setOpenVideoModal(false);
    }

    const mediaButtonProps = {
        toolId: "image" as ToolId,
        onClick: handleImageClick,
        active: activeToolId === "image" || activeToolId === "video",
        tooltipContent: <MediaOptions setOpenVideoModal={setOpenVideoModal} dispatch={dispatch}/>,
    }

    return (
        <div>
            <ToolButton {...mediaButtonProps}/>

            <FileInputBtn dispatch={dispatch} ref={fileInputRef}/>

            <Dialog open={openVideoModal} onOpenChange={setOpenVideoModal}>
                <DialogContent closeBtn>
                    <form onSubmit={handleVideoSubmit} className={styles.videoForm}>
                        <YoutubeIcon className={styles.ytIcon}/>
                        <h2 className={styles.title}>Embed a YouTube video</h2>
                        <label htmlFor="video-url" className={styles.label}>URL</label>
                        <TextField  id="video-url" name="video-url" placeholder='https://www.youtube.com...' required className={styles.textfield}/>
                        <div className={styles.btns}>
                            <PlainBtn text="Cancel" type="button" color="secondary" onClick={() => setOpenVideoModal(false)} className={styles.cancelBtn}/>
                            <PlainBtn text="Embed"  type="submit" className={styles.submitBtn}/>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

        </div>
    )
}