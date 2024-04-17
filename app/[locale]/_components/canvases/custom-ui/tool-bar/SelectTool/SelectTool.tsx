import ToolButton from "../ToolButton/ToolButton";


interface SelectToolProps {
    active: boolean;
    dispatch: (action: string, payload: string) => void;
}

export default function SelectTool({active, dispatch}: SelectToolProps) {
    
    return (
        <ToolButton
            toolId="select"
            onClick={()=>dispatch("CLICK_TOOL", "select")}
            active={active}
        />
    )
}