'use client'
import logger from '@/utils/logger';
import { createContext, useContext } from 'react';
import { getIndexBetween, TLPageId, useValue, useComputed, uniqueId } from 'tldraw';
import { useTLEditor } from './useTLEditor';


type NavContextType = {
    pageIds?: TLPageId[];
    currentPageId?: TLPageId;
    setCurrentPage?: (id: TLPageId) => void;
    goNextPage?: () => void;
    goPrevPage?: () => void;
    newPage?: (position?: 'next' | 'last') => void;
};

const NavContext = createContext<NavContextType | undefined>(undefined);


/**
 * Provides values and functions to manipulate the pages of the editor.
 * It uses [signia](https://signia.tldraw.dev/docs/react-bindings)
 * And [fractionnal indexing](https://observablehq.com/@dgreensp/implementing-fractional-indexing).
 */
export function NavProvider({ children }: { children: React.ReactNode }) {
    const { editor } = useTLEditor()

    /*
    const pageIds = useValue('Page ids', () => {
        if (!editor) return []
        console.log("Computing page ids")
        return editor.getPages().map(p => p.id)
    }, [editor])
    */

    // See https://discord.com/channels/859816885297741824/1217575088065609728
    // SOLUTION 1
    //const pageIds = editor ? Array.from(editor.store.query.ids('page').get()) : []
    // SOLUTION 2
    /*const pageIds = useValue('Page ids', () => {
        if (!editor) return []
        return editor.getPages().map(p => p.id)
    }, [editor])*/
    // SOLUTION 3
    const pageIds$ = useComputed('Page ids', () => {
        if (!editor) return []
        return editor.getPages().map((p) => p.id)
    }, {
        isEqual: (a: any[], b: any[]) => a.length === b.length && a.every((id, i) => id === b[i])
    },[editor])

    const pageIds = useValue(pageIds$)

    const currentPageId = useValue('Current page ID', () => {
        if (!editor) return undefined
        return editor.getCurrentPage().id
    }, [editor])


    // If no editor, it means tldraw is not ready yet
    if (!editor) {
        return (
            <NavContext.Provider value={{
                pageIds:        undefined,
                currentPageId:  undefined,
                setCurrentPage: undefined,
                goNextPage:     undefined,
                goPrevPage:     undefined,
                newPage:        undefined
            }}>
                {children}
            </NavContext.Provider>
        );
    }


    const setCurrentPage = (id: TLPageId) => {
        try {
            editor.setCurrentPage(id)
            const index = editor.getCurrentPage().index
            logger.log('tldraw:editor', `Set current page to index: ${index} - id:${id}`)
        } catch (error) {
            logger.error('tldraw:editor', `Page ${id} not found`, (error as Error).message)
        }
    }

    const goNextPage = () => {
        const pages = editor.getPages()
        const currentPageIdx = pages.indexOf(editor.getCurrentPage())
        const nextPageIdx = currentPageIdx + 1
        if (nextPageIdx < pages.length) {
            setCurrentPage(pages[nextPageIdx].id)
        } else {
            logger.log('tldraw:editor', `No next page`)
        }
    }

    const goPrevPage = () => {
        const pages = editor.getPages()
        const currentPageIdx = pages.indexOf(editor.getCurrentPage())
        const prevPageIdx = currentPageIdx - 1
        if (prevPageIdx >= 0) {
            setCurrentPage(pages[prevPageIdx].id)
        } else {
            logger.log('tldraw:editor', `No previous page`)
        }
    }

    const newPage = (position: 'next' | 'last' = 'next') => {

        const newPageId = 'page:' + uniqueId() as TLPageId
        logger.log('tldraw:editor', `Creating new page with id: ${newPageId}`)

        if (position === 'last') {
            editor.createPage({ id: newPageId })
            
        } else {
            const pages = editor.getPages()
            const currentPage = editor.getCurrentPage()

            const currentPageIndex = {
                inArray: pages.indexOf(currentPage),
                inFract: currentPage.index
            }

            // If the current page is the last page, create a new page at the end of the pages list:
            if (currentPageIndex.inArray === pages.length - 1) {
                newPage('last')
                return
            }

            const nextPageIndex = {
                inArray: currentPageIndex.inArray + 1,
                inFract: pages[currentPageIndex.inArray + 1].index // We know for sure that there's a page after the current page
            }

            const newPageIndex = {
                inFract: getIndexBetween(currentPageIndex.inFract, nextPageIndex.inFract)
            }

            editor.createPage({ id: newPageId, index: newPageIndex.inFract })

            logger.log('tldraw:editor', `Created page at ${newPageIndex.inFract} in between ${currentPageIndex.inFract} and ${nextPageIndex.inFract}`, editor.getPages().map(p => p.index))
        }
        setCurrentPage(newPageId)
    }


    return (
        <NavContext.Provider value={{
            pageIds,
            currentPageId,
            setCurrentPage,
            goNextPage,
            goPrevPage,
            newPage
        }}>
            {children}
        </NavContext.Provider>
    );
}

export function useNav() {
    const context = useContext(NavContext);
    if (!context) throw new Error('useNav must be used within a NavProvider');
    return context;
}