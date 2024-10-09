'use client'
import styles from './MediaTool.module.css';
import { useRef, useState } from 'react';
import ToolButton, {ToolId} from '../../ToolButton/ToolButton'
import MediaOptions from '../../tools-options/MediaOptions/MediaOptions';
import FileInputBtn from '../FileInputBtn/FileInputBtn';
import {Dialog, DialogContent, DialogOverlay } from '@/app/(frontend)/[locale]/_components/primitives/Dialog/Dialog';
import PlainBtn from '@/app/(frontend)/[locale]/_components/primitives/buttons/PlainBtn/PlainBtn';
import TextField from '@/app/(frontend)/[locale]/_components/primitives/TextField/TextField';
import YoutubeIcon from '@/app/(frontend)/[locale]/_components/icons/YoutubeIcon';
import { Description } from '@radix-ui/react-dialog';


interface MediaToolProps {
    active: boolean;
    dispatch: (action: string, payload: string) => void;
}

export default function MediaTool({active, dispatch}: MediaToolProps) {

    const [openVideoModal, setOpenVideoModal] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageClick = () => {
        dispatch("CLICK_TOOL", "media");
        //fileInputRef.current?.click();
    }

    const handleVideoSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const url = formData.get("video-url") as string;
        dispatch("SUBMIT_YOUTUBE_URL", url);
        setOpenVideoModal(false);
    }

    const mediaButtonProps = {
        toolId: "image" as ToolId,
        onClick: handleImageClick,
        active: active,
        tooltipContent: <MediaOptions setOpenVideoModal={setOpenVideoModal} dispatch={dispatch}/>,
    }

    // TODO: Put dialog in its own component
    return (
        <div>
            <ToolButton {...mediaButtonProps}/>

            <FileInputBtn dispatch={dispatch} ref={fileInputRef}/>

            <Dialog open={openVideoModal} onOpenChange={setOpenVideoModal}>
                <DialogOverlay/>
                <DialogContent showCloseBtn className={styles.dialogContent}>
                    <form onSubmit={handleVideoSubmit} className={styles.videoForm}>
                        <YoutubeIcon className={styles.ytIcon}/>
                        <h2 className={styles.title}>Embed a YouTube video</h2>
                        <label htmlFor="video-url" className={styles.label}>URL</label>
                        <TextField  id="video-url" name="video-url" placeholder='https://www.youtube.com...' required className={styles.textfield}/>
                        <div className={styles.btns}>
                            <PlainBtn message={'Cancel'} type="button" color="secondary" onClick={() => setOpenVideoModal(false)} className={styles.cancelBtn}/>
                            <PlainBtn message={'OK'} type="submit" className={styles.submitBtn}/>
                        </div>
                    </form>

                </DialogContent>
            </Dialog>

        </div>
    )
}