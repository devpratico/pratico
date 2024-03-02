import TLMenubar from "../custom-ui/TLMenubar/TLMenubar";
import Resizer from '../custom-ui/Resizer/Resizer'
import EmbedHint from '../custom-ui/EmbedHint/EmbedHint'
import TLToolbar from '../custom-ui/TLToolbar/TLToolbar'
import TLSlidebar from '../custom-ui/TLSlidebar/TLSlidebar'
import CanvasRT from "../CanvasRT/CanvasRT";


interface DeskProps {
    children?: React.ReactNode;
}

/**
 * This is the Canvas but server side, allowing for custom UI
 * with internationalization and other server side features.
 */
export default function Desk({children}: DeskProps) {
    return (
        <CanvasRT>
            <Resizer/>
            <EmbedHint/>
            <TLMenubar/>
            <TLToolbar/>
            <TLSlidebar/>
            {children}
        </CanvasRT>
    )
}