'use client'
import {
    useEditor,
    TLInstancePresence,
    track
} from "@tldraw/tldraw"


const Presence = track(() => {
    const editor = useEditor()
    const participants = editor.store.allRecords().filter(record => record.typeName === 'instance_presence') as TLInstancePresence[]
    const names = participants.map(p => p.userName).join(', ')

    return <p>Presence: {names}</p>
})

export default Presence