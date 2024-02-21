import styles from './DocumentsGrid.module.css';
import DocumentMiniature from './DocumentMiniature/DocumentMiniature';
import { getCapsuleIdsTitlesDates } from '@/supabase/services/capsules';
import { getUserId } from '@/supabase/services/auth';
import Link from 'next/link';

export default async function DocumentsGrid() {

    let capsules: { id: string, title: string, created_at: Date }[] = []
    try {
        const userId = await getUserId()
        capsules = await getCapsuleIdsTitlesDates(userId)
    } catch (error) {
        console.error('Error getting capsules', error)
    }

    return (
        <div className={styles.grid}>
            {capsules.map(({ id: capsuleId, title, created_at }) => {
                return (
                    <Link href={`/capsule/${capsuleId}`} key={capsuleId} className={styles.link}>
                        <DocumentMiniature title={title} createdAt={created_at} />
                    </Link>
                )
            })}
        </div>
    )
}
