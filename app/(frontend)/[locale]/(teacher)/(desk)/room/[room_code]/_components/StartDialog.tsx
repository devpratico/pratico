'use client'
import { Grid, Heading, Flex, Button, Text, Code, Box, IconButton, VisuallyHidden, Callout, Strong } from "@radix-ui/themes";
import { Copy, QrCode } from "lucide-react";
import QRCode from 'react-qr-code';
import { useState, useEffect } from "react";
import Image from "next/image";
import TooltipL from "@/app/(frontend)/[locale]/_components/TooltipL";
import { useParams } from "next/navigation";
import CardDialog from "../../../_components/CardDialog";
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { useUser } from "@/app/(frontend)/_hooks/useUser";
import GoPremiumBtn from "../../../../_components/GoPremiumBtn";
import createClient from "@/supabase/clients/client";
import logger from "@/app/_utils/logger";
import { SessionInfoType } from "../../../../(dashboard)/reports/[room_id]/page";


export default function StartDialog() {
    const { room_code } = useParams() as { room_code: string }
    const [baseUrl, setBaseUrl] = useState('')
    const [showCopied, setShowCopied] = useState(false)
    const [copyMessage, setCopyMessage] = useState('Copier')
    const [open, setOpen] = useState(true)
    const { isSubscribed } = useUser()
    const supabase = createClient();
    const { user } = useUser();

    useEffect(() => {
        const getReportData = async () => {
            if (!user)
                return;
            let capsuleTitle: string | null = null;
            const { data: roomData, error: roomError } = await supabase.from('rooms').select('id, created_at, status, capsule_id').eq("created_by", user.id).eq('code', room_code).single();
            if (roomError) {
                logger.log("next:page", "TeacherViewPage", "room error", roomError);
                throw (roomError);
            }
            if (roomData)
            {
                if (roomData.capsule_id)
                {
                    const { data: capsuleData, error: capsuleError } = await supabase.from("capsules").select("title").eq("id", roomData.capsule_id).single();
                    if (!capsuleData || capsuleError)
                        logger.error('supabase:database', 'ReportsPage', capsuleError ? capsuleError : 'No capsule data');
                    else
                        capsuleTitle = capsuleData.title;
                }
                const { data: attendanceData, error: attendanceError } = await supabase.from('attendance').select('id').eq('room_id', roomData.id);
            }
        };
        getReportData();
    }, [room_code, supabase, user]);

    const link = baseUrl + '/' + room_code
    const linkWithoutProtocol = link.replace(/^https?:\/\//, '')

    useEffect(() => {
        setBaseUrl(window.location.origin)
    }, [setBaseUrl])

    return (
        <CardDialog
            open={open} onOpenChange={setOpen}
            trigger={<IconButton style={{backgroundColor:'transparent'}}><QrCode /></IconButton>}
        >

            <Grid
                columns={{ initial: '1', xs: '2' }}
                rows='1'
                p='5'
                width='100%'
                height='100%'
            >

                <Box display={{ initial: 'none', xs: 'block' }}>
                    <QRCode value={link} size={200} style={{ height: "100%", width: "100%" }} />
                </Box>

                <Flex direction='column'  align='center' gap='3' justify='between'>


                    <Box position='relative' width='100%' height='40%'>
                        <Image src='/illustrations/rocket.svg' alt='rocket' layout='fill' objectFit='contain' />
                    </Box>

                    <DialogPrimitive.Title asChild>
                        <Heading size='8' align='center'>La session est en cours</Heading>
                    </DialogPrimitive.Title>

                    <VisuallyHidden>
                        <DialogPrimitive.Description>
                            {`Vous pouvez maintenant partager le lien de la session avec les participants.`}
                        </DialogPrimitive.Description>
                    </VisuallyHidden>


                    <Flex align='center' display={ isSubscribed ? 'none' : 'flex'}>
                        <Text color='gray' size='2'>Le nombre de participants est limité à <Strong>10</Strong>.</Text>
                        <GoPremiumBtn size='1' ml='3'/>
                    </Flex>

                    <Flex direction='column' align='center'>
                        <Text align='center'>{`Envoyez le lien suivant aux participants :`}</Text>

                        <Flex align='center' gap='3'>
                            <Text align='center'><Code size='8'>{linkWithoutProtocol}</Code></Text>
                            <TooltipL content={copyMessage} side='right' open={showCopied} onOpenChange={setShowCopied}>
                                <IconButton
                                    variant='ghost'
                                    tabIndex={-1}
                                    onClick={() => {
                                        navigator.clipboard.writeText(link)
                                        setShowCopied(true)
                                        setCopyMessage('Copié !')
                                        setTimeout(() => {
                                            setShowCopied(false)
                                            setCopyMessage('Copier')
                                    }, 2000)
                                }}>
                                    <Copy size={16} />
                                </IconButton>
                            </TooltipL>
                        </Flex>
                    </Flex>

                    <Button size='4' id='OkBtn' onClick={() => setOpen(false)}>
                        {`C'est parti !`}
                    </Button>



                </Flex>


            </Grid>
        </CardDialog>
    )
}