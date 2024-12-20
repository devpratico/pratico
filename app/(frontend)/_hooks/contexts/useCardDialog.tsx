'use client'
import { createContext, useContext, useState } from 'react';


type CardDialogContextType = {
    open: boolean;
    setOpen: (open: boolean) => void;
    preventClose: boolean;
    setPreventClose: (preventClose: boolean) => void;
    content: React.ReactNode | null
    setContent: (content: React.ReactNode) => void;
};

const emptyCardDialogContext = {
    open: false,
    setOpen: () => {},
    preventClose: false,
    setPreventClose: () => {},
    content: null,
    setContent: () => {},
};

const CardDialogContext = createContext<CardDialogContextType>(emptyCardDialogContext);


/**
 * Used by the `useCardDialog` hook to control the opening and closing of the `GlobalCardDialog`
 */
export function CardDialogProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const [preventClose, setPreventClose] = useState(false);
    const [content, setContent] = useState<React.ReactNode | null>(null);

    return (
        <CardDialogContext.Provider value={{ open, setOpen, preventClose, setPreventClose, content, setContent }}>
            {children}
        </CardDialogContext.Provider>
    );
}

/**
 * Controls the opening and closing of the `GlobalCardDialog`, as well as the content to display
 */
export function useCardDialog() {
    const context = useContext(CardDialogContext);
    if (!context) throw new Error('useCardDialog must be used within a CardDialogProvider');
    return context;
}