'use client'
import DeskMenuLayout from "../../DeskMenuLayout/DeskMenuLayout"
import importPdfBackground, {ImportPdfBackgroundArgs} from "@/app/_utils/tldraw/importPdfBackground"
import { useTLEditor } from "@/app/[locale]/_hooks/useTLEditor"
import { useParams } from "next/navigation"
import useIsLocalDoc from "@/app/[locale]/_hooks/useIsLocalDoc"
import { Card, Grid, AspectRatio, Section, Heading, Flex, Button, Text } from "@radix-ui/themes"
import { ArrowDown } from "lucide-react"
import { useRef } from "react"
import logger from "@/app/_utils/logger"
import { useNav } from "@/app/[locale]/_hooks/useNav"



export default function Add() {

    const { editor } = useTLEditor()
    const { capsule_id: capsuleId } = useParams<{ capsule_id: string }>()
    const isLocalDoc = useIsLocalDoc()
    const { newPage } = useNav()

    
    // This is for the PDF import
    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (file && file.type === "application/pdf" && editor) {
            logger.log('system:file', 'File received', file.name, file.type)
            // Depending on wether we have a local document or a supabase document, the pdf import will be handled differently
            const pdfDestination: ImportPdfBackgroundArgs['destination'] = isLocalDoc ? { saveTo: 'local' } : { saveTo: 'supabase', capsuleId }
            importPdfBackground({ file, editor, destination: pdfDestination })
        } else {
            logger.log('system:file', 'File is not a PDF', file?.type)
            alert('Please select a PDF file.');
        }
        fileInputRef.current!.value = '';
    };
    
    const handleClick = () => {
        fileInputRef.current?.click();
    };

    if (!editor) return null

    // TODO: NavProvider is provided at different places, maybe it should be provided at a higher level
    return (
        <DeskMenuLayout menu="add">


            <Section size='1'>
                <Heading size='3' as="h3" trim='both'>DOCUMENTS</Heading>
                {/*<Separator size="4"/>*/}

                <Grid columns="2" gap='2' pt='2'>

                    <TemplateCard>
                        <Flex direction='column' gap='2'>
                            <Text align='center' weight='bold' color='violet'>PDF</Text>
                            <Button size='1' variant='soft' onClick={handleClick}><ArrowDown size='15'/>Importer</Button>
                        </Flex>
                        <input
                            type="file"
                            accept="application/pdf"
                            style={{ display: 'none' }}
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />
                    </TemplateCard>


                    {/*<TemplateCard>
                        <Flex direction='column' gap='2'>
                            <Text align='center' weight='bold' color='violet'>PowerPoint</Text>
                            <Button size='1' variant='soft' disabled><ArrowDown size='15'/>Importer</Button>
                        </Flex>
                    </TemplateCard>*/}

                    <TemplateCard>
                        <Flex direction='column' gap='2'>
                            <Text align='center' weight='bold' color='violet'>Image</Text>
                            <Button size='1' variant='soft' disabled><ArrowDown size='15'/>Importer</Button>
                        </Flex>
                    </TemplateCard>

                </Grid>
            </Section>

            <Section size='1'>
                <Heading size='3' as="h3" trim='both'>TEMPLATES</Heading>
                <Grid columns="2" gap='2' pt='2'>
                    <Button onClick={() => newPage?.()} variant='ghost' style={{all: 'unset'}}>
                        <TemplateCard/>
                    </Button>
                </Grid>
            </Section>

        </DeskMenuLayout>
        
    )
}



interface TemplateCardProps {
    backgroundColor?: string
    children?: React.ReactNode
}

function TemplateCard({ backgroundColor, children }: TemplateCardProps) {
    return (
        <AspectRatio ratio={16 / 9}>
            <Card variant='classic' style={{height:'100%', backgroundColor: backgroundColor}}>
                {children}
            </Card>
        </AspectRatio>
    )
}