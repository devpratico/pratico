'use client'
import PlainBtn from "@/components/primitives/buttons/PlainBtn/PlainBtn";
import logger from "@/utils/logger";
import { useUi } from "@/contexts/UiContext";


interface StopBtnProps {
    message?: string;
}


export default function StopBtn({ message }: StopBtnProps) {

    const { setDeskMenuBarMode } = useUi()

    const handleClick = () => {
        logger.log('react:component', 'Clicked stop button')
        setDeskMenuBarMode('creation')
    }


    return (
        <PlainBtn color="secondary" size="m" onClick={handleClick}>
            {message || "Stop Session"}    
        </PlainBtn>
    )
}