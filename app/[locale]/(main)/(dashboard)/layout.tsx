import { TopBarBox } from "../layout"
import { Box, BoxProps, Flex, Grid, Text, Card } from "@radix-ui/themes"
import { Puzzle, NotepadText, Cog, BookOpen, FlaskRound } from 'lucide-react';
import { SideBarBtn } from "./_components/SideBarBtn";
import DashboardTabs from "./_components/DashboardTabs";
import UserInfo from "./_components/UserInfo";
import Image from "next/image";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <> 
            <TopBarBox>
                <MobileTopBar  display={{ initial: 'block', xs: 'none' }} pt='1'/>
                <DesktopTopBar display={{ initial: 'none',  xs: 'block' }} py='3'/>
            </TopBarBox>

            <Grid
                columns={{initial: '1fr', xs: 'auto 1fr'}}
                gap='3'
                maxHeight='100%'
                overflow='hidden'
                pl='env(safe-area-inset-left)'
                pr='env(safe-area-inset-right)'
            >

                <Box pb='3' pt='3' pl='3' display={{ initial: 'none', xs: 'block' }}>
                    <DesktopSideBar />
                </Box>

                {children}

            </Grid>            
        </>

    )
}


function DesktopSideBar() {
    const iconSize = '21'

    return (
        <Card variant='classic' style={{ height: '100%' }}>

            <Flex direction='column' gap='1' justify='between' height='100%'>

                <SideBarBtn href='/capsules' message='Capsules'>
                    <FlaskRound size={iconSize} />
                </SideBarBtn>

                <SideBarBtn href='/activities' message='Activités'>
                    <Puzzle size={iconSize} />
                </SideBarBtn>

                <SideBarBtn href='/reports' message='Rapports'>
                    <NotepadText size={iconSize} />
                </SideBarBtn>

                <Box height='100%' display={{ initial: 'none', xs: 'block' }}></Box>

                <SideBarBtn href='/resources' message='Ressources'>
                    <BookOpen size={iconSize} />
                </SideBarBtn>

                <SideBarBtn href='/settings' message='Paramètres'>
                    <Cog size={iconSize} />
                </SideBarBtn>

            </Flex>

        </Card>
    )
}


function DesktopTopBar(props: BoxProps) {
    const logoScale = 0.25

    return (
        <Box {...props}>
            <Flex align='center' justify='between'>
                <Image src='/images/logo.png' width={386 * logoScale} height={105 * logoScale} alt="Pratico" />
                <UserInfo />
            </Flex>
        </Box>
    )
}

function MobileTopBar(props: BoxProps) {
    return (
        <Box {...props}>
            <Flex justify='center'>
                <DashboardTabs />
            </Flex> 
        </Box>
    )
}