import { TopBarBox } from "../layout"
import MenuTabs from "./capsule/_components/MenuTabs"
import { Grid, Card, Box, Flex, Dialog } from "@radix-ui/themes"
import MenuDialog from "./MenuDialog"


export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <TopBarBox> {/*pb='env(safe-area-inset-bottom)'*/}
                <MenuTabs />
            </TopBarBox>

            <Grid
                rows='1fr auto'
                py='3'
                gap='3'
                pl='max(env(safe-area-inset-left), 12px)'
                pr='max(env(safe-area-inset-right), 12px)'
                position='relative'
            >


                {children}

                {/*<Box position='absolute' right='var(--space-3)'
                    style={{backgroundColor:'var(--accent-1)', boxShadow:'var(--shadow-5)', borderRadius:'var(--radius-3)'}}>
                    Menu
                </Box>*/}

                <Box position='absolute' height='100%' width='100%'> {/*style={{backgroundColor:'red'}}*/}
                    <MenuDialog />
                </Box>

                

                <Grid columns='1fr auto' gap='3' height='90px' display={{initial: 'none', xs: 'grid'}}>
                    <Card variant='classic'>Desktop controls</Card>
                    <Card variant='classic'>Desktop controls</Card>
                </Grid>

                <Flex direction='column' display={{initial: 'flex', xs: 'none'}} gap='3'>
                    <Card variant='classic'>Mobile controls</Card>
                    <Card variant='classic'>Mobile controls</Card>
                    <Card variant='classic'>Mobile controls</Card>
                </Flex>

            </Grid>

        </>
    )
}