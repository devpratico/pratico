import styles from './DocumentsGrid.module.css';
import DocumentMiniature from '../DocumentMiniature/DocumentMiniature';
import { fetchCapsulesData, Capsule } from '@/supabase/services/capsules';
import { fetchUserId } from '@/supabase/services/auth';
import Link from 'next/link';
import Thumbnail from '@/components/Thumbnail/Thumbnail';
import { getTranslations } from 'next-intl/server';


export default async function DocumentsGrid() {

    const t = await getTranslations('dashboard')

    let capsules: Capsule[] = []
    try {
        const userId = await fetchUserId()
        capsules = await fetchCapsulesData(userId)
    } catch (error) {
        console.error('Error getting capsules', error)
    }

    return (
        <div className={styles.grid}>
            {capsules.map((cap) => {

                const id = cap.id
                const title = cap.title || t('untitled')
                const created_at = new Date(cap.created_at)
                const snap = JSON.parse(cap.tld_snapshot as any)

                return (
                    <Link href={`/capsule/${id}`} key={id} className={styles.link}>
                        <DocumentMiniature title={title} createdAt={created_at}>
                            <Thumbnail snapshot={snap} scale={0.2} />
                        </DocumentMiniature>
                    </Link>
                )
            })}
        </div>
    )
}
