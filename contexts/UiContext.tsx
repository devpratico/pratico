'use client'
import { createContext, useContext, useState } from 'react';


type UiContextType = {

    // Dark mode
    isDark: boolean;
    toggleDark: () => void;

    // Auth dialog
    authDialogOpen: boolean;
    setAuthDialogOpen: (open: boolean) => void;
};


const UiContext = createContext<UiContextType | undefined>(undefined);

export function UiProvider({ children }: { children: React.ReactNode }) {
    const [isDark, setIsDark] = useState(false);
    const [authDialogOpen, setAuthDialogOpen] = useState(false);
    const toggleDark = () => setIsDark(!isDark);

    return (
        <UiContext.Provider value={{ isDark, toggleDark, authDialogOpen, setAuthDialogOpen}}>
            {children}
        </UiContext.Provider>
    );
}

export function useUi() {
    const context = useContext(UiContext);
    if (!context) throw new Error('useUiContext must be used within a UiContextProvider');
    return context;
}