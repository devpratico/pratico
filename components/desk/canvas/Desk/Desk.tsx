import Canvas from "../Canvas/Canvas";
import TLMenubar from "../custom-ui/TLMenubar/TLMenubar";
import Resizer from '../custom-ui/Resizer/Resizer'
import EmbedHint from '../custom-ui/EmbedHint/EmbedHint'
import TLToolbar from '../custom-ui/TLToolbar/TLToolbar'
import TLSlidebar from '../custom-ui/TLSlidebar/TLSlidebar'
import { CanvasProps } from "../Canvas/Canvas";


interface DeskProps extends CanvasProps {
    capsuleId?: string;
}

/**
 * This is the Canvas but server side, allowing for custom UI
 * with internationalization and other server side features.
 */
export default function Desk({store, initialSnapshot, children, capsuleId}: DeskProps) {
    return (
        <Canvas store={store} initialSnapshot={initialSnapshot}>
            <Resizer/>
            <EmbedHint/>
            <TLMenubar capsuleId={capsuleId}/>
            <TLToolbar/>
            <TLSlidebar/>
            {children}
        </Canvas>
    )
}