import ToolButton from "../ToolButton/ToolButton";


interface SelectToolProps {
    active: boolean;
    dispatch: <A,P>(action: A, payload: P) => void;
}

export default function SelectTool({active, dispatch}: SelectToolProps) {
    
    return (
        <ToolButton
            toolId="eraser"
            onClick={()=>dispatch<string, string>("clickedTool", "eraser")}
            active={active}
        />
    )
}