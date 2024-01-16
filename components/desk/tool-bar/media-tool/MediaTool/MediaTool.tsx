import { useRef } from 'react';
import ToolButton, {ToolId} from '../../ToolButton/ToolButton'
import MediaOptions from '../../tools-options/MediaOptions/MediaOptions';
import FileInputBtn from '../FileInputBtn/FileInputBtn';


interface MediaToolProps {
    activeToolId:  string
    dispatch: <A,P>(action: A, payload: P) => void;
}

export default function MediaTool({activeToolId, dispatch}: MediaToolProps) {

    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleClick = () => {
        dispatch<string, string>("clickedTool", "image");
        fileInputRef.current?.click();
    }

    const mediaButtonProps = {
        toolId: "image" as ToolId,
        onClick: handleClick,
        active: activeToolId === "image" || activeToolId === "video",
        tooltipContent: <MediaOptions dispatch={dispatch}/>
    }

    return (
        <div>
            <ToolButton {...mediaButtonProps}/>
            <FileInputBtn dispatch={dispatch} ref={fileInputRef}/>
        </div>
    )
}