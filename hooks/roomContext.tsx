'use client'
import { createContext, useContext, } from 'react';
import type { Room, RoomInsert } from '@/supabase/services/rooms';
import { useState } from 'react';

export type RoomContext = {
    room?: Room | RoomInsert;
    setRoom: (room?: Room | RoomInsert) => void;
}

const RoomContext = createContext<RoomContext | undefined>(undefined);

export function RoomProvider({ children, initialRoom }: { children: React.ReactNode, initialRoom?: Room }) {

    const [room, setRoom] = useState<Room | RoomInsert | undefined>(initialRoom);

    return (
        <RoomContext.Provider value={{ room, setRoom }}>
            {children}
        </RoomContext.Provider>
    );
}

export function useRoom() {
    const context = useContext(RoomContext);
    if (!context) throw new Error('useRoom must be used within a RoomProvider');
    return context;
}