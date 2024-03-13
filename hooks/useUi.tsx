'use client'
import { createContext, useContext, useState, useEffect } from 'react';
import useWindowSize from './useWindowSize';


//export type MenuBarMode = 'creation' | 'animation';
export type DeskMenu = 'polls' | 'participants' | 'chat' | 'more' | 'add';

type UiContextType = {

    // Dark mode
    isDark: boolean;
    toggleDark: () => void;

    // Mobile
    isMobile: boolean;
    orientation: 'landscape' | 'portrait';

    // Auth dialog
    authDialogOpen: boolean;
    setAuthDialogOpen: (open: boolean) => void;

    // Desk menus
    openedDeskMenu: DeskMenu | undefined;
    setOpenDeskMenu: (menu: DeskMenu | undefined) => void;
    toggleDeskMenu: (menu: DeskMenu | undefined) => void;
};


const UiContext = createContext<UiContextType | undefined>(undefined);

export function UiProvider({ children }: { children: React.ReactNode }) {
    // Dark mode
    const [isDark, setIsDark] = useState(false);
    const toggleDark = () => setIsDark(!isDark);

    // Mobile
    const { width, height } = useWindowSize();
    const [isMobile, setIsMobile] = useState(false);
    const [orientation, setOrientation] = useState<'landscape' | 'portrait'>('portrait');

    useEffect(() => {
        const checkIsMobile = !!width && !!height && (width < 500 || height < 500);
        const checkOrientation = width && height && width > height ? 'landscape' : 'portrait';
        setIsMobile(checkIsMobile);
        setOrientation(checkOrientation);
    }, [width, height]);

    // Auth dialog
    const [authDialogOpen, setAuthDialogOpen] = useState(false);

    // Desk menus
    const [openedDeskMenu, setOpenDeskMenu] = useState<DeskMenu | undefined>(undefined);
    const toggleDeskMenu = (menu: DeskMenu | undefined) => {
        setOpenDeskMenu((prev) => prev === menu ? undefined : menu);
    };

    return (
        <UiContext.Provider value={{
            isDark,
            isMobile,
            orientation,
            toggleDark,
            authDialogOpen,
            setAuthDialogOpen,
            openedDeskMenu,
            setOpenDeskMenu,
            toggleDeskMenu,
        }}>
            {children}
        </UiContext.Provider>
    );
}

export function useUi() {
    const context = useContext(UiContext);
    if (!context) throw new Error('useUiContext must be used within a UiContextProvider');
    return context;
}