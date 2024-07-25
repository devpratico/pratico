import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Flex, Box, Text, Tooltip } from "@radix-ui/themes";
import StopBtn from "./StopBtn";
import { Puzzle, MessageSquareText, Users, Ellipsis } from 'lucide-react';
import LoginBtn from '@/app/[locale]/_components/LoginBtn';
import { isUserAnonymous } from '@/app/[locale]/login/_actions/actions';
import MenuBtn from './MenuBtn';
import FeedbackBtn from '@/app/[locale]/oldcapsule/[capsule_id]/_components/CreationMenuBar/buttons/FeedbackBtn';
import QrButton from './QrButton';
import { Link } from '@/app/_intl/intlNavigation';



interface AnimationMenuBarProps {
    roomCode: string;
}

export default async function AnimationMenuBar({ roomCode }: AnimationMenuBarProps) {

    const t = await getTranslations('menu-bar')
    const isAnonymous = await isUserAnonymous()
    const logoScale = 0.25

    return (
        <Flex align='center' p='3' gap='5' height='60px' style={{backgroundColor:'var(--brand)'}}>

            <Flex align='center'>
                <Link href='/capsules' style={{display: 'flex', alignItems: 'center'}}>
                    <Tooltip content={<Text size='2'>Accueil</Text>} side='bottom' style={{padding:'0.5rem'}}>
                        <Image src={'/images/logolien.png'} width={500*logoScale} height={105*logoScale} alt="Pratico"/>
                    </Tooltip>
                </Link>

                <Text size='6' style={{color:'var(--background)', opacity:'0.5'}}>{`/${roomCode}`}</Text>
            </Flex>

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