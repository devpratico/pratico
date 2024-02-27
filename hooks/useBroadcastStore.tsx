'use client'
import createClient from "@/supabase/clients/client";
import {
    createTLStore,
    //TLStoreWithStatus,
    defaultShapeUtils,
    TLRecord,
    RecordsDiff,
} from '@tldraw/tldraw';
import { useEffect, useState } from "react";



export default function useBroadcastStore() {
    const roomId = 'broadcast:public'
    const supabase = createClient()
    const channel = supabase.channel(roomId)
    channel.subscribe((status) => {console.log(status)})

    //const store = createTLStore({shapeUtils: defaultShapeUtils})
    const [store, setStore] = useState(() => createTLStore({shapeUtils: defaultShapeUtils}))

    // Send changes to the server
    useEffect(() => {
        const storeListener = store.listen(({changes}) => {

            // We use object.values to get the values (most of the time, only one), as it is an object
            // with useless keys (they are the record ids, and we can get them from the record itself)
            Object.values(changes.added).forEach((record) => {console.log("⬆️ added", record.id)})
            Object.values(changes.removed).forEach((record) => {console.log("⬆️ removed", record.id)})
            Object.values(changes.updated).forEach( ([from, to]) => {console.log("⬆️ updated", from.id)})

            channel.send({type: 'broadcast', event: 'test', payload: changes})
        }, { source: 'user', scope: 'document' })

        return () => {
            storeListener() // A function to remove the listener (returned from store.listen())
        }

    }, [store, channel])

    // Receive changes from the server
    useEffect(() => {
        channel.on(
            'broadcast',
            { event: 'test' },
            (payload) => {
                const diff = payload.payload as RecordsDiff<TLRecord>
                setStore((prevStore) => {
                    const newStore = prevStore
                    newStore.mergeRemoteChanges(() => {

                        Object.values(diff.added).forEach((record) => {
                            console.log("⬇️ added", record.id)
                            newStore.put([record])
                        })

                        Object.values(diff.removed).forEach((record) => {
                            console.log("⬇️ removed", record.id)
                            newStore.remove([record.id])
                        })

                        Object.values(diff.updated).forEach( ([from, to]) => {
                            console.log("⬇️ updated", from.id)
                            newStore.update(from.id, () => to)
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