import { TopBarBox } from "../layout"
import { Box, Flex, Grid, Text, Card } from "@radix-ui/themes"
import { Puzzle, NotepadText, Cog, BookOpen, FlaskRound } from 'lucide-react';
import SideBarBtn from "./SideBarBtn";

export default function Layout({ children }: { children: React.ReactNode }) {
    const iconSize = '21'

    return (
        <> 
            <TopBarBox>
                <Text size='3' weight='bold'>TiKO</Text>
            </TopBarBox>

            <Grid
                columns={{initial: '1fr', sm: 'auto 1fr'}}
                rows={{initial: '1fr auto', sm: '1fr'}}
                gap={{initial: '0', sm: '3'}}
                maxHeight='100%'
                overflow='hidden'
            >

                <Box pb='3' pt={{initial:'0', sm:'3'}} pl='3' pr={{initial:'3', sm:'0'}} gridRow={{initial: '2', sm: '1'}}>
                    {/*<Box
                        p={{initial: '1', sm: '3'}}
                        height='100%'
                        maxWidth='100%'
                        style={{
                            backgroundColor: 'var(--accent-1)',
                            borderRadius: 'var(--radius-3)',
                            boxShadow: 'var(--shadow-2)',
                        }}
                    >*/}
                    <Card variant='classic' style={{height: '100%'}}> 

                        <Flex direction={{initial:'row', sm:'column'}}  gap='1' justify='between' height='100%'>

                                <SideBarBtn href='/responsive/capsules' message='Capsules'>
                                    <FlaskRound size={iconSize} />
                                </SideBarBtn>

                                <SideBarBtn href='/responsive/activities' message='Activités'>
                                    <Puzzle size={iconSize} />
                                </SideBarBtn>

                                <SideBarBtn href='#' message='Rapports'>
                                    <NotepadText size={iconSize} />
                                </SideBarBtn>

                                <Box height='100%' display={{initial: 'none', sm: 'block'}}></Box>

                                <SideBarBtn href='#' message='Ressources'>
                                    <BookOpen size={iconSize} />
                                </SideBarBtn>

                                <SideBarBtn href='#' message='Paramètres'>
                                    <Cog size={iconSize} />
                                </SideBarBtn>

                        </Flex>

                    </Card>
                </Box>

                {children}

            </Grid>            
        </>

    )
}