import { TopBarBox } from "../layout"
import { Box, Flex, Grid, Text } from "@radix-ui/themes"
import { Puzzle, NotepadText, Cog, BookOpen, FlaskRound } from 'lucide-react';
import SideBarBtn from "./SideBarBtn";

export default function Layout({ children }: { children: React.ReactNode }) {
    const iconSize = '21'

    return (
        <> 
            <TopBarBox>
                <Text size='3' weight='bold'>TiKO</Text>
            </TopBarBox>

            <Grid columns='auto 1fr' gap='3' maxHeight='100%' overflow='hidden'>

                <Box py='3' pl='3'>
                    <Box p='3' style={{
                        height: '100%',
                        boxSizing: 'border-box',
                        backgroundColor: 'var(--accent-contrast)',
                        borderRadius: 'var(--radius-3)',
                        boxShadow: 'var(--shadow-2)',
                    }}>

                        <Flex direction='column' gap='1' justify='between' style={{ height: '100%' }}>
                            <Flex direction='column' gap='1'>
                                <SideBarBtn href='/responsive/capsules'>
                                    <FlaskRound size={iconSize} />Capsules
                                </SideBarBtn>

                                <SideBarBtn href='/responsive/activities'>
                                    <Puzzle size={iconSize} />Activities
                                </SideBarBtn>

                                <SideBarBtn href='#'>
                                    <NotepadText size={iconSize} />Rapports
                                </SideBarBtn>
                            </Flex>

                            <Flex direction='column' gap='1'>
                                <SideBarBtn href='#'>
                                    <BookOpen size={iconSize} />Ressources
                                </SideBarBtn>

                                <SideBarBtn href='#'>
                                    <Cog size={iconSize} />Paramètres
                                </SideBarBtn>
                            </Flex>
                        </Flex>

                    </Box>
                </Box>

                {children}

            </Grid>            
        </>

    )
}