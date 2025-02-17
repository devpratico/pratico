'use client'
import { track, TLEditorSnapshot, useEditor, exportToBlob } from 'tldraw'
import { saveCapsuleSnapshot } from '@/app/(backend)/api/capsule/capsule.client'
import { saveRoomSnapshot } from '@/app/(backend)/api/room/room.client'
import logger from '@/app/_utils/logger'
//import debounce from '@/utils/debounce';
import { useEffect, useCallback } from 'react';
import { defaultBox } from './Resizer'
import createClient from '@/supabase/clients/client'


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
    const editor  = useEditor();
    const supabase = createClient();
    const save = useCallback(async (snapshot: TLEditorSnapshot) => {
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
    }, [saveTo])

    // Save on mount
    useEffect(() => {
        if (editor && saveOnMount) {
            logger.log('react:component', 'AutoSaver', 'First save of autosaver')
            save(editor.getSnapshot())
        }
    }, [editor, save, saveOnMount])


    // Save when the snapshot changes
    useEffect(() => {
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
    }, [editor, save])
    useEffect(() => {
        const saveSvgUrls = async () => {
            console.log("SAVE SVG URL");
            const allPages = editor.getPages();
            const allBlobs: Blob[] = [];
            console.log("ALL PAGES", allPages);
    
            if (allPages.length > 0) {
                try {
                    for (let i = 0; i < allPages.length; i++) {
                        const shapeIds = editor.getPageShapeIds(allPages[i]);
                        if (shapeIds.size === 0)
                            continue;
    
                        try {
                            const blob = await exportToBlob({
                                editor,
                                ids: Array.from(shapeIds),
                                format: 'svg',
                                opts: {
                                    bounds: defaultBox,
                                    padding: 0,
                                    darkMode: false,
                                }
                            });
                            
                            if (blob.size > 0) {
                                allBlobs.push(blob);
                            }
    
                        } catch (error) {
                            logger.error("react:component", "CapsuleToSVGBtn", `Failed to get svgElement in page ${allPages[i].id}`, error);
                        }
                    }
                } catch (error) {
                    logger.error("react:component", "CapsuleToSVGBtn", "handleExportAllPages", error);
                }
    
                const validBlobs = allBlobs.filter(blob => blob.size > 0);
                let files: File[] = [];
                if (validBlobs.length > 0) {
                    for (let i = 0; i < validBlobs.length; i++) {
                        const file = new File([validBlobs[i]], `capsule${i}.svg`, { type: "image/svg+xml" });
                        files.push(file);
                        
                    }
                    const { data: getSvg, error: getSvgError } = await supabase.storage.from('capsules_pdfurl').download(`capsule.svg`);
                        console.log("SSSVGG", getSvg, getSvgError);
                        if (!getSvg)
                        {
                            const { data, error } = await supabase.storage.from('capsules_pdfurl').upload(`capsule.svg`, files.join(), {
                                cacheControl: '3600',
                                upsert: false,
                            });
        
                            console.log("UPLOADING SVG", data, error);
                        }
                }
            }
        }
    
        saveSvgUrls();
    }, [editor, supabase]);
    

    return null
})

export default AutoSaver