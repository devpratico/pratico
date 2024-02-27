'use client'
import PlainBtn from "@/components/primitives/buttons/PlainBtn/PlainBtn";
import logger from "@/utils/logger";
import { useUi } from "@/hooks/UiContext";


interface StartBtnProps {
    message?: string;
}


export default function StartBtn({ message }: StartBtnProps) {

    const { setDeskMenuBarMode } = useUi()

    const handleClick = () => {
        logger.log('react:component', 'Clicked start button')
        setDeskMenuBarMode('animation')
    }


    return (
        <PlainBtn color="secondary" size="m" onClick={handleClick}>
            {message || "Start Session"}    
        </PlainBtn>
    )
}