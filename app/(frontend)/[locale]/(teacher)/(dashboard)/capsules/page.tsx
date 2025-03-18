import { ScrollArea, Container, Section, Flex, Box, IconButton, Grid, Callout, Card, Button, Link, Text } from "@radix-ui/themes"
import { AlertTriangle, Star, Gem } from "lucide-react"
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

                <Box mt='3'>
                    <Card>
                        <Grid columns='2' gap='3'>
                            <Callout.Root color='crimson'>
                                <Callout.Icon>
                                    <AlertTriangle />
                                </Callout.Icon>
                                <Callout.Text>
                                    Vous êtes limité à 10 participants maximum par session.
                                </Callout.Text>
                            </Callout.Root>

                            <Flex direction='column' justify='center' gap='3' p='3' style={{
                                backgroundColor: 'var(--yellow-a3)',
                                borderRadius: 'var(--radius-3)',
                                color: 'var(--yellow-11)',
                            }}>
                                <Button color='yellow'><Star/>Passer à Pratico Pro</Button>
                                <Text size='2' align='center'>
                                    Pour un nombre illimité de participants.
                                </Text>
                                <Text size='1' align='center' color='yellow'>
                                    Vous êtes une entreprise ?&nbsp;
                                    <Link href="test.com">Contactez-nous</Link>
                                </Text>
                            </Flex>
                        </Grid>

                        

                    </Card>
                </Box>


                <Section>
                    <CapsulesDisplay capsules={capsules} />
                </Section>
            </Container>
        </ScrollArea>
    )
}


