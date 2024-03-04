'use client'
import CreationMenuBar from "../CreationMenuBar/CreationMenuBar"
import AnimationMenuBar from "../AnimationMenuBar/AnimationMenuBar"
//import { useUi } from "@/hooks/uiContext"
import { useRoom } from "@/hooks/roomContext"


interface DeskMenuBarProps {
    messages?: {
        play:  string;
        stop:  string;
        polls: string;
        chat:  string;
        participants: string;
        more:  string;
        done:  string;
    }
}


/**
 * This is the client component responsible for switching to the correct menu bar
 */
export default function DeskMenuBar({ messages }: DeskMenuBarProps) {

    const { room } = useRoom()

    /*
    const { deskMenuBarMode } = useUi()
    switch (deskMenuBarMode) {
        case "creation":
            return <CreationMenuBar messages={messages} />
            
        case "animation":
            return <AnimationMenuBar messages={messages} />
    }*/

    if (room) {
        return <AnimationMenuBar messages={messages} />
    } else {
        return <CreationMenuBar messages={messages} />
    }
}