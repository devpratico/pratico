import { Container, Section, Box, Heading, Flex } from "@radix-ui/themes"
import Image from "next/image"
import { DownloadPDFBtn } from "./_components/DownloadPDFBtn"
import createClient from "@/supabase/clients/server"
import logger from "@/app/_utils/logger"

export default async function ClosedRoomPage({ params }: { params: { room_id: string } }) {
    const supabase = createClient()
    const { data, error } = await supabase.from("rooms").select("capsules(tld_snapshot)").eq("id", params.room_id).single();
    if (error || !data || !data.capsules || !data.capsules.tld_snapshot)
    {
        logger.error("supabase:database", "ClosedRoomPage", error ? `Error fetching room ${error.message}` : "No data found");
        throw (error);
    }
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
                    <DownloadPDFBtn capsuleSnapshot={data.capsules.tld_snapshot} />
                    {/* <Button variant='ghost' color='gray'>Signaler un problème</Button> */}
                </Flex>
            </Section>
        </Container>
    )
}