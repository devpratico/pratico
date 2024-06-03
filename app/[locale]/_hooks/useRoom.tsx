'use client'
import { createContext, useContext, } from 'react';
import type { Room } from '@/app/[locale]/capsule/[capsule_id]/actions';
import { useState, useEffect } from 'react';
import logger from '@/app/_utils/logger';
import { fetchRoomByCode } from '../room/[room_code]/_actions/actions';
import { useParams } from 'next/navigation';
import createClient from '@/supabase/clients/client';


// TODO: Get rid of this. Fetch room data everywhere it's needed, and use cache.
// Make a useRoomSettings for real-time settings.


export type RoomContext = {
    room: Room | undefined;
}

const RoomContext = createContext<RoomContext | undefined>(undefined);

/**
 * This provider fetches the room data based on the url room code.
 * Only the params property is updated in real time.
 * The other data is fetched once and doesn't change.
 */
export function RoomProvider({ children }: { children: React.ReactNode}) {
    const { room_code }: { room_code: string } = useParams();
    const [room, setRoom] = useState<Room | undefined>(undefined);

    // Fetch the room data (happens once)
    useEffect(() => {
        fetchRoomByCode(room_code)
            .then((room) => {setRoom(room)})
            .catch((error) => {logger.error('react:hook', `error getting room by code "${room_code}"`, (error as Error).message)})
    }, [room_code]);

    // Subscribe to room params changes
    useEffect(() => {
        const supabase = createClient();
        const channel = supabase.channel(room_code + "_params");
        channel
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'rooms', filter: `code=eq.${room_code}` },
                (payload): void => {
                    logger.log('supabase:realtime', "room params updated", room_code)
                    const newRecord = payload.new// as Room
                    setRoom((prev) => {
                        if (prev) {
                            return {...prev, params: newRecord.params}
                        } else {
                            return prev
                        }
                    })
                }
            )
            .subscribe()

        return () => {supabase.removeChannel(channel)}

    }, [room_code]);

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