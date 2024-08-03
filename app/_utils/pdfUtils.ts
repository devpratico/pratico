'use client'
import * as pdfjs from 'pdfjs-dist';
import logger from './logger';


if (typeof Promise.withResolvers === "undefined") {
    if (typeof window !== 'undefined') {
        // @ts-expect-error This does not exist outside of polyfill which this is doing
        window.Promise.withResolvers = function () {
            let resolve, reject
            const promise = new Promise((res, rej) => {
                resolve = res
                reject = rej
            })
            return { promise, resolve, reject }
        }
    } else {
        // @ts-expect-error This does not exist outside of polyfill which this is doing
        global.Promise.withResolvers = function () {
            let resolve, reject
            const promise = new Promise((res, rej) => {
                resolve = res
                reject = rej
            })
            return { promise, resolve, reject }
        }
    }
}

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/legacy/build/pdf.worker.min.mjs', import.meta.url).toString();
//pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

/**
 * @param page A PDF page as a `pdfjs.PDFPageProxy` object, returned from `pdfjs.getDocument().getPage()`
 * Unfortunatly, the `pdfjs.PDFPageProxy` type is not exported from the `react-pdf` package, so we can't use it here.
 * @returns A bitmap of the PDF page as a base64 string, and the width and height of the bitmap
 */
async function convertPDFPageToBitmap(page: any) {
    const viewport = page.getViewport({ scale: 2 })
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    if (!context) {
        logger.error('system:file', 'Could not get canvas context')
        throw new Error('Could not get canvas context')
    }
    canvas.height = viewport.height
    canvas.width = viewport.width
    const renderContext = {
        canvasContext: context!,
        viewport: viewport
    }
    await page.render(renderContext).promise
    const bitmap = canvas.toDataURL('image/png')

    return { bitmap, width: viewport.width, height: viewport.height }
}


/**
 * @param file A PDF file
 * @returns An array of PDF pages as `pdfjs.PDFPageProxy` objects
 */
async function getPdfFilePages(file: File) {
    const pdf = await pdfjs.getDocument(URL.createObjectURL(file)).promise

    let pagesPromises: Promise<pdfjs.PDFPageProxy>[] = []
    
    for (let i = 1; i <= pdf.numPages; i++) {
        pagesPromises.push(pdf.getPage(i))
    }

    const pages = await Promise.all(pagesPromises)
    return pages
}


export async function convertPdfToImages({ file }: { file: File }) {
    const pages = await getPdfFilePages(file)

    // Convert each page to bitmap
    const imagePromises = pages.map(convertPDFPageToBitmap);
    const images = await Promise.all(imagePromises);
    images.forEach((_, index) => logger.log('system:file', `Converted to bitmap page ${index}`));

    return images
}