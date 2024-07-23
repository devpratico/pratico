import MenuTabs from "../_components/MenuTabs"
import { Flex, Box, Tooltip, Text } from "@radix-ui/themes"
import TopBarPortal from "../_components/TopBarPortal"
import { Puzzle, Ellipsis } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';


export default function Page() {
    const logoScale = 0.25
    return (
        <>
            <TopBarPortal>
                <Flex justify={{ initial: 'center', xs: 'between' }} align='center'>
                    <Box display={{ initial: 'none', xs: 'block' }}>
                        <Link href='/capsules' style={{ display: 'flex', alignItems: 'center' }}>
                            <Tooltip content={<Text size='2'>Accueil</Text>} side='bottom' style={{ padding: '0.5rem' }}>
                                <Image src='/images/logo.png' width={386 * logoScale} height={105 * logoScale} alt="Pratico" />
                            </Tooltip>
                        </Link>
                    </Box>
                    <MenuTabs tabs={[
                        { menu: 'activities', label: 'Activités', icon: <Puzzle /> },
                        { menu: 'more', label: 'Plus', icon: <Ellipsis /> }
                    ]} />
                </Flex>
            </TopBarPortal>

            <p>Capsule vide !</p>
        </>
    )
}