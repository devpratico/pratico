'use client'
import { createContext, useContext, useState } from 'react';


//export type MenuBarMode = 'creation' | 'animation';
type DeskMenu = 'polls' | 'participants' | 'chat' | 'more' | 'add';

type UiContextType = {

    // Dark mode
    isDark: boolean;
    toggleDark: () => void;

    // Auth dialog
    authDialogOpen: boolean;
    setAuthDialogOpen: (open: boolean) => void;

    // Desk menus
    openDeskMenu: DeskMenu | undefined;
    setOpenDeskMenu: (menu: DeskMenu | undefined) => void;
    toggleDeskMenu: (menu: DeskMenu | undefined) => void;
};


const UiContext = createContext<UiContextType | undefined>(undefined);

export function UiProvider({ children }: { children: React.ReactNode }) {
    // Dark mode
    const [isDark, setIsDark] = useState(false);
    const toggleDark = () => setIsDark(!isDark);

    // Auth dialog
    const [authDialogOpen, setAuthDialogOpen] = useState(false);

    // Desk menus
    const [openDeskMenu, setOpenDeskMenu] = useState<DeskMenu | undefined>(undefined);
    const toggleDeskMenu = (menu: DeskMenu | undefined) => {
        setOpenDeskMenu((prev) => prev === menu ? undefined : menu);
    };

    return (
        <UiContext.Provider value={{
            isDark,
            toggleDark,
            authDialogOpen,
            setAuthDialogOpen,
            openDeskMenu,
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