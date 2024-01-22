'use client'
import { useRef, useState } from 'react';
import ToolButton, {ToolId} from '../../ToolButton/ToolButton'
import MediaOptions from '../../tools-options/MediaOptions/MediaOptions';
import FileInputBtn from '../FileInputBtn/FileInputBtn';
import {Dialog, DialogContent, DialogTrigger } from '@/components/primitives/Dialog/Dialog';


interface MediaToolProps {
    activeToolId:  string
    dispatch: <A,P>(action: A, payload: P) => void;
}

export default function MediaTool({activeToolId, dispatch}: MediaToolProps) {

    //const [tooltipOpen, setTooltipOpen] = useState<boolean | undefined>(undefined);
    const [openVideoModal, setOpenVideoModal] = useState<boolean | undefined>(false);


    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleClick = () => {
        dispatch<string, string>("clickedTool", "image");
        fileInputRef.current?.click();
    }

    const mediaButtonProps = {
        toolId: "image" as ToolId,
        onClick: handleClick,
        active: activeToolId === "image" || activeToolId === "video",
        tooltipContent: <MediaOptions setOpenVideoModal={setOpenVideoModal} dispatch={dispatch}/>,
    }

    return (
        <div>
            <ToolButton {...mediaButtonProps}/>

            <FileInputBtn dispatch={dispatch} ref={fileInputRef}/>

            <Dialog open={openVideoModal} onOpenChange={setOpenVideoModal}>
                <DialogContent closeBtn>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target as HTMLFormElement);
                        const url = formData.get("video-url") as string;
                        dispatch<string, string>("SubmitYouTubeVideoURL", url);
                        setOpenVideoModal(false);
                    }}>
                        <label htmlFor="video-url">Video URL</label>
                        <br/>
                        <input type="text" id="video-url" name="video-url" placeholder='Enter a video URL'/>
                        <br/>
                        <button type="submit">Submit</button>
                    </form>
                </DialogContent>
            </Dialog>

        </div>
    )
}