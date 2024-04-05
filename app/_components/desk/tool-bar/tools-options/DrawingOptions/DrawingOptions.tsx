import ToolOptionsContainer from '../ToolOptionsContainer/ToolOptionsContainer'
import ColorsOptions, { Color } from '../ColorsOptions/ColorsOptions'
import LineOptions, {Size, Dash, Tool} from '../LineOptions/LineOptions';
import { ToolBarState } from '@/app/_utils/tldraw/toolBarState';


type Action = "clickedOption";

interface DrawingOptionsProps {
    state: ToolBarState["drawOptions"]
    dispatch: (action: string, payload: string) => void;
}

export default function DrawingOptions({state, dispatch}: DrawingOptionsProps) {

    // Before letting the option button dispatching something,
    // let's say 'we come from the draw tool'
    // This way, when dispatching a color without clicking on the draw button,
    // we'll be able to switch to the draw tool automatically.
    const dispatchOption = (action: string, payload: string) => {
        // "Clicked an option *from* the draw tool":
        dispatch("CLICK_OPTION", "draw")
        dispatch(action, payload)
    }
    

    return (
        <ToolOptionsContainer>
            {ColorsOptions({activeColor: state.color, dispatch: dispatchOption})}
            {LineOptions({state: state, dispatch: dispatchOption})}
        </ToolOptionsContainer>
    )
}