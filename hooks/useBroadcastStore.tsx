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
 * broadcasting changes end merging them with the local store.
 */
export default function useBroadcastStore({roomName, initialSnapshot}: useBroadcastStoreProps) {
    console.log('RENDERING useBroadcastStore')
    const supabase = createClient()

    // Initialize the store
    const [store, setStore] = useState(() => {
        const _store = createTLStore({shapeUtils: defaultShapeUtils})
        if (initialSnapshot) _store.loadSnapshot(initialSnapshot)
        return _store
    })

    useEffect(() => {
        let storeListener: () => void // Need to keep a reference to the listener to remove it in the cleanup function
        const channel = supabase.channel(roomName)

        // Subscribe to the channel
        channel.subscribe((status, err) => {
            logger.log('supabase:realtime', 'status', status, err)

            // Define a function to log the response from the server
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