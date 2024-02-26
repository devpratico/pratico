'use client'
import { createContext, useContext, useState } from 'react';


export type MenuBarMode = 'creation' | 'animation';

type UiContextType = {

    // Dark mode
    isDark: boolean;
    toggleDark: () => void;

    // Auth dialog
    authDialogOpen: boolean;
    setAuthDialogOpen: (open: boolean) => void;

    // Menu bar mode
    deskMenuBarMode: MenuBarMode;
    setDeskMenuBarMode: (mode: MenuBarMode) => void;
};


const UiContext = createContext<UiContextType | undefined>(undefined);

export function UiProvider({ children }: { children: React.ReactNode }) {
    const [isDark, setIsDark] = useState(false);
    const [authDialogOpen, setAuthDialogOpen] = useState(false);
    const toggleDark = () => setIsDark(!isDark);
    const [deskMenuBarMode, setDeskMenuBarMode] = useState<MenuBarMode>('creation');

    return (
        <UiContext.Provider value={{
            isDark,
            toggleDark,
            authDialogOpen,
            setAuthDialogOpen,
            deskMenuBarMode,
            setDeskMenuBarMode,
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