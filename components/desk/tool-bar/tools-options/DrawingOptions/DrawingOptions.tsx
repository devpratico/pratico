import ToolOptionsContainer from '../ToolOptionsContainer/ToolOptionsContainer'
import ColorsOptions, { Color } from '../ColorsOptions/ColorsOptions'
import LineOptions, {Size, Dash, Tool} from '../LineOptions/LineOptions';
import { ToolBarState } from '@/utils/tldraw/toolBarState';


type Action = "clickedOption";

interface DrawingOptionsProps {
    state: ToolBarState["drawOptions"]
    dispatch: <A,P>(action: A, payload: P) => void;
}

export default function DrawingOptions({state, dispatch}: DrawingOptionsProps) {

    // Before letting the option button dispatching something,
    // let's say 'we come from the draw tool'
    // This way, when dispatching a color without clicking on the draw button,
    // we'll be able to tswitch to the draw tool automatically.
    const dispatchOption = <A, P>(action: A, payload: P) => {
        // "Clicked an option *from* the draw tool":
        dispatch<Action, Tool>("clickedOption", "draw")
        dispatch<A, P>(action, payload)
    }
    

    return (
        <ToolOptionsContainer>
            {ColorsOptions({activeColor: state.color, dispatch: dispatchOption})}
            {LineOptions({state: state, dispatch: dispatchOption})}
        </ToolOptionsContainer>
    )
}