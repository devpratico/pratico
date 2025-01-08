import { ScrollArea, Container, Section, SegmentedControl, Flex, TextField, Box, IconButton } from "@radix-ui/themes"
import { LayoutGrid, List, Search } from "lucide-react"
import { fetchUser } from "@/app/(backend)/api/user/user.server";
import { fetchCapsulesDataAndRoomStatus } from "@/app/(backend)/api/capsule/capsule.server";
import { CapsulesDisplay } from "./_components/CapsulesDiplay";
import { CapsuleType } from "../reports/page";
import logger from "@/app/_utils/logger";

export type ExtendedCapsuleType = CapsuleType & { roomOpen: boolean, roomCode: string | null | undefined }
export default async function Page() {
    const { user, error: userError } = await fetchUser()
    if (userError)
        logger.error("next:page", "fetchUser", userError);
    let capsules: ExtendedCapsuleType[] = []
    if (user) {
        const { data, error } = await fetchCapsulesDataAndRoomStatus(user.id);
        if (error)
            logger.error("next:page", "fetchCapsulesDataAndRoomStatus", error);
        if (data)
            capsules = data;
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
                    <CapsulesDisplay capsules={capsules} />

                </Section>
            </Container>
        </ScrollArea>
    )
}


