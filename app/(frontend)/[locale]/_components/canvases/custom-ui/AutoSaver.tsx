'use client'
import { track, TLEditorSnapshot, useEditor } from 'tldraw'
import { saveCapsuleSnapshot } from '@/app/(backend)/api/capsule/capsule.client'
import { saveRoomSnapshot } from '@/app/(backend)/api/room/room.client'
import logger from '@/app/_utils/logger'
import { useEffect, useMemo } from 'react';
import { useNav } from '@/app/(frontend)/_hooks/contexts/useNav'
import debounce from '@/app/_utils/debounce'
// TODO: use lodash debounce instead of ours


export type AutoSaverProps = {
    saveTo:
          { destination: 'remote capsule', capsuleId: string }
        | { destination: 'remote room',    roomId:    number },
    saveOnMount?: boolean
}


/**
 * This automaticaly saves the current snapshot every time it changes.
 * You can choose to save to:
 * * A room (while in collaboration mode)
 * * A capsule (while in solo edit mode)
 */
const AutoSaver = track(({saveTo, saveOnMount=false}: AutoSaverProps) => {
    const editor  = useEditor()
    const { currentPageId } = useNav()

    const debounceSave = useMemo(() => debounce(() => {
        save({ saveTo, snapshot: editor.getSnapshot() });
    }, 1000), [editor, saveTo]);

    // Save on mount
    useEffect(() => {
        if (editor && saveOnMount) {
            logger.log('react:component', 'AutoSaver', 'First save of autosaver')
            save({ saveTo, snapshot: editor.getSnapshot() })
        }
    }, [editor, saveOnMount, saveTo])


    // Save when the snapshot changes (drawing shapes...)
    useEffect(() => {
        const documentListener = editor?.store.listen(({changes}) => {
            debounceSave()
        }, {source: 'user', scope: 'document'})

    
        return () => {
            documentListener?.() // Removes the listener (returned from store.listen())
        }
    }, [editor, debounceSave])

    // Page change
    useEffect(() => {
        debounceSave()
    }, [currentPageId, debounceSave])

    return null
})

export default AutoSaver

async function save(args: {
    saveTo: AutoSaverProps['saveTo'],
    snapshot: TLEditorSnapshot
}) {
    const { saveTo, snapshot } = args
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
        logger.log('supabase:database', `Saved capsule snapshot to ${saveTo.destination} ${_id}`)
    } catch (error) {
        logger.error('supabase:database', 'Error saving capsule snapshot', (error as Error).message)
    }
}