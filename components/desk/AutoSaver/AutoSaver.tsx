import { useEditor } from '@tldraw/tldraw'
import { saveCapsuleSnapshot } from '@/actions/capsuleActions'
import { saveRoomSnapshot } from '@/supabase/services/rooms';
import logger from '@/utils/logger'


type AutoSaverProps = {
    destination: 'capsule'
    id: string;
} | {
    destination: 'room'
    id: number;
}


/**
 * This automaticaly saves the current snapshot to supabase every time it changes.
 * You can choose to save to a room (while in collaboration mode) or a capsule (while in solo edit mode)
 */
export default function AutoSaver({destination, id}: AutoSaverProps) {

    const editor = useEditor()
    
    const save = async () => {
        const snapshot = editor.store.getSnapshot()

        try {
            // TODO: fetch API instead of using supabase client side
            if (destination === 'capsule') {
                await saveCapsuleSnapshot(id, snapshot)
            } else {
                await saveRoomSnapshot(id, snapshot)
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

    editor.store.listen(({changes}) => {
        debouncedSave()
    }, {source: 'user', scope: 'document'})

    return null
}