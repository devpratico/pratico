'use client'
import { useEditor, track } from 'tldraw'
import { saveCapsuleSnapshot } from '@/app/[locale]/capsule/[capsule_id]/_actions/capsuleActions'
import { saveRoomSnapshot } from '@/supabase/services/rooms';
import logger from '@/app/_utils/logger'
//import debounce from '@/utils/debounce';
import { useEffect } from 'react';

// TODO: Remove local storage as we use tldraw's persistenceKey

export type AutoSaverProps = {
    saveTo:
        //  { destination: 'local storage',  snapshotId: string }
          { destination: 'remote capsule', capsuleId: string }
        | { destination: 'remote room',    roomId:    number }
}


/**
 * This automaticaly saves the current snapshot every time it changes.
 * You can choose to save to:
 * * A room (while in collaboration mode)
 * * A capsule (while in solo edit mode)
 * * Browser Llocal storage (for loginless users)
 */
const AutoSaver = track(({saveTo}: AutoSaverProps) => {
    const { store } = useEditor()

    useEffect(() => {
        const save = async () => {
            const snapshot = store.getSnapshot()
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
                    
                    /*
                    case 'local storage':
                        _id = saveTo.snapshotId
                        localStorage.setItem(`snapshot-${_id}`, JSON.stringify(snapshot))
                        break
                    */
                }
                logger.log('supabase:database', `Saved snapshot to ${saveTo.destination} ${_id}`)
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
    }, [store, saveTo])

    return null
})

export default AutoSaver