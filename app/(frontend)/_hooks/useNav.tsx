'use client'
import logger from '@/app/_utils/logger';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getIndexBetween, TLPageId, useValue, useComputed, uniqueId, EditSubmenu, getIndexBelow, getIndexAbove, TLFrameShape } from 'tldraw';
import { useTLEditor } from './useTLEditor';
import { useRouter } from '../_intl/intlNavigation';


type NavContextType = {
    pageIds: TLPageId[];
    currentPageId: TLPageId | undefined;
    nextPageId: TLPageId | undefined;
    prevPageId: TLPageId | undefined;
    setCurrentPage: (id: TLPageId) => void;
    goNextPage: () => void;
    goPrevPage: () => void;
    newPage: (position?: 'next' | 'last') => void;
    deletePage: (id: TLPageId) => void;
	movePage: (destinationPageId: TLPageId) => void;
};

const emptyContext: NavContextType = {
    pageIds: [],
    currentPageId: undefined,
    nextPageId: undefined,
    prevPageId: undefined,
    setCurrentPage: (id: TLPageId) => { },
    goNextPage: () => { },
    goPrevPage: () => { },
    newPage: (position?: 'next' | 'last') => { },
    deletePage: (id: TLPageId) => { },
	movePage: (destinationPageId: TLPageId) => {}

}

const NavContext = createContext<NavContextType>(emptyContext);


/**
 * Provides values and functions to manipulate the pages of the editor.
 * It uses [signia](https://signia.tldraw.dev/docs/react-bindings)
 * And [fractionnal indexing](https://observablehq.com/@dgreensp/implementing-fractional-indexing).
 */
export function NavProvider({ children }: { children: React.ReactNode }) {
    const { editor } = useTLEditor()
    const pageIds$ = useComputed('Page ids', () => {
        if (!editor) return []
        return editor.getPages().map((p) => p.id)
    }, {
        isEqual: (a: any[], b: any[]) => a.length === b.length && a.every((id, i) => id === b[i])
    }, [editor])

    const pageIds = useValue(pageIds$)

    const currentPageId = useValue('Current page ID', () => {
        if (!editor) return undefined
        return editor.getCurrentPage().id
    }, [editor])

    const nextPageId = useValue('Next page ID', () => {
        if (!editor) return undefined
        const pages = editor.getPages()
        const currentPageIdx = pages.indexOf(editor.getCurrentPage())
        const nextPageIdx = currentPageIdx + 1
        if (nextPageIdx < pages.length) {
            return pages[nextPageIdx].id
        }
        return undefined
    }, [editor])

    const prevPageId = useValue('Previous page ID', () => {
        if (!editor) return undefined
        const pages = editor.getPages()
        const currentPageIdx = pages.indexOf(editor.getCurrentPage())
        const prevPageIdx = currentPageIdx - 1
        if (prevPageIdx >= 0) {
            return pages[prevPageIdx].id
        }
        return undefined
    }, [editor])


    const setCurrentPage = useCallback((id: TLPageId) => {
        if (!editor) return
        try {
            editor.setCurrentPage(id)
            const index = editor.getCurrentPage().index
            logger.log('tldraw:editor', `Current page set to index: ${index}`, `id: ${id}`)
        } catch (error) {
            logger.error('tldraw:editor', `Page ${id} not found`, (error as Error).message)
        }
    }, [editor])


    const goNextPage = useCallback(() => {
        if (!editor) return
        const pages = editor.getPages()
        const currentPageIdx = pages.indexOf(editor.getCurrentPage())
        const nextPageIdx = currentPageIdx + 1
        if (nextPageIdx < pages.length) {
            logger.log('tldraw:editor', `Going to next page`)
            setCurrentPage(pages[nextPageIdx].id)
        } else {
            logger.log('tldraw:editor', `No next page`)
        }
    }, [editor, setCurrentPage])


    const goPrevPage = useCallback(() => {
        if (!editor) return
        const pages = editor.getPages()
        const currentPageIdx = pages.indexOf(editor.getCurrentPage())
        const prevPageIdx = currentPageIdx - 1
        if (prevPageIdx >= 0) {
            logger.log('tldraw:editor', `Going to previous page`)
            setCurrentPage(pages[prevPageIdx].id)
        } else {
            logger.log('tldraw:editor', `No previous page`)
        }
    }, [editor, setCurrentPage])



    const newPage = useCallback((position: 'next' | 'last' = 'next') => {
        if (!editor) return
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
                editor.createPage({ id: newPageId })
                setCurrentPage(newPageId)
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
    }, [editor, setCurrentPage])


    const deletePage = useCallback((id: TLPageId) => {
        if (!editor) return
        logger.log('tldraw:editor', `Deleting page with id: ${id}`)
        editor.deletePage(id)
    }, [editor])

	const movePage = useCallback((destinationPageId: TLPageId) => {
		if (!editor)
			return ;
		const pages = editor.getPages();
		const currentPage = editor.getCurrentPage();
		const destinationPage = editor.getPage(destinationPageId);
		if (!destinationPage)
			return ;
		const currentIndex = pages.indexOf(currentPage);
		const newIndex = pages.indexOf(destinationPage);
		let moveTo;
		if (currentIndex === -1 || newIndex === currentIndex)
			return ;
		if (newIndex === 0)
			moveTo = getIndexBelow(pages[newIndex].index)
		else if (newIndex === pages.length - 1)
			moveTo = getIndexAbove(pages[newIndex].index)
		else
		{
			if (currentIndex < newIndex)
				moveTo = getIndexBetween(pages[newIndex].index, pages[newIndex + 1].index);
			else
				moveTo = getIndexBetween(pages[newIndex - 1].index, pages[newIndex].index);
		}

		editor.updatePage({ id: currentPage.id, index: moveTo });
		setCurrentPage(currentPage.id);
	}, [editor, setCurrentPage]);
	

    return (
        <NavContext.Provider value={{
            pageIds,
            currentPageId,
            nextPageId,
            prevPageId,
            setCurrentPage,
            goNextPage,
            goPrevPage,
            newPage,
            deletePage,
			movePage
        }}>
            {children}
        </NavContext.Provider>
    );
}



export function useNav() {
    const context = useContext(NavContext);
    //if (!context) throw new Error('useNav must be used within a NavProvider');
    return context;
}