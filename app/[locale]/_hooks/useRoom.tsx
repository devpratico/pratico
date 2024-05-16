'use client'
import { createContext, useContext, } from 'react';
import type { Room} from '@/app/[locale]/capsule/[capsule_id]/actions';
import { useState, useEffect } from 'react';
import logger from '@/app/_utils/logger';
import { fetchRoomByCode } from '../room/[room_code]/_actions/actions';
import { useParams } from 'next/navigation';


export type RoomContext = {
    room: Room | undefined;
}

const RoomContext = createContext<RoomContext | undefined>(undefined);

export function RoomProvider({ children }: { children: React.ReactNode}) {

    const [room, setRoom] = useState<Room | undefined>(undefined);
    const { room_code }: { room_code: string } = useParams();

    useEffect(() => {
        fetchRoomByCode(room_code)
            .then((room) => {setRoom(room)})
            .catch((error) => {logger.error('react:hook', `error getting room by code "${room_code}"`, (error as Error).message)})
    }, [room_code]);


    // TODO: listen for postgre changes to setRoom

    return (
        <RoomContext.Provider value={{ room }}>
            {children}
        </RoomContext.Provider>
    );
}

export function useRoom() {
    const context = useContext(RoomContext);
    if (!context) throw new Error('useRoom must be used within a RoomProvider');
    return context;
}