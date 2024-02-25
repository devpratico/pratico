'use client'
import logger from '@/utils/logger';
import { createContext, useContext, useState, useEffect } from 'react';
import { useEditor } from '@tldraw/tldraw';


type NavContextType = {
    pagesIds: string[];
    currentPageId: string;
    setCurrentPage: (id: string) => void;
    incrementCurrentPageIndex: () => void;
    decrementCurrentPageIndex: () => void;
    createPage: () => void;
};

const NavContext = createContext<NavContextType | undefined>(undefined);


export function NavProvider({ children }: { children: React.ReactNode }) {
    const editor = useEditor()
    if (!editor) throw new Error('Tldraw editor context not found in NavProvider');

    /* editor.getPages() or editor.getCurrentPage() are not reactive.
       That means they won't update even when editor changes.
       So we need to use state to make them reactive.
       We could avoid that by using tldraw's `track` function, but it doesn't work with context providers.
    */
    const [pagesIds, setPagesIds] = useState<string[]>(editor.getPages().map(p => p.id))
    const [currentPageId, setCurrentPageId] = useState<string>(editor.getCurrentPage().id)

    const setCurrentPage = (id: string) => {
        const page = editor.getPages().find(p => p.id === id)
        if (page) {
            editor.setCurrentPage(page)
            setPagesIds(editor.getPages().map(p => p.id))
            setCurrentPageId(id)
            logger.log('tldraw:editor', `Current page set to id`, currentPageId)

        } else {
            console.warn('Page not found', id)
        }
    }

    const incrementCurrentPageIndex = () => {
        const currentPageIndex = pagesIds.indexOf(currentPageId)
        if (currentPageIndex < pagesIds.length - 1) {
            setCurrentPage(pagesIds[currentPageIndex + 1])
        }
    }

    const decrementCurrentPageIndex = () => {
        const currentPageIndex = pagesIds.indexOf(currentPageId)
        if (currentPageIndex > 0) {
            setCurrentPage(pagesIds[currentPageIndex - 1])
        }
    }

    const createPage = () => {
        const currentPageIndex = pagesIds.indexOf(currentPageId)
        editor.createPage({ index: `${currentPageIndex + 1}` }) // index actually isn't used
        // go to the new page:
        setCurrentPage(editor.getPages()[currentPageIndex + 1].id)
        // update the pagesIds:
        setPagesIds(editor.getPages().map(p => p.id))
    }

    return (
        <NavContext.Provider value={{
            pagesIds,
            currentPageId,
            setCurrentPage,
            incrementCurrentPageIndex,
            decrementCurrentPageIndex,
            createPage
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