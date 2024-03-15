'use client'
import { Editor, AssetRecordType } from "tldraw"

import logger from "../logger"


interface addPdfArgs {
    file: File,
    editor: Editor
}

export default async function addPdf({ file, editor }: addPdfArgs) {

    // Check if the file is a PDF
    if (file.type !== "application/pdf") {
        logger.error('system:file', 'File is not a PDF', file.type)
        return
    }

    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('/api/pdf-to-svg', {
        method: 'POST',
        body: formData,
    })

    logger.log('system:file', 'Received response from server:', res)

    /*
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async (event) => {

        logger.log('system:file', 'Reader onload...')
        const base64Pdf = event.target?.result as string
        logger.log('system:file', 'base64Pdf:', base64Pdf)

        const res = await fetch('/api/pdf-to-svg', {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain',
            },
            body: 'hello',
        })

        logger.log('system:file', 'Received response from server:', res)

        const svgJson = await res.json()
        logger.log('system:file', 'Received SVGs from server. JSON:', svgJson)
        const svgArray = svgJson as string[]
        logger.log('system:file', 'Received SVGs from server. Array:', svgArray)

        svgArray.forEach(svg => {
            const assetId = AssetRecordType.createId()
            const width = 200
            const height = 100

            editor.createAssets([
                {
                    id: assetId,
                    type: 'image',
                    typeName: 'asset',
                    props: {
                        name: 'pdfToSvgBackground',
                        src: svg,
                        w: width,
                        h: height,
                        mimeType: 'image/svg+xml',
                        isAnimated: false,
                    },
                    meta: {
                        background: true,
                    },
                },
            ])

            editor.createShape({
                type: 'image',
                // Let's center the image in the editor
                x: (1920 - width)  / 2,
                y: (1080 - height) / 2,
                props: {
                    assetId,
                    w: width,
                    h: height,
                },
            })

            logger.log('tldraw:editor', 'Added svg to editor', svg)
        })
    }
    */
}


