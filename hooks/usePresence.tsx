import { useEditor, react } from "@tldraw/tldraw";
import { useState, useEffect } from "react";
import debounce from "@/utils/debounce";


interface Presence {
    id: string;
    userName: string;
    color: string;
}

// TODO: I use debounce to limit the amount of updates (the hook fires on every cursor movement).
// Should find a way to react only to presence changes. Maybe use the Supabase Presence feature.
export default function usePresence() {
    const editor = useEditor()
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
}