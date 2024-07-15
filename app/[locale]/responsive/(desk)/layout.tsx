import { TopBarBox } from "../layout"
import MenuTabs from "./capsule/_components/MenuTabs"
import { Grid, Card, Box, Flex } from "@radix-ui/themes"


export default function Layout({children }: { children: React.ReactNode }) {
    return (
        <>
            <TopBarBox pb='env(safe-area-inset-bottom)'>
                <MenuTabs />
            </TopBarBox>

            <Grid rows='1fr auto'>
                {children}

                <Grid columns='1fr auto' gap='3' p='3' height='90px' display={{initial: 'none', md: 'grid'}}>
                    <Card variant='classic'>Desktop controls</Card>
                    <Card variant='classic'>Desktop controls</Card>
                </Grid>

                <Flex direction='column' display={{initial: 'flex', md: 'none'}} p='3' gap='3'>
                    <Card variant='classic'>Mobile controls</Card>
                    <Card variant='classic'>Mobile controls</Card>
                    <Card variant='classic'>Mobile controls</Card>
                </Flex>

            </Grid>

        </>
    )
}