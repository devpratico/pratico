import styles from './DocumentsGrid.module.css';
import DocumentMiniature from './DocumentMiniature/DocumentMiniature';
import { getCapsuleIdsByUserId } from '@/supabase/services/capsules';
import { getUserId } from '@/supabase/services/auth';
import Link from 'next/link';

export default async function DocumentsGrid() {

    let capsuleIds: string[] = []
    try {
        const userId = await getUserId()
        capsuleIds = await getCapsuleIdsByUserId(userId)
    } catch (error) {
        console.error('Error getting capsule ids', error)
    }


    return (
        <div className={styles.grid}>
            {capsuleIds.map((capsuleId: string) => {
                return (
                    <Link href={`/capsule/${capsuleId}`} key={capsuleId}>
                        <DocumentMiniature title={capsuleId} />
                    </Link>
                )
            })}
        </div>
    )
}
