import { ScrollArea, Grid, Card, Container, Section, AspectRatio, Heading, Button, SegmentedControl, Flex, TextField } from "@radix-ui/themes"
import { Plus, LayoutGrid, List, Search } from "lucide-react"

export default function Page() {
    return (
        <ScrollArea>
            <Container pr='3'>
                <Section>

                    <Heading as='h1' size='6'>Capsules</Heading>

                    <Flex justify='between' my='3'>
                        <Button><Plus/>Créer</Button>

                        <Flex gap='3'>
                            <TextField.Root placeholder='Rechercher'>
                                <TextField.Slot>
                                    <Search size='18'/>
                                </TextField.Slot>
                            </TextField.Root>

                            <SegmentedControl.Root defaultValue='grid'>
                                <SegmentedControl.Item value='grid'>
                                    <Flex><LayoutGrid size='18'/></Flex>
                                </SegmentedControl.Item>

                                <SegmentedControl.Item value='list'>
                                    <Flex><List size='18'/></Flex>
                                </SegmentedControl.Item>
                            </SegmentedControl.Root>
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