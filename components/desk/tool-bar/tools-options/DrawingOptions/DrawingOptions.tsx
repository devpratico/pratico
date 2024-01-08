import ToolOptionsContainer from '../ToolOptionsContainer/ToolOptionsContainer'
import ColorsOptions, { ColorDispatch } from '../ColorsOptions/ColorsOptions'


type Action = "clickedDrawOption";
type Option = "color" | "size";
export type DrawOptionDispatch = {action: Action, payload: Option};

interface DrawingOptionsProps {
    //setColor: (color: string) => void;
    activeColor: string;
    dispatch: (_: DrawOptionDispatch | ColorDispatch) => void;
}

export default function DrawingOptions({dispatch, activeColor}: DrawingOptionsProps) {

    // We won't pass the original dispatch function.
    // We want to say "we come from the DrawingOptions component"
    // So that we'll be able to change the tool to draw
    const dispatchColor = (colorDispatch: ColorDispatch) => {
        dispatch({action: "clickedDrawOption", payload: "color"})
        dispatch(colorDispatch)
    }

    return (
        <ToolOptionsContainer>
            <ColorsOptions activeColor={activeColor} dispatch={dispatchColor}/>
        </ToolOptionsContainer>
    )
}