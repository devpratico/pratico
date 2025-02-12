import { Flex, Text, Tooltip, Box } from '@radix-ui/themes';
import Link from 'next/link';
import Image from 'next/image';
import TopBarPortal from '../_components/TopBarPortal';
import MenuTabs from '../_components/MenuTabs';
import { Puzzle, Ellipsis, FlaskRound } from 'lucide-react';
import DoneBtn from './[capsule_id]/_components/DoneBtn';
import StartBtn from './[capsule_id]/_components/StartBtn';



export default async function Page() {
    const logoScale = 0.20

    return (
        <>
            <TopBarPortal>
                <Flex justify={{ initial: 'center', xs: 'between' }} align='center'>


                    <Flex gap='5' display={{ initial: 'none', xs: 'flex' }}>
                        <Link href='/capsules' style={{ display: 'flex', alignItems: 'center' }}>
                            <Tooltip content={<Text size='2'>Accueil</Text>} side='bottom' style={{ padding: '0.5rem' }}>
                                <Image src='/images/logo.png' width={420 * logoScale} height={105 * logoScale} alt="Pratico" />
                            </Tooltip>
                        </Link>

                        <StartBtn message='lancer la session' />

                    </Flex>



                    <Flex gap='3' align='center' justify='between' width={{ initial: '100%', xs: 'auto' }}>

                        {/* MenuTabs for Desktop */}
                        <Box display={{ initial: 'none', xs: 'block' }}>
                            <MenuTabs tabs={[
                                { menu: 'activities', label: 'Activités', icon: <Puzzle /> },
                                { menu: 'more', label: 'Plus', icon: <Ellipsis /> }
                            ]} />
                        </Box>

                        <Box width='100%' display={{ initial: 'block', xs: 'none' }} />

                        {/* MenuTabs for Mobile - it has a Home tab and a smaller padding */}
                        <Box display={{ initial: 'block', xs: 'none' }}>
                            <MenuTabs padding='3px' tabs={[
                                { menu: undefined, label: 'Capsule', icon: <FlaskRound /> },
                                { menu: 'activities', label: 'Activités', icon: <Puzzle /> },
                                { menu: 'more', label: 'Plus', icon: <Ellipsis /> }
                            ]} />
                        </Box>

                        <DoneBtn message='terminer' />

                    </Flex>

                </Flex>
            </TopBarPortal>

        </>
    )
}