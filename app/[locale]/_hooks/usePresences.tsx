'use client'
import { useState, useEffect, createContext, useContext } from "react";
import createClient from "@/supabase/clients/client";
import { useUser } from "./useUser";
import logger from "@/app/_utils/logger";



interface PresenceState {
    id: string;
    firstName: string;
    lastName: string;
    state: 'online' | 'offline';
    connectedAt: string;
    disconnectedAt: string;
}

interface PresencesContext {
    presences: PresenceState[];
}


const PresencesContext = createContext<PresencesContext | undefined>(undefined);


// Note : https://discord.com/channels/859816885297741824/1211824474056433717/1216702120431063040
export function PresencesProvider({ children, roomId }: { children: React.ReactNode, roomId: string }) {

    const { user, firstName, lastName } = useUser()
    const [presences, setPresences] = useState<PresenceState[]>([])

    useEffect(() => {

        if (!user?.id) {
            logger.error('react:hook', 'usePresence', 'No user id found')
            return
        }

        const supabase = createClient()
        const room = supabase.channel(roomId + "_presence")

        // React to presence changes
        room.on('presence', { event: 'sync' }, () => {
            logger.log('supabase:realtime', roomId + "_presence", 'Presence sync')
            const newState = room.presenceState<PresenceState>()
            const newPresences = Object.values(newState).map(array => array[0])

            // Update the presences:
            // Replace the list by the new list
            // Put back the removed ones
            setPresences((prev) => {
                const gonePresences = prev.filter(p => !newPresences.map(np => np.id).includes(p.id))
                const updatedGonePresences = gonePresences.map(gp => ({
                    id: gp.id,
                    firstName: gp.firstName,
                    lastName: gp.lastName,
                    state: 'offline' as 'offline',
                    connectedAt: gp.connectedAt,
                    disconnectedAt: new Date().toISOString()
                }))
                return [...newPresences, ...updatedGonePresences]
            })
        })

        room.on('presence', { event: 'join' }, ({ key, newPresences }) => {
            logger.log('supabase:realtime', roomId + "_presence", 'join', newPresences)
        })

        room.on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
            logger.log('supabase:realtime', roomId + "_presence", 'leave', leftPresences)
        })

        // Send my presence
        const myPresence: PresenceState = {
            id: user?.id || 'unknown',
            firstName: firstName || 'unknown',
            lastName: lastName || 'unknown',
            state: 'online',
            connectedAt: new Date().toISOString(),
            disconnectedAt: ''
        }

        room.subscribe(async (status) => {
            logger.log('supabase:realtime', roomId + "_presence", 'Presence status', status)
            if (status !== 'SUBSCRIBED') { return }
            const presenceTrackStatus = await room.track(myPresence)
            //logger.log('supabase:realtime', 'My presence track', presenceTrackStatus)
        })


        return () => { 
            //room.untrack()
            supabase.removeChannel(room).then((res) => { logger.log('supabase:realtime', roomId + "_presence", 'channel removed:', res)})
        }

    }, [roomId, user, firstName, lastName])

    return (
        <PresencesContext.Provider value={{ presences }}>
            {children}
        </PresencesContext.Provider>
    );
}



export function usePresences() {
    const context = useContext(PresencesContext);
    if (!context) throw new Error('usePresences must be used within a PresencesProvider');
    return context;
}