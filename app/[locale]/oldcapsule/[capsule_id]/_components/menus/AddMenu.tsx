'use client'
import DeskMenuLayout from "./DeskMenuLayout"
import importPdfBackground from "@/app/_utils/tldraw/importPdfBackground"
import { useTLEditor } from "@/app/_hooks/useTLEditor"
import { useParams } from "next/navigation"
import { Card, Grid, AspectRatio, Section, Heading, Flex, Button, Text, Progress } from "@radix-ui/themes"
import { ArrowDown } from "lucide-react"
import { useRef, useState } from "react"
import logger from "@/app/_utils/logger"
import { useNav } from "@/app/_hooks/useNav"
import { useDisable } from "@/app/_hooks/useDisable"



export default function AddMenu() {

    const { editor } = useTLEditor()
    const { capsule_id: capsuleId } = useParams<{ capsule_id: string }>()
    const { newPage } = useNav()
    const [pdfImportProgress, setPdfImportProgress] = useState<number | null>(null)
    const { disabled, setDisabled } = useDisable()

    
    // This is for the PDF import
    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setDisabled(true)
        const file = event.target.files ? event.target.files[0] : null;
        if (file && file.type === "application/pdf" && editor) {
            logger.log('system:file', 'File received', file.name, file.type)
            await importPdfBackground({ file, editor, destination: { saveTo: 'supabase', capsuleId }, progressCallback: setPdfImportProgress})
        } else {
            logger.log('system:file', 'File is not a PDF', file?.type)
            alert('Please select a PDF file.');
        }
        fileInputRef.current!.value = '';
        setPdfImportProgress(null)
        setDisabled(false)
    };
    
    const handleClick = () => {
        fileInputRef.current?.click();
    };

    if (!editor) return null

    // TODO: NavProvider is provided at different places, maybe it should be provided at a higher level
    return (
        <DeskMenuLayout menu="add">


            <Section size='1'>
                <Heading size='3' as="h3" mb='2' trim='both'>DOCUMENTS</Heading>

                <Grid columns="2" gap='2' pt='2'>

                    <TemplateCard>
                        <Flex direction='column' gap='2'>
                            <Text align='center' weight='bold' color='violet'>PDF</Text>

                            {pdfImportProgress === null && 
                                <Button size='1' variant='soft' onClick={handleClick} disabled={disabled}>
                                    <ArrowDown size='15'/>
                                    Importer
                                </Button>
                            }

                            {pdfImportProgress !== null &&
                                <Progress value={pdfImportProgress} />
                            }

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
                <Heading size='3' as="h3" mb='2' trim='both'>PAGES</Heading>
                <Grid columns="2" gap='2' pt='2'>
                    <button onClick={() => newPage?.()} disabled={disabled} style={{all:'unset', cursor: disabled ? 'not-allowed' : 'pointer'}}>
                        <Flex direction='column' align='center' gap='1'>
                            <TemplateCard/>
                            <Text size='1' color='gray'>Page blanche</Text>
                        </Flex>
                    </button>
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
        <AspectRatio ratio={16/9}>
            <Card variant='classic' style={{height:'100%', backgroundColor: backgroundColor}}>
                {children}
            </Card>
        </AspectRatio>
    )
}