'use client'
import createClient from '@/supabase/clients/client';
import {
    createTLStore,
    defaultShapeUtils,
    TLRecord,
    RecordsDiff,
    StoreSnapshot,
    getUserPreferences,
    computed,
    defaultUserPreferences,
    InstancePresenceRecordType,
    createPresenceStateDerivation,
    react,
    TLInstancePresence,
    throttle
} from 'tldraw';
import { useEffect, useState } from "react";
import logger from "@/app/_utils/logger";
import debounce from "@/app/_utils/debounce";


interface useBroadcastStoreProps {
    roomId?: string
    initialSnapshot?: StoreSnapshot<TLRecord>
}

type broadcastArgs = { eventName: 'document', payload: RecordsDiff<TLRecord> } | { eventName: 'presence', payload: TLInstancePresence }

/**
 * This hook is used to create a realtime channel with supabase,
 * broadcasting changes and merging them in the store that it returns.
 * It has been inspired by the [tldraw collaboration example](https://tldraw.dev/examples/collaboration/yjs) and [use presence example](https://tldraw.dev/examples/collaboration/user-presence).
 * See the [supabase documentation](https://supabase.com/docs/guides/realtime/broadcast) for more information.
 */
export default function useBroadcastStore({roomId, initialSnapshot}: useBroadcastStoreProps) {

    // Check if roomId is defined
    if (!roomId) {
        throw new Error(`Missing roomId: ${roomId}`)
    }

    // Initialize the store that will be returned
    const [store, setStore] = useState(() => {
        const _store = createTLStore({shapeUtils: defaultShapeUtils})
        if (initialSnapshot) _store.loadSnapshot(initialSnapshot)
        return _store
    })

    useEffect(() => {
        // We'll use Supabase Broadcast feature
        const supabase = createClient()
        const channel = supabase.channel(roomId + "_document", {
            config: {
                broadcast: { ack: true },
            },
        })

        // Initialize the listeners in the body of the useEffect so that we can unsubscribe in the cleanup function
        let storeListener: () => void
        let presenceListener: () => void

        // BROADCAST LOCAL TLDRAW CHANGES - BROADCAST THEM
        // In order to broadcast stuff, we need to be in the `subscribe` callback
        channel.subscribe((status, err) => {
            logger.log('supabase:realtime', roomId + "_document", 'status', status, err)
            // Define the logging function outside of the loop to allow debouncing
            // TODO: Get rid of debounce and use throttle
            const debounceLog = debounce((response: any) => { logger.log('supabase:realtime', roomId + "_document", 'sent', response)}, 100)

            // Define a function to send changes to the server
            const broadcast = async ({eventName, payload}: broadcastArgs) => {
                if (status !== 'SUBSCRIBED') return
                await channel.send({type: 'broadcast', event: eventName, payload}).then((response) => {
                    if(eventName == 'document')  debounceLog(response) // Only log document changes (presence would be annoying)
                })
            }
            
            const throttleBroadcast = throttle((args: broadcastArgs) => { broadcast(args)}, 50)
            //const debounceBroadcast = debounce((args: broadcastArgs) => { broadcast(args)}, 500)

            // DOCUMENT CHANGES (drawing, adding shapes...)
            // Listen to tldraw store and broadcast changes
            storeListener = store.listen(({changes}) => {
                logChanges(changes, 'local')

                // If there is added or removed records, broadcast directly
                if (Object.keys(changes.added).length > 0 || Object.keys(changes.removed).length > 0) {
                    broadcast({eventName: 'document', payload: changes})
                    return
                } else {
                    // If there are only updated records, we need to throttle the updates
                    // Otherwise, we would send too many updates to the server
                    throttleBroadcast({eventName: 'document', payload: changes})
                    //debounceBroadcast(changes)
                }


                //broadcast({eventName: 'document', payload: changes})
            }, { source: 'user', scope: 'document' })
        

            // PRESENCE CHANGES - Mouse position, name, color...
            // Broadcast your tldraw's TLInstancePresence to everyone
            const presenceInfo = computed<{id: string, color: string, name: string}>('userPreferences', () => {
				const user = getUserPreferences()
				return {
					id:    user.id,
					color: user.color ?? defaultUserPreferences.color,
					name:  user.name  ?? defaultUserPreferences.name,
				}
			})

            // The presence thing needs a special kind of id
            const presenceId = InstancePresenceRecordType.createId(presenceInfo.get().id)

            // Finally, create a presence oject (signal)
            const presenceSignal = createPresenceStateDerivation(presenceInfo, presenceId)(store)

            // React to changes in the presence object
            presenceListener = react('when presence changes', () => {
                const presence = presenceSignal.get()
                if (!presence) return
                //broadcast({eventName: 'presence', payload: presence})
                throttleBroadcast({eventName: 'presence', payload: presence})
            })
        })

        // LISTEN TO THE CHANNEL 'DOCUMENT' EVENTS - MERGE REMOTE CHANGES IN THE STORE
        channel.on(
            'broadcast',
            { event: 'document' },
            (payload) => {
                const diff = payload.payload as RecordsDiff<TLRecord>
                logChanges(diff, 'remote')
                setStore((prevStore) => {
                    const newStore = prevStore
                    newStore.mergeRemoteChanges(() => {
                        Object.values(diff.added  ).forEach((record)     => {newStore.put([record])})
                        Object.values(diff.removed).forEach((record)     => {newStore.remove([record.id])})
                        Object.values(diff.updated).forEach(([from, to]) => {newStore.update(from.id, () => to)})
                    })
                    return newStore
                })
            }
        )

        // LISTEN TO THE CHANNEL 'PRESENCE' REMOTE EVENTS - MERGE REMOTE CHANGES IN THE STORE
        // This is the mouse positions, names, colors...
        channel.on(
            'broadcast',
            { event: 'presence' },
            (payload) => {
                const presence = payload.payload as TLInstancePresence
                setStore((prevStore) => {
                    const newStore = prevStore
                    newStore.mergeRemoteChanges(() => {
                        newStore.put([presence])
                    })
                    return newStore
                })
            }
        )

        return () => {
            supabase.removeChannel(channel).then((res) => { logger.log('supabase:realtime', roomId + "_document", 'channel removed:', res)})
            // Remove the listeners (they returned functions for that purpose)
            storeListener()
            presenceListener()
            //channel.untrack()
        }
    }, [roomId, store])
    
    return store
}


const debounceLog = debounce((message: string, id: string) => {logger.log('tldraw:collab', message, id)}, 1000)

function logChanges(changes: RecordsDiff<TLRecord>, source: 'local' | 'remote') {
    // This is just for logging to the console
    // We use object.values to get the values (most of the time, only one), as it is an object
    // with useless keys (they are the record ids, and we can get them from the record itself)
    Object.values(changes.added  ).forEach((record)     => {logger.log('tldraw:collab', source + ' added', record.id)})
    Object.values(changes.removed).forEach((record)     => {logger.log('tldraw:collab', source + ' removed', record.id)})
    Object.values(changes.updated).forEach(([from, to]) => {debounceLog(source + ' updated', from.id)})
}