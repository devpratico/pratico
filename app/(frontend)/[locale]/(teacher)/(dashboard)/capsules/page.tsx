import { ScrollArea, Grid, Card, Container, Section, AspectRatio, SegmentedControl, Flex, TextField, Box, IconButton, Heading, Text } from "@radix-ui/themes"
import { LayoutGrid, List, Search } from "lucide-react"
import { fetchUser } from "@/app/(backend)/api/user/user.server";
import { fetchCapsulesData } from "@/app/(backend)/api/capsule/capsule.server";
import { TLEditorSnapshot } from "tldraw";
import { Link } from "@/app/(frontend)/_intl/intlNavigation";
import Thumbnail from "@/app/(frontend)/[locale]/_components/Thumbnail";
import Menu from "./_components/Menu";
import CreateCapsuleBtn from "./_components/CreateCapsuleBtn";
import { CapsulesDisplay } from "./_components/CapsulesDiplay";
import { CapsuleType } from "../reports/page";
import createClient from "@/supabase/clients/server";

export type ExtendedCapsuleType = CapsuleType & { roomOpen: boolean }
export default async function Page() {
    const { user, error } = await fetchUser()
    const supabase = createClient();

    let capsules: ExtendedCapsuleType[] = []
    if (user) {
        const { data, error } = await fetchCapsulesData(user.id)
        if (data) {
            await Promise.all(data.map(async (capsule) => {
                const { data: roomOpen } = await supabase.from('rooms').select('status').eq('capsule_id', capsule.id).eq('status', 'open');
                if (roomOpen && roomOpen.length > 0) {
                    capsules.push({ ...capsule, roomOpen: true })
                } else {
                    capsules.push({ ...capsule, roomOpen: false })
                }
            }));
        }
    }

    return (
        <ScrollArea>
            <Container pr='3' pl={{ initial: '3', xs: '0' }}>
                <Section>

           

                        <Flex gap='3' align='center'>

                            {/* <SegmentedControl.Root defaultValue='grid'>
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
                            </Box> */}

                            <Box display={{ initial: 'block', md: 'none' }}>
                                <IconButton variant='ghost'><Search size='18' /></IconButton>
                            </Box>

                        </Flex>
                    {/* </Flex> */}
					<CapsulesDisplay capsules={capsules} />

                </Section>
            </Container>
        </ScrollArea>
    )
}


