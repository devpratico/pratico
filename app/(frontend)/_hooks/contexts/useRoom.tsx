'use client'
import { createContext, useContext, } from 'react';
import { fetchOpenRoomByCode } from '@/app/(backend)/api/room/room.client';
import { Room } from '@/app/(backend)/api/room/types';
import { useState, useEffect } from 'react';
import logger from '@/app/_utils/logger';
import { useParams } from 'next/navigation';
import createClient from '@/supabase/clients/client';
import { isEqual } from 'lodash';


// TODO: There's a trick 🚩 here to only update the room when the params change - and do nothing
// when the other fields change, especially the capsule_snapshot. This is not clear and should be simplified.
// Change room context to somehting like: { params, activity } without the snapshot.
// Or separate concernes : useRoomParams, useRoomActivity...
// We may also need a handy roomId and roomCode


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

    // Fetch the initial room data (happens once)
    useEffect(() => {
        if (!room_code) return;
        logger.log('react:hook', 'useRoom.tsx', 'Fetch initial room data', room_code)
        fetchOpenRoomByCode(room_code).then(({data, error}) => {
            if (error || !data) return
            const _room = data as Room
            setRoom(_room)
        })
            //.catch((error) => {logger.log('react:hook', `No room found for "${room_code}"`)})
    }, [room_code]);

    // Subscribe to room params changes
    useEffect(() => {
        logger.log('supabase:realtime', "useRoom", "Listening to room table realtime")
        const supabase = createClient();
        const channel = supabase.channel(room_code + "_realtime");
        channel
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'rooms', filter: `code=eq.${room_code}` },
                (payload): void => {
                    const newRecord = payload.new as Room

                    //if (isEqual(oldRecord?.params, newRecord.params)) return

                    logger.log('supabase:realtime', 'useRoom.tsx', "room row updated", newRecord.params)
                    setRoom((prev) => {
                        if (isEqual(prev?.params, newRecord.params)) return prev
                        if (prev) {
                            return {...prev, params: newRecord.params}
                        } else {
                            return newRecord
                        }
                    })

                    /*setRoom((prev) => {
                        logger.log('supabase:realtime', "room row updated", newRecord.params)
                        if (prev) {
                            // Trick here 🚩 : Only update the params and activity_snapshot
                            return {...prev, params: newRecord.params}//, activity_snapshot: newRecord.activity_snapshot}
                        } else {
                            return newRecord
                        }
                    })*/
                }
            ).subscribe()

        return () => {supabase.removeChannel(channel)}

    }, [room_code, setRoom]);

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