'use client'
import { Grid, Heading, Flex } from "@radix-ui/themes";
import * as DialogPrimitive from '@radix-ui/react-dialog';
import QRCode from 'react-qr-code';
import { useState, useEffect } from "react";


interface StartDialogProps {
    qrCodeLink: string;
}

export default function StartDialog({ qrCodeLink }: StartDialogProps) {

    const [open, setOpen] = useState(false)

    useEffect(() => {
        setOpen(true)
    }, [])


    return (
        <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
        
            <DialogPrimitive.Portal container={document ? document.getElementById('startModalContainer') : undefined}>

                <DialogPrimitive.Overlay className='overlay' style={{position:'absolute', inset:'0', backgroundColor:'black', opacity:'0.5'}}/>

                <DialogPrimitive.Content style={{position:'absolute', inset:'3rem', backgroundColor:'white', borderRadius:'1rem', padding:'2rem'}}>

                    <Grid columns='2' rows='1' style={{ height: "100%" }}>
                        <QRCode value={qrCodeLink} size={200} style={{ height: "100%", width: "100%" }} />
                        <Flex direction='column' justify='center' align='center'>
                            <Heading size='2'>{`C'est parti !`}</Heading>
                        </Flex>
                    </Grid>

                </DialogPrimitive.Content>

            </DialogPrimitive.Portal>


        </DialogPrimitive.Root>
    )
}