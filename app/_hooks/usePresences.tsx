'use client'
import { useState, useEffect, createContext, useContext } from "react";
import createClient from "@/supabase/clients/client";
import logger from "@/app/_utils/logger";
import { fetchNames } from "@/app/api/_actions/user";
import { getRandomColor } from "@/app/_utils/codeGen";
import { getUserPreferences } from "tldraw";
import { fetchUser } from "@/app/api/_actions/user";
import { useParams } from "next/navigation";


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
    //roomCode: string;
    //userId?: string; // TODO: Remove this
    children: React.ReactNode
}


const emptyPresencesContext: PresencesContext = { presences: [] }


const PresencesContext = createContext<PresencesContext>(emptyPresencesContext)


// Note : https://discord.com/channels/859816885297741824/1211824474056433717/1216702120431063040
export function PresencesProvider({ children }: PresencesProviderProps) {
    const [presences, setPresences] = useState<PresenceState[]>([])
    const [userId, setUserId] = useState<string | null>(null)
    const { room_code }: { room_code: string } = useParams();

    useEffect(() => {
        try {
            fetchUser().then(({user, error}) => {setUserId(user?.id || null)})
        } catch (error) {
            logger.error('supabase:auth', 'Error fetching user', (error as Error).message)
        }
    }, [])

    useEffect(() => {
        logger.log('supabase:auth', 'usePresences', presences)
    }, [presences])

    useEffect(() => {
        if (!userId) return
        const supabase = createClient()
        const room = supabase.channel(room_code + "_presence")

        // React to presence changes
        room.on('presence', { event: 'sync' }, () => {
            logger.log('supabase:realtime', room_code + "_presence", 'Presence sync')
            const newState = room.presenceState<PresenceState>()
            const newPresences = Object.values(newState).map(array => array[0]) // Weird but that's how supabase returns it

            // Set the correct `isMe` flag
            newPresences.forEach(p => p.isMe = p.id === userId)

            setPresences((prev) => {
                // Get the presences that are gone
                const gonePresences = prev.filter(p => !newPresences.map(np => np.id).includes(p.id))
                // Update the gone presences with a disconnectedAt date and offline state
                const updatedGonePresences = gonePresences.map(gp => ({
                    id: gp.id,
                    color: gp.color,
                    firstName: gp.firstName,
                    lastName: gp.lastName,
                    isMe: false,
                    state: 'offline' as 'offline',
                    connectedAt: gp.connectedAt,
                    disconnectedAt: new Date().toISOString()
                }))
                // Refresh the presences but keep the gone presences
                return [...newPresences, ...updatedGonePresences]
            })
        })

        /*
        room.on('presence', { event: 'join' }, ({ key, newPresences }) => {
            logger.log('supabase:realtime', roomCode + "_presence", 'join', newPresences)
        })

        room.on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
            logger.log('supabase:realtime', roomCode + "_presence", 'leave', leftPresences)
        })*/

        // Send my presence
        room.subscribe(async (status) => {
            logger.log('supabase:realtime', room_code + "_presence", 'Presence status', status)
            if (status !== 'SUBSCRIBED') { return }

            const names = await fetchNames(userId)

            const myPresence: PresenceState = {
                id: userId || 'unknown',
                color: getUserPreferences().color || getRandomColor(),
                firstName: names.first_name || getUserPreferences().name || 'Inconnu',
                lastName: names.last_name || '',
                isMe: true,
                state: 'online',
                connectedAt: new Date().toISOString(),
                disconnectedAt: ''
            }

            logger.log('supabase:realtime', 'Sending my presence', myPresence)

            const presenceTrackStatus = await room.track(myPresence)
            //logger.log('supabase:realtime', 'My presence track', presenceTrackStatus)
        })


        return () => { 
            //room.untrack()
            supabase.removeChannel(room).then((res) => { logger.log('supabase:realtime', room_code + "_presence", 'channel removed:', res)})
        }

    }, [room_code, userId])


    if (!room_code) {
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
    //if (!context) throw new Error('usePresences must be used within a PresencesProvider');
    return context;
}