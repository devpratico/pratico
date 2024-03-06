import {
    useEditor,
    computed,
    react,
    TLInstancePresence
} from "@tldraw/tldraw";
import { useState, useEffect } from "react";


interface Presence {
    id: string;
    userName: string;
    color: string;
}


/**
 * This hook returns an array of presences based on tldraw's editor store.
 * If the tldraw editor has some remote presences, for example from the useBroadcastStore hook,
 * this hook will return them.
 * We use `compute` and `react` to listen to changes in the editor store, as explained in [the tldraw guide](../docs/tldraw.md).
 */
export default function usePresence() {
    const editor = useEditor()
    const [presences, setPresences] = useState<Presence[]>([])

    useEffect(() => {
        const participantsSignal = computed<Presence[]>('presences', () => {
            const tldrawPresences =  editor.store.allRecords().filter(record => record.typeName === 'instance_presence') as TLInstancePresence[]
            const _presences = tldrawPresences.map(p => {
                return {
                    id: p.id,
                    userName: p.userName,
                    color: p.color
                }
            })
            return _presences
        })

        const cleanup = react('when participants change', () => {
            setPresences(participantsSignal.get())
        })

        return () => cleanup()
    }, [editor])
    
    return presences
}