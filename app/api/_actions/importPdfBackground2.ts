'use server'

console.log('Running importPdfBackground2.ts')


import logger from '@/app/_utils/logger';
import pdfjs from 'pdfjs-dist';
import { uploadCapsuleFile, getPublicUrl } from './capsules_files';


//pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
//pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.js', import.meta.url).toString();

//pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/legacy/build/pdf.worker.min.mjs', import.meta.url).toString();




export interface ImportPdfBackgroundArgs {
    formData: FormData,
    capsuleId: string
}

/** 
 * Creates pages from a PDF file
 */
export default async function importPdfBackground2({ formData, capsuleId }: ImportPdfBackgroundArgs) {

    if (typeof Promise.withResolvers === 'undefined') {
        console.log('Adding Promise.withResolvers')
        Promise.withResolvers = function <T>(): PromiseWithResolvers<T> {
            let resolve: (value: T | PromiseLike<T>) => void = () => { }, reject: (reason?: any) => void = () => { };
            const promise: Promise<T> = new Promise((res, rej) => {
                resolve = res;
                reject = rej;
            });
            return { promise, resolve, reject };
        }
    }

    //const url = new URL('pdfjs-dist/legacy/build/pdf.worker.min.mjs').toString();
    //console.log('pdf worker url', url)
    //pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/legacy/build/pdf.worker.min.mjs').toString();

    pdfjs.GlobalWorkerOptions.workerSrc = "https://unpkg.com/pdfjs-dist@4.4.168/legacy/build/pdf.worker.min.mjs"

    

    

    // Get individual pages
    const file = formData.get('file') as File;
    const pages = await getPdfFilePages(file)

    // Convert each page to bitmap
    const imagePromises = pages.map(convertPDFPageToBitmap);
    const images = await Promise.all(imagePromises);
    images.forEach((_, index) => logger.log('system:file', `Converted to bitmap page ${index}`));

    // Convert each bitmap to Blob and upload
    // TODO: optimize this
    let urls: string[] = []; // This will be the URLs to the supabase images, or the encoded strings for local images
    let assetNames: string[] = [];

    for (let index = 0; index < images.length; index++) {
        const dataUrl = images[index].bitmap;
        const size = dataUrl.length * (3/4) - 2;
        logger.log('system:file', `Page ${index} size: ${size} bytes`);

        // Take the name of the file and remove what's after the first '.' (the extension) if there is one.
        // Truncate the name to 50 characters max.
        const cleanName = file.name.split('.')[0].substring(0, 50);
        const fileName = cleanName + '-' + index + '.png';
        assetNames.push(fileName);
        logger.log('system:file', `Uploading file ${fileName} to supabase`);

        const { data, error } = await uploadCapsuleFile({ dataUrl: dataUrl, name: fileName, capsuleId: capsuleId, folder: cleanName });
        if (error) return { urls: [], error: error }
        if (!data) return { urls: [], error: 'No data returned' }

        const url  = await getPublicUrl(data.path);
        urls.push(url);
        logger.log('supabase:storage', `Uploaded page ${index}`);

    }

    return { urls, error: null }
    
    
}


/**
 * @param file A PDF file
 * @returns An array of PDF pages as `pdfjs.PDFPageProxy` objects
 */
async function getPdfFilePages(file: File) {
    const pdf = await pdfjs.getDocument(URL.createObjectURL(file)).promise
    let pages = []
    for (let i = 1; i <= pdf.numPages; i++) {
        pages.push(await pdf.getPage(i))
    }
    return pages
}

/**
 * @param page A PDF page as a `pdfjs.PDFPageProxy` object, returned from `pdfjs.getDocument().getPage()`
 * Unfortunatly, the `pdfjs.PDFPageProxy` type is not exported from the `react-pdf` package, so we can't use it here.
 * @returns A bitmap of the PDF page as a base64 string, and the width and height of the bitmap
 */
async function convertPDFPageToBitmap(page: any): Promise<{ bitmap: string, width: number, height: number }> {
    const viewport = page.getViewport({ scale: 2 })
    const canvas   = document.createElement('canvas')
    const context  = canvas.getContext('2d')
    if (!context) {
        logger.error('system:file', 'Could not get canvas context')
        throw new Error('Could not get canvas context')
    }
    canvas.height  = viewport.height
    canvas.width   = viewport.width
    const renderContext = {
        canvasContext: context!,
        viewport: viewport
    }
    await page.render(renderContext).promise
    const bitmap = canvas.toDataURL('image/png')
    return { bitmap, width: viewport.width, height: viewport.height }
}