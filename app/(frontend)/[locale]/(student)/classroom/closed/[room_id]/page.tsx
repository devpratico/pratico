import { Container, Section, Box, Heading, Flex, Button } from "@radix-ui/themes"
import Image from "next/image"
import createClient from "@/supabase/clients/server"
import logger from "@/app/_utils/logger"
import { FileDown } from "lucide-react"
import { CapsuleToPdfBtn } from "@/app/(frontend)/[locale]/_components/CapsuleToPdfBtn"
import { getFormatter } from "next-intl/server"

export default async function ClosedRoomPage({ params }: { params: { room_id: string } }) {
    const supabase = createClient();
    const formatter = await getFormatter();
    const { data, error } = await supabase.from("rooms").select("capsule_snapshot, capsules(title, created_at)").eq("id", params.room_id).single();
    if (error || !data || !data.capsule_snapshot)
    {
        logger.error("supabase:database", "ClosedRoomPage", error ? `Error fetching room ${error.message}` : "No data found");
        throw (error);
    }
    const title = data.capsules && data.capsules.title || "Sans titre";
    const capsuleDate = data.capsules?.created_at ? formatter.dateTime(new Date(data.capsules.created_at), { dateStyle: "short" }) : "";
    return (
        <Container>
            <Section>
                <Box position='relative' width='100%' height='400px'>
                    <Image src='/illustrations/finished.svg' alt='rocket' layout='fill' objectFit='contain' />
                </Box>
                <Heading size='8' align='center' mb='5'>Session terminée</Heading>
            </Section>

            <Section>
                <Flex direction='column' justify='center' gap='5' align='center'>
                    <CapsuleToPdfBtn snapshot={data.capsule_snapshot} title={title} capsuleDate={capsuleDate}>
                        <Button size='4'>
                            <FileDown />Télécharger le support en pdf
                        </Button>
                    </CapsuleToPdfBtn>
                    {/* <Button variant='ghost' color='gray'>Signaler un problème</Button> */}
                </Flex>
            </Section>
        </Container>
    )
}