'use client'
import CreationMenuBar from "../CreationMenuBar/CreationMenuBar"
import AnimationMenuBar from "../AnimationMenuBar/AnimationMenuBar"
import { useUi } from "@/contexts/UiContext"


interface DeskMenuBarProps {
    capsuleId?: string;
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
export default function DeskMenuBar({ capsuleId, messages }: DeskMenuBarProps) {

    const { deskMenuBarMode } = useUi()
    switch (deskMenuBarMode) {
        case "creation":
            return <CreationMenuBar capsuleId={capsuleId} messages={messages} />
            
        case "animation":
            return <AnimationMenuBar capsuleId={capsuleId} messages={messages} />
    }
}