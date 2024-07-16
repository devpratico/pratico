import { TopBarBox } from "../layout"
import MenuTabs from "./capsule/_components/MenuTabs"
import { Grid, Card, Box, Flex } from "@radix-ui/themes"


export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <TopBarBox pb='env(safe-area-inset-bottom)'>
                <MenuTabs />
            </TopBarBox>

            <Grid rows='1fr auto' py='3' gap='3' pl='max(env(safe-area-inset-left), 12px)' pr='max(env(safe-area-inset-right), 12px)'>

                <Grid columns='auto 1fr auto' gap='3'>
                    <Card variant='classic'>Toolbar</Card>
                    {children}
                    <Card variant='classic'>Menu</Card>
                </Grid>

                <Grid columns='1fr auto' gap='3' height='90px' display={{initial: 'none', md: 'grid'}}>
                    <Card variant='classic'>Desktop controls</Card>
                    <Card variant='classic'>Desktop controls</Card>
                </Grid>

                <Flex direction='column' display={{initial: 'flex', md: 'none'}} gap='3'>
                    <Card variant='classic'>Mobile controls</Card>
                    <Card variant='classic'>Mobile controls</Card>
                    <Card variant='classic'>Mobile controls</Card>
                </Flex>

            </Grid>

        </>
    )
}