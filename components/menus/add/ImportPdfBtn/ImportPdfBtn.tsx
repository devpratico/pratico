'use client'
import { useRef } from 'react';
import styles from './ImportPdfBtn.module.css';
import { useEditor } from '@tldraw/tldraw';
import addPdf from '@/utils/tldraw/addPdf';
import logger from '@/utils/logger';


interface ImportPDFButtonProps {
    className?: string
    children: React.ReactNode
    onImport?: (file: File) => void
}

export default function ImportPDFButton({ children, className, onImport }: ImportPDFButtonProps) {
    //const editor = useEditor();
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (file && file.type === "application/pdf") {
            logger.log('system:file', 'File received', file.name, file.type)
            //await addPdf({ file, editor });
            onImport?.(file);
        } else {
            logger.log('system:file', 'File is not a PDF', file?.type)
            alert('Please select a PDF file.');
        }
    };
    
    const handleClick = () => {
        fileInputRef.current?.click();
    };
    
    return (
        <div className={className}>

            <input
                type="file"
                accept="application/pdf"
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={handleFileChange}
            />

            <button className={styles.button} onClick={handleClick}>
                {children}
            </button>
            
        </div>
    );
};
    
    
    
    