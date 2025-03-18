import { ScrollArea, Container, Section, Flex, Box, IconButton, Grid, Callout, Card, Button, Link, Text } from "@radix-ui/themes"
import { AlertTriangle, Star, Gem } from "lucide-react"
import { fetchUser } from "@/app/(backend)/api/user/user.server";
import { fetchCapsulesDataAndRoomStatus } from "@/app/(backend)/api/capsule/capsule.server";
import { CapsulesDisplay } from "./_components/CapsulesDiplay";
import { CapsuleType } from "../reports/page";
import logger from "@/app/_utils/logger";
import { customerIsSubscribed } from "@/app/(backend)/api/stripe/stripe.server";
import LinkButton from "../../../_components/LinkButton";

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

    const isSubscribed = await customerIsSubscribed(user?.id);

    return (
        <ScrollArea>
            <Container pr='3' pl={{ initial: '3', xs: '0' }}>

                { !isSubscribed && <Banner /> }

                <Section>
                    <CapsulesDisplay capsules={capsules} />
                </Section>
            </Container>
        </ScrollArea>
    )
}


function Banner() {
    return (
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

                    <Flex direction='column' justify='center' gap='1' p='3' style={{
                        backgroundColor: 'var(--yellow-a3)',
                        borderRadius: 'var(--radius-3)',
                        color: 'var(--yellow-11)',
                    }}>
                        <LinkButton
                            color='yellow'
                            href="/subscribe"
                            target='_blank'
                        >
                            <Star />Passer à Pratico Pro
                        </LinkButton>
                        <Text size='2' align='center'>
                            Pour un nombre illimité de participants.
                        </Text>
                        <Text size='1' align='center' color='yellow' mt='3'>
                            Vous êtes une entreprise ?&nbsp;
                            <Link href="mailto:bonjour@pratico.live">Contactez-nous</Link>
                        </Text>
                    </Flex>
                </Grid>



            </Card>
        </Box>
    )
}