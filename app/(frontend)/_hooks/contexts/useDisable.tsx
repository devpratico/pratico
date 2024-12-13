'use client'
import { createContext, useContext, useState } from 'react';


type DisableContextType = {
    disabled: boolean;
    setDisabled: (disabled: boolean) => void;
};

const DisableContext = createContext<DisableContextType | undefined>(undefined);

export function DisableProvider({ children }: { children: React.ReactNode }) {
    const [disabled, setDisabled] = useState<boolean>(false);
    return (
        <DisableContext.Provider value={{ disabled, setDisabled }}>
            {children}
        </DisableContext.Provider>
    );
}

/**
 * Globally disable all interactive elements when some work is being done
 */
export function useDisable() {
    const context = useContext(DisableContext);
    if (!context) throw new Error('useDisable must be used within a DisableProvider');
    return context;
}