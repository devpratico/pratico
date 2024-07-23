import { TopBarBox } from "../layout"
import { Grid, Card, Box, Flex, Text, IconButton } from "@radix-ui/themes"
import MenuDialog from "./_components/MenuDialog"
import Menus from "./_components/Menus"
import { MousePointer2, Pen, Type, Shapes, Image as ImageLucid, Eraser, Plus, ChevronRight, ChevronLeft} from "lucide-react"
import Carousel from "./_components/Carousel"
import Controls from "./_components/Controls"
import { TLEditorProvider } from "@/app/_hooks/useTLEditor"
import { NavProvider } from "@/app/_hooks/useNav"



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
                rows='1fr auto'
                py='3'
                gap='3'
                pl='max(env(safe-area-inset-left), 12px)'
                pr='max(env(safe-area-inset-right), 12px)'
                position='relative'
            >

                {/* Canvas will go here */}
                {children}

                {/* Menus layout (outside the grid layout because of `absolute`)*/}
                <Box position='absolute' height='100%' width='100%'>
                    <MenuDialog>
                        <Menus />
                    </MenuDialog>
                </Box>

                {/* A box to portan Card dialogs inside (outside the grid layout because of `absolute`)*/}
                {/*<Box position='absolute' height='100%' width='100%' id='card-dialog-box'></Box>*/}

                {/* Carousel + controls for desktop */}
                <Grid columns='1fr auto' gap='3' height='auto' display={{initial: 'none', xs: 'grid'}}>
                    <Card variant='classic'><Carousel/></Card>
                    <Card variant='classic'><Controls/></Card>
                </Grid>

                {/* Controls for mobile */}
                <Flex direction='column' display={{initial: 'flex', xs: 'none'}} gap='3'>

                    <Card variant='classic'>
                        <Flex justify='between'>
                            <MousePointer2 />
                            <Pen />
                            <Type />
                            <Shapes />
                            <ImageLucid />
                            <Eraser />
                        </Flex>
                    </Card>

                    <Grid columns='2' gap='3'>
                        <Flex align='center' justify='center'><Text size='7'>1/12</Text></Flex>
                        <IconButton size='4' style={{width:'100%', boxShadow:'var(--shadow-2)'}}>
                            <Plus size='30' />
                        </IconButton>
                    </Grid>

                    <Grid columns='2' gap='3'>
                        <Card variant='classic'>
                            <Card style={{aspectRatio:'16/9'}}></Card>
                            <Flex justify='center' pt='2'>
                                <ChevronLeft size='30'/>
                            </Flex>
                        </Card>

                        <Card variant='classic'>
                            <Card style={{ aspectRatio: '16/9' }}></Card>
                            <Flex justify='center' pt='2'>
                                <ChevronRight size='30'/>
                            </Flex>
                        </Card>
                    </Grid>

                </Flex>

            </Grid>
        </NavProvider>
        </TLEditorProvider>
    )
}