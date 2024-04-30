import Image from 'next/image';
import LabeledIconBtn from '../../../../_components/primitives/buttons/LabaledIconBtn/LabeledIconBtn';
import praticoLogo from '@/public/images/pratico.svg';
import PuzzleIcon from '@/app/[locale]/_components/icons/PuzzleIcon';
import ThreeDotsIcon from '@/app/[locale]/_components/icons/ThreeDotsIcon';
import ChatSquareDotIcon from '@/app/[locale]/_components/icons/ChatSquareDotIcon';
import { IconSize } from '@/app/_utils/icons/IconProps';
import ParticipantsBtn from './ParticipantsBtn';
import { getTranslations } from 'next-intl/server';
import { HoverCard, Code, Flex, Box, Text, Button, IconButton } from "@radix-ui/themes";
import StopBtn from "./StopBtn";
import { Copy, Puzzle } from 'lucide-react';
import QRCode from 'react-qr-code';
import LoginBtn from '@/app/[locale]/_components/LoginBtn';



interface AnimationMenuBarProps {
    roomCode: string;
}

export default async function AnimationMenuBar({ roomCode }: AnimationMenuBarProps) {

    const t = await getTranslations('menu-bar')
    const messages = {
        play: t('play'),
        stop: t('stop session'),
        polls: t('polls'),
        chat: t('chat'),
        participants: t('participants'),
        more: t('more'),
        done: t('done'),
    }

    const styleBtnProps = {
        iconColor: "var(--text-on-primary)",
        iconSize: "md" as IconSize,
        labelColor: "var(--secondary)",
        hideLabel: false,
    }


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
                                <Code size='5' weight='bold'>{"pratico.io/room/" + roomCode}</Code>
                                <Copy/>
                            </Flex>
                        </Button>
                        <QRCode value={"https://pratico.io/room/" + roomCode} size={400}/>
                    </Flex>
                </HoverCard.Content>
            </HoverCard.Root>
            

            <StopBtn message={messages?.stop || 'stop session'}/>
            
            <Box flexGrow='1' />

            <Button asChild>
                <Puzzle/>
            </Button>
            <LabeledIconBtn icon={<PuzzleIcon        fill={true}/>} label={messages?.polls || 'activities'} {...styleBtnProps} />
            <LabeledIconBtn icon={<ChatSquareDotIcon fill={true}/>} label={messages?.chat || 'chat'} {...styleBtnProps} />
            <ParticipantsBtn message={messages?.participants} />
            <LabeledIconBtn icon={<ThreeDotsIcon     fill={true}/>} label={messages?.more || 'more'} {...styleBtnProps} />
            <LoginBtn message="Se connecter" />
        </Flex>
    )
}