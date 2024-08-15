'use client'
import logger from '@/app/_utils/logger';
import { Editor,  uniqueId, AssetRecordType, getHashForString, TLPageId, createShapeId, getIndexBetween, getIndexAbove, IndexKey, TLPage, TLAssetId } from 'tldraw';


export interface AssetData {
    width: number
    height: number
    publicUrl: string
    name: string
}

interface importPdfBackgroundArgs {
    images: AssetData[]
    editor: Editor
    position?: 'next' | 'last'
}

interface CreateAssetArgs {
    id: TLAssetId
    image: AssetData
    editor: Editor
}

interface CreatePagesArgs {
    editor: Editor
    numberOfPages: number
    position: 'next' | 'last'
}

interface CreateImageBackgroundArgs {
    editor: Editor
    assetId: TLAssetId
    assetData: AssetData
    pageId: TLPageId
}

function createAsset({ id, image, editor }: CreateAssetArgs) {
    editor.createAssets([
        {
            id,
            type: 'image',
            typeName: 'asset',
            props: {
                name: image.name,
                src: image.publicUrl,
                w: image.width,
                h: image.height,
                mimeType: 'image/png',
                isAnimated: false,
            },
            meta: {},
        },
    ])
}

function createPages({ editor, numberOfPages, position }: CreatePagesArgs) {

    let newPagesIds: TLPageId[] = []

    if (position == 'last') {
        const lastPage = editor.getPages().slice(-1)[0]
        let previousPageIndex = lastPage.index

        for (let i = 0; i < numberOfPages; i++) {
            const pageId = 'page:' + uniqueId() as TLPageId
            newPagesIds.push(pageId)
            const newPageIndex = getIndexAbove(previousPageIndex)
            editor.createPage({ id: pageId, index: newPageIndex })
            previousPageIndex = newPageIndex
        }

        return newPagesIds
    }

    if (position == 'next') {
        const currentPage = editor.getCurrentPage()

        // Check if the current page is the last one
        if (editor.getPages().indexOf(currentPage) === editor.getPages().length - 1) {
            return createPages({ editor, numberOfPages, position: 'last' })
        }
        // Now we know that there's an existing page after the current page.
        // This page will remain at the end of all the new pages we'll create.
        // Let's call it the 'afterPage'

        const afterPage = editor.getPages()[editor.getPages().indexOf(currentPage) + 1]

        // We'll create the new pages between the current page or the last created page - and the after page
        let previousPageIndex = currentPage.index

        for (let i = 0; i < numberOfPages; i++) {
            const pageId = 'page:' + uniqueId() as TLPageId
            newPagesIds.push(pageId)
            const newPageIndex = getIndexBetween(previousPageIndex, afterPage.index)
            editor.createPage({ id: pageId, index: newPageIndex })
            previousPageIndex = newPageIndex
        }

        return newPagesIds
    }

    return newPagesIds
}

function createImageBackground({ editor, assetId, assetData, pageId }: CreateImageBackgroundArgs) {
    // Calculate the dimensions of the image to fit in inside 1920x1080
    const aspectRatio = assetData.width / assetData.height
    const maxWidth = 1920
    const maxHeight = 1080
    let width = assetData.width
    let height = assetData.height
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
        parentId: pageId,
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
}



/** 
 * Creates pages with images from public URLs
 */
export default async function importPdfBackground({ images, editor, position='next' }: importPdfBackgroundArgs) {
    // Batch all the following operations
    editor.run(() => {
        const pagesIds = createPages({ editor, numberOfPages: images.length, position })

        images.forEach((image, index) => {
            const assetId = AssetRecordType.createId(getHashForString(image.publicUrl))
            createAsset({ id: assetId, image, editor })
            createImageBackground({ editor, assetId, assetData: image, pageId: pagesIds[index] })
        })
    })


    

}