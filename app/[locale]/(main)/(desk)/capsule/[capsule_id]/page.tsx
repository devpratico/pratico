import { Box, Flex, Text, Tooltip } from '@radix-ui/themes';
import Link from 'next/link';
import Image from 'next/image';
import TopBarPortal from '../../_components/TopBarPortal';
import MenuTabs from '../../_components/MenuTabs';
import { Puzzle, Ellipsis } from 'lucide-react';
import CapsuleTitle from '../../_components/CapsuleTitle';
import CanvasSL from './_components/CanvasSL';



export default function Page({ params: { capsule_id } }: { params: { capsule_id: string } }) {
    const logoScale = 0.25

    return (
        <>
            <TopBarPortal>
                <Flex justify={{ initial: 'center', xs: 'between' }} align='center'>


                    <Flex gap='5' display={{ initial: 'none', xs: 'flex' }}>
                        <Link href='/capsules' style={{ display: 'flex', alignItems: 'center' }}>
                            <Tooltip content={<Text size='2'>Accueil</Text>} side='bottom' style={{ padding: '0.5rem' }}>
                                <Image src='/images/logo.png' width={386 * logoScale} height={105 * logoScale} alt="Pratico" />
                            </Tooltip>
                        </Link>

                        <CapsuleTitle capsuleId={capsule_id}/>

                    </Flex>

                    

                    <MenuTabs tabs={[
                        { menu: 'activities', label: 'Activités', icon: <Puzzle /> },
                        { menu: 'more', label: 'Plus', icon: <Ellipsis /> }
                    ]} />
                </Flex>
            </TopBarPortal>

            <CanvasSL />
        </>
    )
}