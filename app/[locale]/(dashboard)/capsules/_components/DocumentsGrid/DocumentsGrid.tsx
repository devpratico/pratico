'use client'
import styles from './DocumentsGrid.module.css';
import DocumentMiniature from '../DocumentMiniature/DocumentMiniature';
import Link from 'next/link';
import Thumbnail from '@/components/Thumbnail/Thumbnail';
import { useCapsules } from '@/hooks/useCapsules';
import { useState, useEffect } from 'react';
import type { Capsule } from '@/supabase/services/capsules';
import logger from '@/utils/logger';
import { IconButton, DropdownMenu, Badge } from '@radix-ui/themes';
import { Ellipsis } from 'lucide-react';
import { Trash2, Copy, TextCursor, CloudOff } from 'lucide-react';
import { deleteLocalTLDrawDB } from '@/utils/tldraw/localDBManager';


interface DocumentsGridProps {
    messages: {
        untitled: string;
    }
}

export default function DocumentsGrid({ messages }: DocumentsGridProps) {

    //const t = await getTranslations('dashboard')

    // Get the capsules from the database
    const { capsules } = useCapsules()

    // Get the capsules from the local storage
    const [localCapsules, setLocalCapsules] = useState<Capsule[]>([])
    useEffect(() => {
        const localCapsulesIndex = localStorage.getItem('TLDRAW_DB_NAME_INDEX_v2')

        if (localCapsulesIndex) {
            
            let localCapsulesKeys = JSON.parse(localCapsulesIndex) as string[]
            // Remove the `TLDRAW_DOCUMENT_v2` prefix
            localCapsulesKeys = localCapsulesKeys.map((key) => key.replace('TLDRAW_DOCUMENT_v2', ''))

            logger.log('system:file', `Found ${localCapsulesKeys.length} local storage capsules`)
            const localCapsules = localCapsulesKeys.map((key) => ({
                id: key,
                created_at: 'no date',
                created_by: 'local',
                title: key,
                tld_snapshot: null,
            }))
            setLocalCapsules(localCapsules)
        }
    }, [capsules])



    return (
        <div className={styles.grid}>
            {capsules.concat(localCapsules).map((cap) => {

                const id = cap.id
                const title = cap.title || messages.untitled
                const created_at = new Date(cap.created_at)
                const snap = JSON.parse(cap.tld_snapshot as any)

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
                                <Thumbnail snapshot={snap} scale={0.2} />
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
