'use client'
import { pdfjs } from 'react-pdf';
import { useCallback, useState } from 'react';
import ImportPDFButton from "@/components/menus/add/ImportPdfBtn/ImportPdfBtn";
import { uploadCapsuleFile, createSignedUrl } from '@/supabase/services/capsules_files';
import logger from '@/utils/logger';
import { Tldraw, useEditor, Editor, useTLStore , uniqueId, AssetRecordType, getHashForString, TLPageId, createShapeId } from '@tldraw/tldraw';
import '@tldraw/tldraw/tldraw.css';
import PlainBtn from '@/components/primitives/buttons/PlainBtn/PlainBtn';


//pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.js', import.meta.url).toString();


export default function Page() {
    return (
        <div style={{ width: '100%', height: '100dvh' }}>
            <Tldraw>
                <CustomUi />
            </Tldraw>
        </div>
    )
}


const CustomUi = () => {
    const editor = useEditor()

    const onImport = async (file: File) => {

        // Get individual pages
        const pages = await getPdfFilePages(file)

        // Convert each page to bitmap
        const imagePromises = pages.map(convertPDFPageToBitmap);
        const images = await Promise.all(imagePromises);
        images.forEach((_, index) => logger.log('system:file', `Converted to bitmap page ${index}`));

        // Convert each bitmap to Blob and upload
        // TODO: optimize this
        let urls: string[] = [];
        let assetNames: string[] = [];
        for (let index = 0; index < images.length; index++) {
            const blob = dataURLToBlob(images[index].bitmap);
            logger.log('system:file', `Converted to Blob page ${index}`);

            try {
                // Take the name of the file and remove what's after the first '.' (the extension) if there is one.
                // Truncate the name to 50 characters max.
                const cleanName = file.name.split('.')[0].substring(0, 50);
                const fileName = cleanName + '-' + index + '.png';
                assetNames.push(fileName);
                logger.log('system:file', `Uploading file ${fileName}`);
                const path = await uploadCapsuleFile({blob: blob, name: fileName, capsuleId: 'CAP_THOMAS', folder: cleanName});
                const url = await createSignedUrl(path);
                urls.push(url);
                logger.log('supabase:storage', `Uploaded page ${index}`);
            } catch (error) {
                logger.error('supabase:storage', 'Error uploading file', (error as Error).message);
            }
        }

        // Create tldraw assets with the URLs
        let assetIds: string[] = []
        urls.forEach((url, index) => {
            const assetId = AssetRecordType.createId(getHashForString(url))
            assetIds.push(assetId)
            editor.createAssets([
                {
                    id: assetId,
                    type: 'image',
                    typeName: 'asset',
                    props: {
                        name: assetNames[index],
                        src: url,
                        w: images[index].width,
                        h: images[index].height,
                        mimeType: 'image/png',
                        isAnimated: false,
                    },
                    meta: {},
                },
            ])
        })


        // Check if current page is empty
        const currentPageIsEmpty = editor.getPageShapeIds(editor.getCurrentPage()).size === 0
        const currentPage = editor.getCurrentPage() // Save the current page to restore it later

        // Batch all the following operations
        editor.batch(() => {
            assetIds.forEach((assetId, index) => {
                // Create a new page for each image, except the first image if the current page is empty
                if ((index === 0 && !currentPageIsEmpty) || index > 0) {
                    const pageId = 'page:' + uniqueId() as TLPageId
                    editor.createPage({
                        id: pageId,
                        name: `Page ${index + 1}`
                    })
                    // Set the current page to the new page so that we can create the shape on it
                    editor.setCurrentPage(pageId)
                }

                // Calculate the dimensions of the image to fit in inside 1920x1080
                const aspectRatio = images[index].width / images[index].height
                const maxWidth = 1920
                const maxHeight = 1080
                let width = images[index].width
                let height = images[index].height
                if (width > maxWidth) {
                    width = maxWidth
                    height = width / aspectRatio
                }
                if (height > maxHeight) {
                    height = maxHeight
                    width = height * aspectRatio
                }


                // Create a new shape using the asset
                const id = createShapeId()
                editor.createShape({
                    id: id,
                    type: 'image',
                    x: (1920 - width) / 2,
                    y: (1080 - height) / 2,
                    props: {
                        assetId, // Use the asset we created earlier
                        w: width,
                        h: height,
                    },
                })
                // Lock the image
                editor.toggleLock([id])
            })
            // Return to the original page
            editor.setCurrentPage(currentPage)
        })
    }

    return (
        <div style={{zIndex: 1000, position: 'absolute', top: 50, left: '50%'}}>
            <ImportPDFButton onImport={onImport}>
                <PlainBtn message={'Importer un PDF'} />
            </ImportPDFButton>
        </div>
    )
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

/**
 * Converts a data URL to a Blob, that can be uploaded to Supabase
 */
const dataURLToBlob = (dataURL: string): Blob => {
    const [headers, base64Data] = dataURL.split(',');
    const byteString = atob(base64Data);
    const mimeString = headers.split(':')[1].split(';')[0];

    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
}
