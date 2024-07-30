'use client'
import { Grid, Heading, Flex, Button, Text, Code, Box, Switch, IconButton } from "@radix-ui/themes";
import { Copy, QrCode } from "lucide-react";
import QRCode from 'react-qr-code';
import { useState, useEffect } from "react";
import Image from "next/image";
import TooltipL from "@/app/[locale]/_components/TooltipL";
import { useParams } from "next/navigation";
import CardDialog from "../../../_components/CardDialog";


export default function StartDialog() {
    const { room_code } = useParams() as { room_code: string }
    const [baseUrl, setBaseUrl] = useState('')
    const [showCopied, setShowCopied] = useState(false)
    const [copyMessage, setCopyMessage] = useState('Copier')
    const [open, setOpen] = useState(true)

    const link = baseUrl + '/' + room_code

    useEffect(() => {
        setBaseUrl(window.location.origin)
    }, [setBaseUrl])

    return (
        <CardDialog trigger={<IconButton><QrCode /></IconButton>} open={open} setOpen={setOpen}>

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

                    <Heading size='8' align='center'>{`La session est en cours`}</Heading>

                    <Flex direction='column' align='center'>
                        <Text align='center'>{`Envoyez le lien suivant aux participants :`}</Text>

                        <Flex align='center' gap='3'>
                            <Text align='center' ><Code size='5'>{link}</Code></Text>
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



                    <TooltipL content='Bientôt' side='left'>
                        <Flex as='span' gap='2' align='center'>
                            <Switch disabled />
                            <Text color='gray'>{`Émargement`}</Text>
                        </Flex>
                    </TooltipL>



                    <Button size='4' id='OkBtn' onClick={() => setOpen(false)}>
                        {`C'est parti !`}
                    </Button>



                </Flex>


            </Grid>
        </CardDialog>
    )
}