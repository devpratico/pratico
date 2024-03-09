'use client'
import { pdfjs } from 'react-pdf';
import { useState } from 'react';
import ImportPDFButton from "@/components/menus/add/ImportPdfBtn/ImportPdfBtn";
import { uploadCapsuleFile } from '@/supabase/services/capsules_files';
import { fetchUserId } from '@/supabase/services/auth';
import logger from '@/utils/logger';


export default function Page() {

    const [numPages, setNumPages] = useState(0)
    const [url, setUrl] = useState('')

    //pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
    pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.js', import.meta.url).toString();

    const onImport = async (file: File) => {
        logger.log('system:file', 'File received', file.name, file.type)

        const pdf = await pdfjs.getDocument(URL.createObjectURL(file)).promise
        const _numPages = pdf.numPages
        setNumPages(_numPages)
        const page1 = await pdf.getPage(1)

        // Upload to Supabase
        // 1. Get user ID
        let userId = ''
        try {
            userId = await fetchUserId()
            logger.log('supabase:auth', 'User ID:', userId)
        } catch (error) {
            logger.error('supabase:auth', 'Error fetching user ID', (error as Error).message)
        }
        try {
             const data = await uploadCapsuleFile(file, userId, 'CAP_THOMAS')
             setUrl(data.path)
        } catch (error) {
            logger.error('supabase:storage', 'Error uploading file', (error as Error).message)
        }



    }

    return (
        <div>
            <h1>Import PDF</h1>
            <ImportPDFButton onImport={onImport}>Import PDF</ImportPDFButton>
            <p>Number of pages: {numPages}</p>
            <p>URL: {url}</p>
        </div>
    )
}