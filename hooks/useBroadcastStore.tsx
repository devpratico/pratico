'use client'
import createClient from "@/supabase/clients/client";
import {
    createTLStore,
    defaultShapeUtils,
    TLRecord,
    RecordsDiff,
    StoreSnapshot
} from '@tldraw/tldraw';
import { useEffect, useState } from "react";
import logger from "@/utils/logger";
import debounce from "@/utils/debounce";


interface useBroadcastStoreProps {
    roomName: string
    initialSnapshot?: StoreSnapshot<TLRecord>
}

/**
 * This hook is used to create a realtime channel with supabase,
 * broadcasting changes end merging them in the store that it returns.
 * It has been inspired by the [tldraw collaboration example](https://github.com/tldraw/tldraw-yjs-example)
 * and [this broadcast example](https://stackblitz.com/edit/nextjs-hug4zd?file=pages%2Fsend-broadcast.tsx,pages%2Freceive-broadcast.tsx).
 * See the [supabase documentation](https://supabase.com/docs/guides/realtime/broadcast) for more information.
 */
export default function useBroadcastStore({roomName, initialSnapshot}: useBroadcastStoreProps) {
    const supabase = createClient()

    // Initialize the store
    const [store, setStore] = useState(() => {
        const _store = createTLStore({shapeUtils: defaultShapeUtils})
        if (initialSnapshot) _store.loadSnapshot(initialSnapshot)
        return _store
    })

    useEffect(() => {
        let storeListener: () => void // Must be initialized here so that it can be returned in the cleanup function
        const channel = supabase.channel(roomName)

        // Subscribe to the channel and broaecast changes
        channel.subscribe((status, err) => {
            logger.log('supabase:realtime', 'status', status, err)

            // This is just for logging to the console
            const debounceLog = debounce((response: any) => {logger.log('supabase:realtime', 'sent', response)}, 1000)

            // Define a function to send changes to the server
            const broadcast = async (changes: RecordsDiff<TLRecord>) => {
                if (status !== 'SUBSCRIBED') return
                await channel.send({type: 'broadcast', event: 'test', payload: changes}).then((response) => {
                    debounceLog(response)
                })
            }
            // Listen to changes in the store and broadcast them
            storeListener = store.listen(({changes}) => {
                logChanges(changes, 'local')
                broadcast(changes)
            }, { source: 'user', scope: 'document' })
        })

        // Listen to changes from the server and merge them with the local store
        channel.on(
            'broadcast',
            { event: 'test' },
            (payload) => {
                const diff = payload.payload as RecordsDiff<TLRecord>
                logChanges(diff, 'remote')
                setStore((prevStore) => {
                    const newStore = prevStore
                    newStore.mergeRemoteChanges(() => {
                        Object.values(diff.added).forEach((record) => {newStore.put([record])})
                        Object.values(diff.removed).forEach((record) => {newStore.remove([record.id])})
                        Object.values(diff.updated).forEach( ([from, to]) => {newStore.update(from.id, () => to)})
                    })
                    return newStore
                })
            }
        )

        return () => {
            supabase.removeChannel(channel) // Removes the channel
            storeListener() // Removes the listener (returned from store.listen())
        }
    }, [roomName, store])
    
    return store
    
}


const debounceLog = debounce((message: string, id: string) => {logger.log('tldraw:collab', message, id)}, 1000)

function logChanges(changes: RecordsDiff<TLRecord>, source: 'local' | 'remote') {
    // This is just for logging to the console
    // We use object.values to get the values (most of the time, only one), as it is an object
    // with useless keys (they are the record ids, and we can get them from the record itself)
    Object.values(changes.added).forEach((record)   => {logger.log('tldraw:collab', source + ' added', record.id)})
    Object.values(changes.removed).forEach((record) => {logger.log('tldraw:collab', source + ' removed', record.id)})
    Object.values(changes.updated).forEach( ([from, to]) => {debounceLog(source + ' updated', from.id)})
}