import { TopBarBox } from "../layout"
import { Grid, Card, Box, Flex } from "@radix-ui/themes"
import MenuDialog from "./_components/MenuDialog"
import Menus from "./_components/Menus"
import Carousel from "./_components/Carousel"
import Controls from "./_components/Controls"
import { TLEditorProvider } from "@/app/_hooks/useTLEditor"
import { NavProvider } from "@/app/_hooks/useNav"
import TLToolbar from "../../_components/canvases/custom-ui/tool-bar/TLToolbar"
import MobileControls from "./_components/MobileControls"



export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <TLEditorProvider>
        <NavProvider>
            {/**
             * Top bar, as defined in the parent layout
             * It is empty because the content is defined in the children
             * The children will use `TopBarPortal` to render inside this component.
             */}
            <TopBarBox/>
            

            {/**
             * The main content will contain the canvas and the carousel + controls.
             * The menus layout is also defined here.
             */}
            <Grid
                rows={{ initial: '1fr auto', xs: '1fr 60px' }}
                py='3'
                gap='3'
                pl='max(env(safe-area-inset-left), 12px)'
                pr='max(env(safe-area-inset-right), 12px)'
                position='relative'
                overflowY='clip' // Necessary for mobile landscape - the toolbar overflows
            >

                {/* Main content. Canvas will go here */}
                <Flex gap='3' overflowY='clip'>
                    <Flex direction='column' gap='3' justify='center' display={{ initial: 'none', xs: 'flex' }} style={{zIndex:'1'}}>
                        <TLToolbar />
                    </Flex>
                    {children}
                </Flex>

                

                {/* Menus layout (outside the grid layout because of `absolute`)*/}
                <Box position='absolute' top='0' bottom='0' right='0' width='100%' style={{pointerEvents: 'none'}}>
                    <MenuDialog>
                        <Menus />
                    </MenuDialog>
                </Box>

                {/* Carousel + controls for desktop */}
                <Grid columns='1fr auto' gap='3' height='auto' display={{initial: 'none', xs: 'grid'}}>
                    <Carousel/>
                    <Card variant='classic'><Controls/></Card>
                </Grid>

                {/* Controls for mobile */}
                <Box display={{ initial: 'block', xs: 'none' }}>
                    <MobileControls/>
                </Box>

                

            </Grid>
        </NavProvider>
        </TLEditorProvider>
    )
}