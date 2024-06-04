import Image from 'next/image';
import praticoLogo from '@/public/images/pratico.svg';
import { getTranslations } from 'next-intl/server';
import { Code, Flex, Box } from "@radix-ui/themes";
import StopBtn from "./StopBtn";
import { Puzzle, MessageSquareText, Users, Ellipsis } from 'lucide-react';
import LoginBtn from '@/app/[locale]/_components/LoginBtn';
import { isUserAnonymous } from '@/app/[locale]/login/_actions/actions';
import MenuBtn from './MenuBtn';
import FeedbackBtn from '@/app/[locale]/capsule/[capsule_id]/_components/CreationMenuBar/buttons/FeedbackBtn';
import QrButton from './QrButton';



interface AnimationMenuBarProps {
    roomCode: string;
}

export default async function AnimationMenuBar({ roomCode }: AnimationMenuBarProps) {

    const t = await getTranslations('menu-bar')
    const isAnonymous = await isUserAnonymous()

    return (
        <Flex align='center' p='3' gap='5' height='60px' style={{backgroundColor:'var(--brand)'}}>
            <Image src={praticoLogo} width={100} height={50} alt="Pratico" />

            <Code variant='solid' size='7' highContrast>{roomCode}</Code>

            <QrButton/>

            <StopBtn message={t('stop session') || 'stop session'}/>
            
            <Box flexGrow='1' />

            <MenuBtn menu='polls' message={t('activities')}><Puzzle /></MenuBtn>
            <MenuBtn menu='chat' message={t('chat')}><MessageSquareText /></MenuBtn>
            <MenuBtn menu='participants' message={t('participants')}><Users/></MenuBtn>
            <MenuBtn menu='more' message={t('more')}><Ellipsis /></MenuBtn>
            <FeedbackBtn />

            { isAnonymous && <LoginBtn message="Se connecter" />}
        </Flex>
    )
}