import Image from 'next/image';
import praticoLogo from '@/public/images/pratico.svg';
import { getTranslations } from 'next-intl/server';
import { HoverCard, Code, Flex, Box, Text, Button } from "@radix-ui/themes";
import StopBtn from "./StopBtn";
import { Copy, Puzzle, MessageSquareText, Users, Ellipsis } from 'lucide-react';
import QRCode from 'react-qr-code';
import LoginBtn from '@/app/[locale]/_components/LoginBtn';
import { isUserAnonymous } from '@/app/[locale]/login/_actions/actions';
import MenuBtn from './MenuBtn';
import FeedbackBtn from '@/app/[locale]/capsule/[capsule_id]/_components/CreationMenuBar/buttons/FeedbackBtn';



interface AnimationMenuBarProps {
    roomCode: string;
}

export default async function AnimationMenuBar({ roomCode }: AnimationMenuBarProps) {

    const t = await getTranslations('menu-bar')
    const isAnonymous = await isUserAnonymous()

    return (
        <Flex align='center' p='3' gap='5' height='60px' style={{backgroundColor:'var(--brand)'}}>
            <Image src={praticoLogo} width={100} height={50} alt="Pratico" />

            <HoverCard.Root>
                <HoverCard.Trigger>
                    <Code variant='solid' size='7' highContrast>{roomCode}</Code>
                </HoverCard.Trigger>
                <HoverCard.Content sideOffset={5} side='top' align='center'>
                    <Flex gap='5' align='center' direction='column'>
                        <Text>{`Pour rejoindre la session, rendez-vous sur`}</Text>
                        <Button variant='ghost' asChild>
                            <Flex gap='2' align='center'>
                                <Code size='5' weight='bold'>{"pratico.io/" + roomCode}</Code>
                                <Copy/>
                            </Flex>
                        </Button>
                        <QRCode value={"https://pratico.io/room/" + roomCode} size={400}/>
                    </Flex>
                </HoverCard.Content>
            </HoverCard.Root>
            

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