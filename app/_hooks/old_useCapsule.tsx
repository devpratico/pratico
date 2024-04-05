'use client'
import { createContext, useContext, } from 'react';
//import type { Capsule } from '@/supabase/services/capsules';

export type CapsuleContext = {
    // TODO: I suspect we only need capsule_id. If so, we can remove the Capsule type from the context.
    //capsule: Capsule;

    id: string;
    location: 'local' | 'remote';
}

const CapsuleContext = createContext<CapsuleContext | undefined>(undefined);

export function CapsuleProvider({ children, value }: { children: React.ReactNode, value: CapsuleContext }) {
    return (
        <CapsuleContext.Provider value={value}>
            {children}
        </CapsuleContext.Provider>
    );
}

export function useCapsule() {
    const context = useContext(CapsuleContext);
    if (!context) throw new Error('useCapsule must be used within a CapsuleProvider');
    return context;
}