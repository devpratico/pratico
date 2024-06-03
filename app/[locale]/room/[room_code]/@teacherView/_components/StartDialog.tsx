'use client'
import { Grid, Heading, Flex, Button, Text, Code, Tooltip, Box, Switch, IconButton } from "@radix-ui/themes";
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Copy } from "lucide-react";
import QRCode from 'react-qr-code';
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useMenus } from "@/app/[locale]/_hooks/useMenus";


interface StartDialogProps {
    roomCode: string;
}

export default function StartDialog({ roomCode }: StartDialogProps) {

    const { openedDeskMenu, setOpenDeskMenu } = useMenus()
    const setOpen = useCallback((open: boolean) => {setOpenDeskMenu( open ? 'qr' : undefined)}, [setOpenDeskMenu])
    const open = openedDeskMenu === 'qr'

    const [portal, setPortal] = useState<HTMLElement | null>(null)
    const [baseUrl, setBaseUrl] = useState('')
    const [showCopied, setShowCopied] = useState(false)
    const [copyMessage, setCopyMessage] = useState('Copier')

    const link = baseUrl + '/' + roomCode

    useEffect(() => {
        setPortal(document?.getElementById('startModalContainer'))
        setOpen(true)
        setBaseUrl(window.location.origin)
    }, [setOpen])


    return (
        <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
        
            <DialogPrimitive.Portal container={portal}>

                <DialogPrimitive.Overlay className='overlay' style={{position:'absolute', inset:'0', backgroundColor:'black', opacity:'0.5'}}/>

                <DialogPrimitive.Content 
                    //onOpenAutoFocus={e => e.preventDefault()}
                    style={{
                        position:'absolute',
                        inset:'3rem',
                        backgroundColor:'white',
                        borderRadius:'1rem',
                        padding:'2rem',
                        boxShadow:'0 0 10px rgba(0,0,0,0.1)',
                        display:'flex',
                        alignItems:'center',
                        overflow:'auto'}}
                    >

                    <Grid columns='2' rows='1' style={{width:'100%', maxHeight:'100%'}}>
                        <QRCode value={link} size={200} style={{ height: "100%", width: "100%" }} />

                            <Flex direction='column'  align='center' gap='3'>

                            <Box height='100%' />

                            <Image src='/illustrations/rocket.svg' height={100} width={100} alt='rocket' style={{minWidth:'40%', minHeight:'40%'}}/>

                            <Heading size='8' align='center'>{`La session est en cours`}</Heading>
                            <Text align='center'>{`Envoyez le lien suivant à vos apprenants :`}</Text>

                            <Flex align='center' gap='3'>
                                <Text align='center' ><Code size='5'>{link}</Code></Text>
                                <Tooltip content={copyMessage} side='right' open={showCopied} onOpenChange={setShowCopied}>
                                    <IconButton variant='ghost' onClick={() => {
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
                                </Tooltip>
                            </Flex>

                            <Box height='100%' />

                            <Tooltip content='Bientôt' side='left'>
                                <Flex as='span' gap='2' align='center'>
                                    <Switch disabled />
                                    <Text color='gray'>{`Émargement`}</Text>
                                </Flex>
                            </Tooltip>

                            <Box height='100%' />

                            <Button size='4' onClick={() => setOpen(false)}>{`C'est parti !`}</Button>

                            <Box height='100%' />

                        </Flex>


                    </Grid>

                </DialogPrimitive.Content>

            </DialogPrimitive.Portal>


        </DialogPrimitive.Root>
    )
}