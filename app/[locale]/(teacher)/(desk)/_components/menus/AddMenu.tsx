'use client'
import importPdfBackground from "@/app/_utils/tldraw/importPdfBackground"
import { useTLEditor } from "@/app/_hooks/useTLEditor"
import { useParams } from "next/navigation"
import { Flex, Button, Progress } from "@radix-ui/themes"
import { ArrowDown, Plus } from "lucide-react"
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




    return (
            <Flex gap='3' direction='column'>

                    <Button onClick={handleClick} disabled={disabled}>
                        <ArrowDown size='15'/> Document .pdf
                    </Button> 

                    { pdfImportProgress && <Progress value={pdfImportProgress} /> }

                    {/* This is an invisible input button */} 
                    <input
                        type="file"
                        accept="application/pdf"
                        style={{ display: 'none' }}
                        ref={fileInputRef}
                        onChange={handleFileChange}
                    />

                    <Button variant='outline' onClick={() => newPage?.()} disabled={disabled}>
                        <Plus size='15' /> Page blanche
                    </Button>

            </Flex>
        
    )
}


