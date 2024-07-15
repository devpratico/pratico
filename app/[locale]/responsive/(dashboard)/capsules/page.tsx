import { ScrollArea, Grid, Card, Container, Section, AspectRatio, Button, SegmentedControl, Flex, TextField, Box, IconButton } from "@radix-ui/themes"
import { Plus, LayoutGrid, List, Search } from "lucide-react"

export default function Page() {
    return (
        <ScrollArea>
            <Container pr='3' pl={{initial: '3', sm: '0'}}>
                <Section>

                    <Flex justify='between' mb='3'>
                        <Button><Plus/>Créer</Button>

                        <Flex gap='3' align='center'>

                            <SegmentedControl.Root defaultValue='grid'>
                                <SegmentedControl.Item value='grid'>
                                    <Flex><LayoutGrid size='18'/></Flex>
                                </SegmentedControl.Item>

                                <SegmentedControl.Item value='list'>
                                    <Flex><List size='18'/></Flex>
                                </SegmentedControl.Item>
                            </SegmentedControl.Root>

                            <Box display={{initial: 'none', sm: 'block'}}>
                                <TextField.Root placeholder='Rechercher' disabled>
                                    <TextField.Slot>
                                        <Search size='18' />
                                    </TextField.Slot>
                                </TextField.Root>
                            </Box>

                            <Box display={{initial: 'block', sm: 'none'}}>
                                <IconButton variant='ghost'><Search size='18' /></IconButton>
                            </Box>
                            
                        </Flex>
                    </Flex>
                    
                    <Grid columns='repeat(auto-fill, minmax(200px, 1fr))' gap='3'>
                        {Array.from({length: 100}).map((_, i) => (
                            <Card variant='classic' key={i}>
                                <AspectRatio ratio={16 / 9}>
                                </AspectRatio>
                            </Card>
                        ))}
                    </Grid>

                </Section>
            </Container>
        </ScrollArea>
    )
}