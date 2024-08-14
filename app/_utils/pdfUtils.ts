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

//pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/legacy/build/pdf.worker.min.mjs', import.meta.url).toString();
//pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
//pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/legacy/build/pdf.worker', import.meta.url).toString();
/*
(async () => {
    const workerSrc = await import('pdfjs-dist/legacy/build/pdf.worker.mjs')
    pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
})();
*/
//pdfjs.GlobalWorkerOptions.workerSrc = require('pdfjs-dist/legacy/build/pdf.worker.min.mjs');

/*
async function setupWorker() {
    const workerSrc = await import('pdfjs-dist/legacy/build/pdf.worker.min.mjs')
    //const workerSrc = require('pdfjs-dist/legacy/build/pdf.worker.min.mjs')
    pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
}

setupWorker()*/

//const pdfWorkerSrc = import('public/pdf.worker.min.mjs');
//pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerSrc;


async function setupWorker() {
    const workerSrc = await import('public/pdf.worker.min.mjs')
    pdfjs.GlobalWorkerOptions.workerSrc = workerSrc as unknown as string;
}

setupWorker()


async function convertPDFPageToBitmap(page: pdfjs.PDFPageProxy) {
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

    logger.log('system:file', 'Converted to bitmap', bitmap.slice(0, 20))
    return { bitmap, width: viewport.width, height: viewport.height }
}


async function getPdfPages(file: File) {
    const pdf = await pdfjs.getDocument(URL.createObjectURL(file)).promise

    let pagesPromises: Promise<pdfjs.PDFPageProxy>[] = []
    
    for (let i = 1; i <= pdf.numPages; i++) {
        pagesPromises.push(pdf.getPage(i))
    }

    return pagesPromises
}


export async function convertPdfToImages({ file }: { file: File }) {
    const pagesPromises = await getPdfPages(file)

    const imagesPromises = pagesPromises.map(async (pagePromise, i) => {
        const page = await pagePromise
        logger.log('system:file', `Page ${i} extracted`)
        return convertPDFPageToBitmap(page)
    })

    return imagesPromises
}

export async function getPdfNumPages(file: File) {
    const pdf = await pdfjs.getDocument(URL.createObjectURL(file)).promise
    return pdf.numPages
}