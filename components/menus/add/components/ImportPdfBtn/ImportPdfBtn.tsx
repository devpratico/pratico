'use client'
import { useRef } from 'react';
import styles from './ImportPdfBtn.module.css';
import logger from '@/utils/logger';


interface ImportPDFButtonProps {
    className?: string
    children: React.ReactNode
    onImport: (file: File) => void
}

export default function ImportPDFButton({ children, className, onImport }: ImportPDFButtonProps) {

    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (file && file.type === "application/pdf") {
            logger.log('system:file', 'File received', file.name, file.type)
            onImport(file);
        } else {
            logger.log('system:file', 'File is not a PDF', file?.type)
            alert('Please select a PDF file.');
        }
        fileInputRef.current!.value = '';
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
    
    
    
    