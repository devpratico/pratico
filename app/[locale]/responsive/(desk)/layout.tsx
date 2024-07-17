import { TopBarBox } from "../layout"
import { Grid, Card, Box, Flex } from "@radix-ui/themes"
import MenuDialog from "./_components/MenuDialog"
import Menus from "./_components/Menus"



export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
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

                {/* Carousel + controls for desktop */}
                <Grid columns='1fr auto' gap='3' height='90px' display={{initial: 'none', xs: 'grid'}}>
                    <Card variant='classic'>Desktop controls</Card>
                    <Card variant='classic'>Desktop controls</Card>
                </Grid>

                {/* Carousel + controls for mobile */}
                <Flex direction='column' display={{initial: 'flex', xs: 'none'}} gap='3'>
                    <Card variant='classic'>Mobile controls</Card>
                    <Card variant='classic'>Mobile controls</Card>
                    <Card variant='classic'>Mobile controls</Card>
                </Flex>

            </Grid>

        </>
    )
}