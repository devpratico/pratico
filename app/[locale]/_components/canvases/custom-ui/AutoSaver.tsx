'use client'
import { track, TLEditorSnapshot, useEditor } from 'tldraw'
import { saveCapsuleSnapshot, saveRoomSnapshot } from '@/app/api/_actions/room2'
import logger from '@/app/_utils/logger'
//import debounce from '@/utils/debounce';
import { useEffect } from 'react';


export type AutoSaverProps = {
    saveTo:
          { destination: 'remote capsule', capsuleId: string }
        | { destination: 'remote room',    roomId:    number }
}


/**
 * This automaticaly saves the current snapshot every time it changes.
 * You can choose to save to:
 * * A room (while in collaboration mode)
 * * A capsule (while in solo edit mode)
 */
const AutoSaver = track(({saveTo}: AutoSaverProps) => {
    const editor  = useEditor()

    useEffect(() => {
        const save = async (snapshot: TLEditorSnapshot) => {

            let _id: string | number

            try {
                switch (saveTo.destination) {
                    case 'remote capsule':
                        _id = saveTo.capsuleId
                        await saveCapsuleSnapshot(_id, snapshot)
                        break

                    case 'remote room':
                        _id = saveTo.roomId
                        await saveRoomSnapshot(_id, snapshot)
                        break
                }
                logger.log('supabase:database', `Saved snapshot to ${saveTo.destination} ${_id}`)
            } catch (error) {
                logger.error('supabase:database', 'Error saving snapshot', (error as Error).message)
            }
        }

        let timeout: NodeJS.Timeout
        const debouncedSave = (snapshot: TLEditorSnapshot) => {
            clearTimeout(timeout)
            timeout = setTimeout(() => save(snapshot), 1000)
        }

        const listener = editor?.store.listen(({changes}) => {
            debouncedSave(editor.getSnapshot())
        }, {source: 'user', scope: 'document'})
    
        return () => {
            clearTimeout(timeout)
            listener?.() // Removes the listener (returned from store.listen())
        }
    }, [editor, saveTo])

    return null
})

export default AutoSaver