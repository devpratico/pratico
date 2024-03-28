'use client'
import styles from './DocumentsGrid.module.css';
import DocumentMiniature from '../DocumentMiniature/DocumentMiniature';
import Link from 'next/link';
import Thumbnail from '@/components/Thumbnail/Thumbnail';
import { useCapsules } from '@/hooks/useCapsules';
import { useState, useEffect } from 'react';
import type { Capsule } from '@/supabase/services/capsules';
import logger from '@/utils/logger';


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
            const localCapsulesKeys = JSON.parse(localCapsulesIndex) as string[]
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

                return (
                    <Link href={url} key={id} className={styles.link}>
                        <DocumentMiniature title={title} createdAt={created_at}>
                            <Thumbnail snapshot={snap} scale={0.2} />
                        </DocumentMiniature>
                    </Link>
                )
            })}
        </div>
    )
}
