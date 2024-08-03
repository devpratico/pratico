'use client'
import { useTLEditor } from "@/app/_hooks/useTLEditor"
import { useParams } from "next/navigation"
import { Flex, Button, Progress, AlertDialog, RadioGroup, Heading, Separator, Card, Text, Box, Grid } from "@radix-ui/themes"
import { ArrowDown, Plus, File, CircleCheck } from "lucide-react"
import { useRef, useState } from "react"
import logger from "@/app/_utils/logger"
import { useNav } from "@/app/_hooks/useNav"
import { useDisable } from "@/app/_hooks/useDisable"
//import importPdfBackground2 from "@/app/api/_actions/importPdfBackground2"

import { convertPdfToImages } from "@/app/_utils/pdfUtils"



export default function AddMenu() {
    //const { editor } = useTLEditor()
    //const { capsule_id: capsuleId } = useParams<{ capsule_id: string }>()
    const { newPage } = useNav()
    const { disabled, setDisabled } = useDisable()

    return (
        <Flex gap='3' direction='column'>

            <ImportDocumentBtn />

            <Button variant='outline' style={{ justifyContent: 'start' }} onClick={() => newPage?.()} disabled={disabled}>
                <Plus size='15' /> Page blanche
            </Button>

        </Flex>
        
    )
}




function ImportDocumentBtn() {
    const { capsule_id: capsuleId } = useParams<{ capsule_id: string }>()
    const { disabled, setDisabled } = useDisable()
    const [fileName, setFileName] = useState<string | undefined>(undefined)
    const [state, setState] = useState<'idle' | 'loading' | 'success'>('idle')

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setState('loading')
        const file = event.target.files ? event.target.files[0] : null;
        if (!file) return

        const name = file?.name
        setFileName(name)
        logger.log('system:file', 'File received locally', name, file?.type)

        const images = await convertPdfToImages({ file })

        logger.log('system:file', 'Images received', images)
    }

    return (
        <AlertDialog.Root>

            <AlertDialog.Trigger>
                <Button disabled={disabled} style={{ justifyContent: 'start' }}>
                    <File size='15' /> Document
                </Button>
            </AlertDialog.Trigger>

            <AlertDialog.Content>
                <AlertDialog.Title>Importer un document</AlertDialog.Title>
                <AlertDialog.Description>
                    Vous pouvez importer un document PDF pour l'ajouter à votre capsule.
                </AlertDialog.Description>




                <Card variant='surface' my='4'>

                    <Flex justify='center' display={state=='idle' ? 'flex' : 'none'}>

                        {/*<Box p='3' style={{ border: '2px dashed var(--gray-6)', borderRadius: 'var(--radius-3)' }}>
                            <Text color='gray'>Déposer ici</Text>
                        </Box>*/}

                        <Button asChild>
                            <label htmlFor='input'>Importer</label>
                        </Button>

                        <input
                            id='input'
                            style={{ display: 'none' }}
                            type="file"
                            accept="application/pdf"
                            onChange={handleFileChange}
                        />
                    </Flex>

                    <Flex direction='column' align='center' gap='3' display={state=='loading' ? 'flex' : 'none'}>
                        <Flex align='center' gap='1' style={{color:'var(--gray-10)'}}>
                            <File size='18' />
                            <Text trim='both'>{fileName}</Text>
                        </Flex>
                        <Box width='100%'>
                            <Progress/>
                        </Box> 
                    </Flex>

                    <Flex direction='column' align='center' gap='3' display={state == 'success' ? 'flex' : 'none'}>
                        <CircleCheck size='30' style={{ color: 'var(--green)' }} />
                        <Flex align='center' gap='1' style={{ color: 'var(--green)' }}>
                            <File size='18' />
                            <Text trim='both'>{fileName}</Text>
                        </Flex>
                    </Flex>

                </Card>


                <Heading size='2'>Positionner les pages</Heading>
                <RadioGroup.Root defaultValue='end' disabled>
                    <RadioGroup.Item value='end'>À la fin</RadioGroup.Item>
                    <RadioGroup.Item value='current'>À la position actuelle</RadioGroup.Item>
                </RadioGroup.Root>

                <Flex justify='between' mt='4'>
                    <AlertDialog.Cancel>
                        <Button variant='soft'>Annuler</Button>
                    </AlertDialog.Cancel>
                

                    <AlertDialog.Action>
                        <Button disabled={state != 'success'}>Ok</Button>
                    </AlertDialog.Action>

                </Flex>


            </AlertDialog.Content>

        </AlertDialog.Root>
    )
}