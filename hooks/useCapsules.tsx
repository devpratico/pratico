'use client'
import { createContext, useContext, } from 'react';
import type { Capsule } from '@/supabase/services/capsules';


export type CapsulesContext = {
    capsules: Capsule[];
}

const CapsulesContext = createContext<CapsulesContext | undefined>(undefined);

export function CapsulesProvider({ children, value }: { children: React.ReactNode, value: CapsulesContext }) {
    return (
        <CapsulesContext.Provider value={value}>
            {children}
        </CapsulesContext.Provider>
    );
}


export function useCapsules() {
    const context = useContext(CapsulesContext);
    if (!context) throw new Error('useCapsules must be used within a CapsulesProvider');
    return context;
}