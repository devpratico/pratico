'use client'
import ZapetteLayout from "@/components/layouts/ZapetteLayout/ZapetteLayout"
import { 
    ArrowRightLeft,
    Gamepad2,
    MessageSquare,
    Users,
    Ellipsis,
    MousePointer2,
    Pen,
    Type,
    Shapes,
    Image,
    Eraser,
    Timer,
    Plus,
    ChevronLeft,
    ChevronRight,
} from "lucide-react"
import { useRoom } from "@/hooks/useRoom"
import { TLStoreSnapshot } from "tldraw"
import Thumbnail from "@/components/Thumbnail/Thumbnail"
import { useNav } from "@/hooks/useNav"


export default function ZapettePage() {
    return (
        <ZapetteLayout
            toolBar={<ToolBarMobile />}
            canvas={<CanvasMiniatureMobile />}
            controls={<ControlsMobile />}
            menuBar={<MenuBarMobile />}
        />
    )
}


function MenuBarMobile() {

    const containerStyle: React.CSSProperties = {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center'
    }

    return (
        <div style={containerStyle}>
            <ArrowRightLeft color="white" size={30} />
            <Timer color="white" size={30} />
            <Gamepad2 color="white" size={30} />
            <MessageSquare color="white" size={30} />
            <Users color="white" size={30} />
            <Ellipsis color="white" size={30} />
        </div>
    )
}


function ToolBarMobile() {

    const containerStyle: React.CSSProperties = {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: '10px',
    }

    return (
        <div style={containerStyle}>
            <MousePointer2 color="black" size={30} />
            <Pen color="black" size={30} />
            <Type color="black" size={30} />
            <Shapes color="black" size={30} />
            <Image color="black" size={30} />
            <Eraser color="black" size={30} />
        </div>
    )
}


function ControlsMobile() {

    const { room } = useRoom()
    const { pageIds } = useNav()
    const snapshot = room?.capsule_snapshot ? JSON.parse(room.capsule_snapshot as any) as TLStoreSnapshot : undefined



    const containerStyle: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: '1fr 2fr auto',
        gap: '8px',
        height: '100%',
    }

    const plusStyle: React.CSSProperties = {
        backgroundColor: 'var(--primary)',
        borderRadius: '10px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }

    const buttonStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'var(--background)',
        borderRadius: '10px',
    }

    const miniatureStyle: React.CSSProperties = {
        backgroundColor: 'var(--background)',
        borderRadius: '10px',
        width: '100%',
        aspectRatio: '16/9',
        overflow: 'hidden',
    }

    const counterStyle: React.CSSProperties = {
        color: 'var(--primary)',
        fontSize: '1.5rem',
        letterSpacing: '0.2rem',
    }

    const iconStrokeWidth = 3
    const iconSize = 70

    return (
        <div style={containerStyle}>

            <div style={buttonStyle}>
                <p style={counterStyle}>1/10</p>
            </div>

            <div style={plusStyle}>
                <Plus color="white" size={iconSize} strokeWidth={iconStrokeWidth} absoluteStrokeWidth />
            </div>

            <div style={buttonStyle}>
                <ChevronLeft color="black" size={iconSize} strokeWidth={iconStrokeWidth} absoluteStrokeWidth />
            </div>

            <div style={buttonStyle}>
                <ChevronRight color="black" size={iconSize} strokeWidth={iconStrokeWidth} absoluteStrokeWidth />
            </div>

            <div style={miniatureStyle}>
                {snapshot && pageIds ? <Thumbnail snapshot={snapshot} pageId={pageIds[0]} scale={0.2}/> : <div>no snapshot</div>}
            </div>

            <div style={miniatureStyle}>
                {snapshot && pageIds ? <Thumbnail snapshot={snapshot} pageId={pageIds[1]} scale={0.2}/> : <div>no snapshot</div>}
            </div>

        </div>
    )
}

function CanvasMiniatureMobile() {
    const { room } = useRoom()
    const { currentPageId } = useNav()
    const snapshot = room?.capsule_snapshot ? JSON.parse(room.capsule_snapshot as any) as TLStoreSnapshot : undefined

    const containerStyle: React.CSSProperties = {
        width: '100%',
        height: '100%',
        borderRadius: '10px',
        overflow: 'hidden',
    }

    return (
        <div style={containerStyle}>
            {snapshot ? <Thumbnail snapshot={snapshot} pageId={currentPageId} scale={0.2}/> : <div>no snapshot</div>}
        </div>
    )
}