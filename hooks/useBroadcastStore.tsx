'use client'
import createClient from "@/supabase/clients/client";
import {
    createTLStore,
    //TLStoreWithStatus,
    defaultShapeUtils,
    TLRecord,
    RecordsDiff,
    StoreSnapshot
} from '@tldraw/tldraw';
import { useEffect, useState } from "react";
import logger from "@/utils/logger";


interface useBroadcastStoreProps {
    roomId: string
    initialSnapshot?: StoreSnapshot<TLRecord>
}


/**
 * This hook is used to create a realtime channel with supabase,
 * broadcasting changes end merging them with the local store.
 */
export default function useBroadcastStore({roomId, initialSnapshot}: useBroadcastStoreProps) {
    const supabase = createClient()
    const channel = supabase.channel(roomId)
    channel.subscribe((status) => {console.log(status)})

    // Initialize the store
    const [store, setStore] = useState(() => {
        const _store = createTLStore({shapeUtils: defaultShapeUtils})
        if (initialSnapshot) _store.loadSnapshot(initialSnapshot)
        return _store
    })

    // Subscribe to store events and send changes to the server
    useEffect(() => {
        const storeListener = store.listen(({changes}) => {

            // This is just for logging to the console
            // We use object.values to get the values (most of the time, only one), as it is an object
            // with useless keys (they are the record ids, and we can get them from the record itself)
            Object.values(changes.added).forEach((record)   => {logger.log('tldraw:collab', 'added', record.id)})
            Object.values(changes.removed).forEach((record) => {logger.log('tldraw:collab', 'removed', record.id)})
            //Object.values(changes.updated).forEach( ([from, to]) => {logger.log('tldraw:collab', 'updated', from.id)})

            channel.send({type: 'broadcast', event: 'test', payload: changes})
            //.then(() => {logger.log('supabase:realtime', 'sent', changes)})

        }, { source: 'user', scope: 'document' })

        return () => {
            storeListener() // A function to remove the listener (returned from store.listen())
        }

    }, [store, channel])

    // Receive changes from the server and merge them with the local store
    useEffect(() => {
        channel.on(
            'broadcast',
            { event: 'test' },
            (payload) => {
                const diff = payload.payload as RecordsDiff<TLRecord>
                //logger.log('supabase:realtime', 'received', diff)
                setStore((prevStore) => {
                    const newStore = prevStore
                    newStore.mergeRemoteChanges(() => {

                        Object.values(diff.added).forEach((record) => {
                            newStore.put([record])
                            logger.log('tldraw:collab', 'added remote', record.id)
                        })

                        Object.values(diff.removed).forEach((record) => {
                            newStore.remove([record.id])
                            logger.log('tldraw:collab', 'removed remote', record.id)
                        })

                        Object.values(diff.updated).forEach( ([from, to]) => {
                            newStore.update(from.id, () => to)
                            //logger.log('tldraw:collab', 'updated remote', from.id)
                        })

                    })
                    return newStore
                })
            }
        )
        return () => { channel.unsubscribe()}
    }, [channel])

    return store
    
}