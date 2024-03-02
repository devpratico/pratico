'use client'
import { createContext, useContext, } from 'react';
import type { Capsule } from '@/supabase/services/capsules';

export type CapsuleContext = {
    capsule: Capsule;
    // May not need this as it is available in all children components through useEditor()
    //currentSnapshot: Snapshot;
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