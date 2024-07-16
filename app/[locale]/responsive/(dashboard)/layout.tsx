import { TopBarBox } from "../layout"
import { Box, BoxProps, Flex, Grid, Text, Card, TabNav } from "@radix-ui/themes"
import { Puzzle, NotepadText, Cog, BookOpen, FlaskRound } from 'lucide-react';
import { SideBarBtn, BottomBarBtnMobile } from "./SideBarBtn";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <> 
            <TopBarBox>
                <MobileTopBar  display={{ initial: 'block', xs: 'none' }} />
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

                <SideBarBtn href='/responsive/capsules' message='Capsules'>
                    <FlaskRound size={iconSize} />
                </SideBarBtn>

                <SideBarBtn href='/responsive/activities' message='Activités'>
                    <Puzzle size={iconSize} />
                </SideBarBtn>

                <SideBarBtn href='#' message='Rapports'>
                    <NotepadText size={iconSize} />
                </SideBarBtn>

                <Box height='100%' display={{ initial: 'none', xs: 'block' }}></Box>

                <SideBarBtn href='#' message='Ressources'>
                    <BookOpen size={iconSize} />
                </SideBarBtn>

                <SideBarBtn href='#' message='Paramètres'>
                    <Cog size={iconSize} />
                </SideBarBtn>

            </Flex>

        </Card>
    )
}


function DesktopTopBar(props: BoxProps) {
    return (
        <Box {...props}>
            <Text size='3' weight='bold'>TiKO</Text>
        </Box>
    )
}


function MobileTopBar(props: BoxProps) {
    const iconSize = '25'
    const strokeWidth = '1.5'

    return (
        <Box {...props}>
            <Flex justify='between' pt='2' pb='max(env(safe-area-inset-bottom, 8px), 8px)'>
                <BottomBarBtnMobile href='/responsive/capsules' message='Capsules'>
                    <FlaskRound size={iconSize} strokeWidth={strokeWidth}/>
                </BottomBarBtnMobile>

                <BottomBarBtnMobile href='/responsive/activities' message='Activités'>
                    <Puzzle size={iconSize} strokeWidth={strokeWidth}/>
                </BottomBarBtnMobile>

                <BottomBarBtnMobile href='#' message='Rapports'>
                    <NotepadText size={iconSize} strokeWidth={strokeWidth}/>
                </BottomBarBtnMobile>

                <BottomBarBtnMobile href='#' message='Ressources'>
                    <BookOpen size={iconSize} strokeWidth={strokeWidth}/>
                </BottomBarBtnMobile>

                <BottomBarBtnMobile href='#' message='Paramètres'>
                    <Cog size={iconSize} strokeWidth={strokeWidth}/>
                </BottomBarBtnMobile>  
            </Flex>
        </Box>
    )
}