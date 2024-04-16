'use client'
import styles from './DocumentsGrid.module.css';
import DocumentMiniature from '../DocumentMiniature/DocumentMiniature';
import Link from 'next/link';
import Thumbnail from '@/app/[locale]/_components/Thumbnail/Thumbnail';
import { useCapsules } from '@/app/[locale]/_hooks/useCapsules';
import { useState, useEffect } from 'react';
import type { Capsule } from '@/supabase/services/capsules';
import logger from '@/app/_utils/logger';
import { IconButton, DropdownMenu, Badge } from '@radix-ui/themes';
import { Ellipsis } from 'lucide-react';
import { Trash2, Copy, TextCursor, CloudOff } from 'lucide-react';
import { deleteLocalTLDrawDB, getLocalTLDrawDocName } from '@/app/_utils/tldraw/localDBManager';
import type { TLStoreSnapshot } from 'tldraw';


interface DocumentsGridProps {
    messages: {
        untitled: string;
    }
}


// TODO: Remove capsule name from Supabase, as it is stored inside the tldraw document. Same with created_at.

/**
 * This grid displays the capsules from the database and the local storage.
 */
export default function DocumentsGrid({ messages }: DocumentsGridProps) {

    //const t = await getTranslations('dashboard')

    // Get the capsules from the database
    const { capsules } = useCapsules()

    // Get the capsules from the local storage
    const [localCapsules, setLocalCapsules] = useState<Capsule[]>([])
    useEffect(() => {
        // Have to put this in a function because useEffect can't be async
        const _setLocalCapsules = async () => {
            // Get the list of tldraw documents set by TLDraw into localStorage. The list is managed automatically by tldraw when mounting an editor witha persistence key.
            const localCapsulesIndex = localStorage.getItem('TLDRAW_DB_NAME_INDEX_v2')
            if (localCapsulesIndex) {
                // The list is a stringified array of keys. Let's transform it into a real array of strings.
                let localCapsulesKeys = JSON.parse(localCapsulesIndex) as string[]
                localCapsulesKeys = localCapsulesKeys.map((key) => key.replace('TLDRAW_DOCUMENT_v2', '')) // Remove the `TLDRAW_DOCUMENT_v2` prefix
                logger.log('system:file', `Found ${localCapsulesKeys.length} local storage capsules`)

                // Now that we have the keys, we can get the document names from the local IndexedDB containing the whole tldraw documents.
                // This indexedDB is also managed by tldraw.
                const localCapsules = await Promise.all(localCapsulesKeys.map(async (key) => {
                    const name = await getLocalTLDrawDocName(key)
                    //logger.log('system:file', `Local names: ${name}`)
                    return ({
                        id: key,
                        created_at: 'no date',
                        created_by: 'local',
                        title: name,
                        tld_snapshot: null,
                    })
                }))
                logger.log('system:file', 'Local capsules found', localCapsules.map((c) => c.title))
                setLocalCapsules(localCapsules)
            }
        }

        _setLocalCapsules()

    }, [])



    return (
        <div className={styles.grid}>
            {capsules.concat(localCapsules).map((cap) => {

                const id = cap.id
                const title = cap.title || messages.untitled
                const created_at = new Date(cap.created_at)
                const snap = cap.tld_snapshot?.[0] as TLStoreSnapshot | undefined

                let url = `/capsule/${id}`
                if (localCapsules.includes(cap)) {
                    url += '?local=true'
                }

                const handleDelete = async () => {
                    if (localCapsules.includes(cap)) {
                        deleteLocalTLDrawDB(id, (res) => {
                            if (res === 'success') {
                                logger.log('system:file', `Local capsule ${id} deleted successfully`)
                                setLocalCapsules(localCapsules.filter((c) => c.id !== id))
                            }
                        })
                    } else {
                        logger.warn('system:file', `Deleting capsule ${id} from the database is not yet implemented`)
                    }
                }

                return (
                    <div key={id} style={{ position: 'relative' }}>
                        <Link href={url} className={styles.link}>
                            <DocumentMiniature title={title} createdAt={created_at}>
                                {snap &&  <Thumbnail snapshot={snap} scale={0.2} />}
                            </DocumentMiniature>
                        </Link>

                        <DropdownMenu.Root>
                            <DropdownMenu.Trigger>
                                <IconButton radius='full' size='1' variant='soft' style={{ position: 'absolute', top: '0', right: '0', margin: '5px' }}>
                                    <Ellipsis size='18' />
                                </IconButton>
                            </DropdownMenu.Trigger>

                            <DropdownMenu.Content size='1'>

                                <DropdownMenu.Item disabled>
                                    <TextCursor size='13' />
                                    Renommer
                                </DropdownMenu.Item>

                                <DropdownMenu.Item disabled>
                                    <Copy size='13' />
                                    Dupliquer
                                </DropdownMenu.Item>

                                <DropdownMenu.Separator />

                                <DropdownMenu.Item onSelect={handleDelete} color='red'>
                                    <Trash2 size='13' />
                                    Supprimer
                                </DropdownMenu.Item>

                            </DropdownMenu.Content>
                        </DropdownMenu.Root>

                        {localCapsules.includes(cap) && (
                            <Badge radius='full' style={{ position: 'absolute', top: '0', left: '0', margin: '5px' }}>
                                <CloudOff size='18' />
                            </Badge>
                        )}


                    </div>
                )
            })}
        </div>
    )
}
