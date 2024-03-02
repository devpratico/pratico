'use client'
import { createContext, useContext, } from 'react';
import type { Room } from '@/supabase/services/rooms';

export type RoomContext = {
    room?: Room;
}

const RoomContext = createContext<RoomContext | undefined>(undefined);

export function RoomProvider({ children, value }: { children: React.ReactNode, value: RoomContext }) {
    return (
        <RoomContext.Provider value={value}>
            {children}
        </RoomContext.Provider>
    );
}

export function useRoom() {
    const context = useContext(RoomContext);
    if (!context) throw new Error('useRoom must be used within a RoomProvider');
    return context;
}