import ToolButton from "../ToolButton/ToolButton";


interface SelectToolProps {
    active: boolean;
    dispatch: (action: string, payload: string) => void;
}

export default function SelectTool({active, dispatch}: SelectToolProps) {
    
    return (
        <ToolButton
            toolId="eraser"
            onClick={()=>dispatch("CLICK_TOOL", "eraser")}
            active={active}
        />
    )
}