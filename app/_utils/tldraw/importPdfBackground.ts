'use client'
import logger from '@/app/_utils/logger';
import { Editor,  uniqueId, AssetRecordType, getHashForString, TLPageId, createShapeId, getIndexBetween, TLPage } from 'tldraw';


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


/** 
 * Creates pages with images from public URLs
 */
export default async function importPdfBackground({ images, editor, position }: importPdfBackgroundArgs) {

    // Create tldraw assets with the URLs
    let assetIds: string[] = []
    images.forEach((image, index) => {
        const assetId = AssetRecordType.createId(getHashForString(image.publicUrl))
        assetIds.push(assetId)
        editor.createAssets([
            {
                id: assetId,
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
    })


    // Batch all the following operations
    editor.run(() => {
        const currentPage = editor.getCurrentPage() // Save the current page to get back to it later

        assetIds.forEach((assetId, index) => {
            const pages = editor.getPages()
            const pageId = 'page:' + uniqueId() as TLPageId

            // Create the page we'll put the image on
            if (position === 'last') {
                // Easy, just create a new page
                editor.createPage({ id: pageId }).setCurrentPage(pageId)

            } else if (position === 'next' && pages.indexOf(currentPage) === pages.length - 1) {
                // If the current page is the last one, same situation as above, just create a new page
                editor.createPage({ id: pageId }).setCurrentPage(pageId)

            } else {
                // More complicated, we'll have to use indexes to create the page between the current page and the next page

                const currentPageIndex = {
                    inArray: pages.indexOf(currentPage),
                    inFract: currentPage.index
                }

                const nextPageIndex = {
                    inArray: currentPageIndex.inArray + 1,
                    inFract: pages[currentPageIndex.inArray + 1].index // We know for sure that there's a page after the current page
                }

                const newPageIndex = {
                    inFract: getIndexBetween(currentPageIndex.inFract, nextPageIndex.inFract)
                }

                editor
                    .createPage({ id: pageId, index: newPageIndex.inFract })
                    .setCurrentPage(pageId)
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