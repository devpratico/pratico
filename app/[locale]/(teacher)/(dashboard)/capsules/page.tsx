import { ScrollArea, Grid, Card, Container, Section, AspectRatio, Button, SegmentedControl, Flex, TextField, Box, IconButton, Heading, Text } from "@radix-ui/themes"
import { Plus, LayoutGrid, List, Search } from "lucide-react"
import { fetchUser } from "@/app/api/_actions/user";
import { fetchCapsulesData } from "@/app/api/_actions/capsule";
import { TLEditorSnapshot } from "tldraw";
import { Link } from "@/app/_intl/intlNavigation";
import Thumbnail from "@/app/[locale]/_components/Thumbnail";
import Menu from "./_components/Menu";
import CreateCapsuleBtn from "./_components/CreateCapsuleBtn";


export default async function Page() {
    const { user, error } = await fetchUser()

    let capsules: any[] = []
    if (user) {
        const { data, error } = await fetchCapsulesData(user.id)
        if (data) capsules = data
    }


    return (
        <ScrollArea>
            <Container pr='3' pl={{ initial: '3', xs: '0' }}>
                <Section>

                    <Flex justify='between' mb='3'>
                        <CreateCapsuleBtn message='Créer' />

                        <Flex gap='3' align='center'>

                            <SegmentedControl.Root defaultValue='grid'>
                                <SegmentedControl.Item value='grid'>
                                    <Flex><LayoutGrid size='18' /></Flex>
                                </SegmentedControl.Item>

                                <SegmentedControl.Item value='list'>
                                    <Flex><List size='18' /></Flex>
                                </SegmentedControl.Item>
                            </SegmentedControl.Root>

                            <Box display={{ initial: 'none', md: 'block' }}>
                                <TextField.Root placeholder='Rechercher' disabled>
                                    <TextField.Slot>
                                        <Search size='18' />
                                    </TextField.Slot>
                                </TextField.Root>
                            </Box>

                            <Box display={{ initial: 'block', md: 'none' }}>
                                <IconButton variant='ghost'><Search size='18' /></IconButton>
                            </Box>

                        </Flex>
                    </Flex>

                    <Grid columns='repeat(auto-fill, minmax(200px, 1fr))' gap='3'>
                        {capsules.map((cap) => {
                            const id = cap.id
                            const title = cap.title || "Sans titre"
                            const created_at = new Date(cap.created_at)
                            const snap = cap.tld_snapshot?.[0] as TLEditorSnapshot | undefined// as TLStoreSnapshot | undefined

                            let url = `/capsule/${id}`

                            return (
                                <Box position='relative' key={id}>
                                    <Link href={url} style={{ all: 'unset'}}>
                                        <Miniature title={title} createdAt={created_at}>
                                            {snap && <Thumbnail snapshot={snap} scale={0.2} />}
                                        </Miniature>
                                    </Link>
                                    <Menu capsuleId={id} key={id} />
                                </Box>
                            )
                        })}
                    </Grid>

                </Section>
            </Container>
        </ScrollArea>
    )
}


interface MiniatureProps {
    title?: string;
    createdAt?: Date;
    children?: React.ReactNode;
}


function Miniature({ title, createdAt, children }: MiniatureProps) {
    return (
        <Flex direction='column' gap='1'>
            <Card style={{padding:'0'}}>
                <AspectRatio ratio={16 / 9}>
                    {children}
                </AspectRatio>
            </Card>
            <Heading as='h2' size='3'>{title}</Heading>
            <Text size='1'>{createdAt?.toLocaleDateString()}</Text>
        </Flex>
    )
}