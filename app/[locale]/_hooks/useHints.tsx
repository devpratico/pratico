'use client'
import { createContext, useContext, useState, useEffect } from 'react';
import logger from '@/app/_utils/logger';



export type Hint = "login" | "renameCapsule"

type HintsContextType = {
    currentHint: Hint | undefined;
    setCurrentHint: (hint: Hint | undefined) => void;
};


const HintsContext = createContext<HintsContextType | undefined>(undefined);

export function HintsProvider({ children }: { children: React.ReactNode }) {

    const [currentHint, setCurrentHint] = useState<Hint | undefined>(undefined);

    useEffect(() => {
        logger.log('react:hook', 'Hint set to', currentHint)
    }, [currentHint]);

    return (
        <HintsContext.Provider value={{
            currentHint,
            setCurrentHint,
        }}>
            {children}
        </HintsContext.Provider>
    );
}

export function useHints() {
    const context = useContext(HintsContext);
    if (!context) throw new Error('useHints must be used within a HintsProvider');
    return context;
}