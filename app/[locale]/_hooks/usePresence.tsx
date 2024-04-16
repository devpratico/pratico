import { react } from "tldraw";
import { useState, useEffect } from "react";
import debounce from "@/app/_utils/debounce";
import { useTLEditor } from "./useTLEditor";


interface Presence {
    id: string;
    userName: string;
    color: string;
}

// TODO: Use https://discord.com/channels/859816885297741824/1211824474056433717/1216702120431063040
export default function usePresence() {
    /*
    const { editor } = useTLEditor()
    if (!editor) return []
    
    const [presences, setPresences] = useState<Presence[]>( () =>
        editor.store.query.records('instance_presence').get().map(p => {
            return {
                id: p.id,
                userName: p.userName,
                color: p.color
            }
        })
    )

    useEffect(() => {
		const $presences =  editor.store.query.records('instance_presence')

        const debounceUpdate = debounce((presences: Presence[]) => {
            setPresences(presences)
        }, 1000)

        const cleanup = react('when participants change', () => {
            const _presences = $presences.get().map(p => {
                return {
                    id: p.id,
                    userName: p.userName,
                    color: p.color
                }
            })
            debounceUpdate(_presences)
        })

        return () => cleanup()
	}, [editor])

    return presences
    */

    return []
}