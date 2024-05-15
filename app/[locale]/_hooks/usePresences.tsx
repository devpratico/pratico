'use client'
import { useState, useEffect, createContext, useContext } from "react";
import createClient from "@/supabase/clients/client";
import logger from "@/app/_utils/logger";
import { useRoom } from "./useRoom";


interface PresenceUser {
    id: string;
    color: string;
    firstName: string;
    lastName: string;
}

interface PresenceState extends PresenceUser {
    isMe: boolean;
    state: 'online' | 'offline';
    connectedAt: string;
    disconnectedAt: string;
}

interface PresencesContext {
    presences: PresenceState[];
}

interface PresencesProviderProps {
    user: PresenceUser
    children: React.ReactNode
}


const PresencesContext = createContext<PresencesContext | undefined>(undefined);


// Note : https://discord.com/channels/859816885297741824/1211824474056433717/1216702120431063040
export function PresencesProvider({ user, children }: PresencesProviderProps) {

    const { room } = useRoom()
    const roomId = room?.id
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
            const newPresences = Object.values(newState).map(array => array[0]) // Weird but that's how supabase returns it

            // Set the correct `isMe` flag
            newPresences.forEach(p => p.isMe = p.id === user.id)

            setPresences((prev) => {
                // Get the presences that are gone
                const gonePresences = prev.filter(p => !newPresences.map(np => np.id).includes(p.id))
                // Update the gone presences with a disconnectedAt date and offline state
                const updatedGonePresences = gonePresences.map(gp => ({
                    id: gp.id,
                    color: gp.color,
                    firstName: gp.firstName,
                    lastName: gp.lastName,
                    isMe: gp.id === user.id,
                    state: 'offline' as 'offline',
                    connectedAt: gp.connectedAt,
                    disconnectedAt: new Date().toISOString()
                }))
                // Refresh the presences but keep the gone presences
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
            color: user.color || 'blue',
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            isMe: true,
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

    }, [roomId, user])


    if (!roomId) {
        logger.log('react:hook', 'usePresences', 'No room id found - no presences to track')
    }

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