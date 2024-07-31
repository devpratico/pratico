'use client'
import { TabNav, Flex, Text } from "@radix-ui/themes"
import { Link } from "@/app/_intl/intlNavigation"
import { usePathname } from "@/app/_intl/intlNavigation"
import { CustomTabStyle } from "./MenuTabs"
import { Puzzle, NotepadText, Cog, BookOpen, FlaskRound } from 'lucide-react';


interface TabElementProps {
    href: string
    children: React.ReactNode
}

function TabElement({ href, children }: TabElementProps) {
    const pathname = usePathname()

    return (
        <TabNav.Link active={pathname == href} asChild>
            <Link href={href} shallow={false}>
                <Flex direction='column' align='center' gap='1'>
                    {children}
                </Flex>
            </Link>
        </TabNav.Link>
    )
}

export default function DashboardTabs() {
    return (
        <TabNav.Root className="dark" style={{gap:'0'}}>
            <CustomTabStyle padding='0'/>

            <TabElement href='/capsules'>
                <FlaskRound size='21' />
                <Text as='label' size='1'>Capsules</Text>
            </TabElement>

            <TabElement href='/activities'>
                <Puzzle size='21' />
                <Text as='label' size='1'>Activités</Text>
            </TabElement>

            <TabElement href='/reports'>
                <NotepadText size='21' />
                <Text as='label' size='1'>Rapports</Text>
            </TabElement>

            <TabElement href='/resources'>
                <BookOpen size='21' />
                <Text as='label' size='1'>Ressources</Text>
            </TabElement>

            <TabElement href='/settings'>
                <Cog size='21' />
                <Text as='label' size='1'>Paramètres</Text>
            </TabElement>

        </TabNav.Root>
    )
}