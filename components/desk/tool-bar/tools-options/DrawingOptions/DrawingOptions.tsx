import ToolOptionsContainer from '../ToolOptionsContainer/ToolOptionsContainer'
import ColorsOptions, { Color } from '../ColorsOptions/ColorsOptions'
import LineOptions, {Size, Dash} from '../LineOptions/LineOptions';


type Action = "clickedDrawOption";
type Option = "color" | "line";

interface DrawingOptionsProps {
    activeColor: Color;
    activeSize: Size;
    activeDash: Dash;
    dispatch: <A,P>(action: A, payload: P) => void;
}

export default function DrawingOptions({activeColor, activeSize, activeDash, dispatch}: DrawingOptionsProps) {

    // We won't pass the original dispatch function.
    // We need to declare first that we come from the draw tool.
    const dispatchColor = <A, P>(action: A, payload: P) => {
        dispatch<Action, Option>("clickedDrawOption", "color")
        dispatch<A, P>(action, payload)
    }

    const dispatchLine = <A, P>(action: A, payload: P) => {
        dispatch<Action, Option>("clickedDrawOption", "line")
        dispatch<A, P>(action, payload)
    }

    return (
        <ToolOptionsContainer>
            <ColorsOptions activeColor={activeColor} dispatch={dispatchColor}/>
            <LineOptions   activeSize={activeSize} activeDash={activeDash} dispatch={dispatchLine}/>
        </ToolOptionsContainer>
    )
}