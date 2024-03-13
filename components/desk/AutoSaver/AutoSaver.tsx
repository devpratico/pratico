'use client'
import { useEditor, track } from '@tldraw/tldraw'
import { saveCapsuleSnapshot } from '@/actions/capsuleActions'
import { saveRoomSnapshot } from '@/supabase/services/rooms';
import logger from '@/utils/logger'
//import debounce from '@/utils/debounce';
import { useEffect } from 'react';


type AutoSaverProps = {
    destination: 'capsule' | 'room';
    id: string;
}


/**
 * This automaticaly saves the current snapshot to supabase every time it changes.
 * You can choose to save to a room (while in collaboration mode) or a capsule (while in solo edit mode)
 */
const AutoSaver = track(({destination, id}: AutoSaverProps) => {
    const { store } = useEditor()

    useEffect(() => {
        const save = async () => {
            const snapshot = store.getSnapshot()

            try {
                if (destination === 'capsule') {
                    await saveCapsuleSnapshot(id, snapshot)
                } else {
                    await saveRoomSnapshot(parseInt(id), snapshot)
                }
                logger.log('supabase:database', `Saved snapshot to ${destination} ${id}`)
            } catch (error) {
                logger.error('supabase:database', 'Error saving snapshot', (error as Error).message)
            }
        }

        let timeout: NodeJS.Timeout
        const debouncedSave = () => {
            clearTimeout(timeout)
            timeout = setTimeout(save, 1000)
        }

        const listener = store.listen(({changes}) => {
            debouncedSave()
        }, {source: 'user', scope: 'document'})
    
        return () => {
            clearTimeout(timeout)
            listener() // Removes the listener (returned from store.listen())
        }
    }, [store, destination, id])

    return null
})

export default AutoSaver