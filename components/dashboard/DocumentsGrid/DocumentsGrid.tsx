import styles from './DocumentsGrid.module.css';
import DocumentMiniature from './DocumentMiniature/DocumentMiniature';
import { getCapsuleIdsByUserId, getCapsuleTitle } from '@/supabase/services/capsules';
import { getUserId } from '@/supabase/services/auth';
import Link from 'next/link';

export default async function DocumentsGrid() {

    const untitled = 'Untitled'

    let capsuleIds: string[] = []
    try {
        const userId = await getUserId()
        capsuleIds = await getCapsuleIdsByUserId(userId)
    } catch (error) {
        console.error('Error getting capsule ids', error)
    }

    const capsuleTitles = await Promise.all(capsuleIds.map(async (capsuleId: string) => {
        try {
            return await getCapsuleTitle(capsuleId) || untitled
        } catch (error) {
            console.error('Error getting capsule title', error)
            return capsuleId
        }
    }))

    const capsules = capsuleIds.map((capsuleId: string, index: number) => {
        return {
            id: capsuleId,
            title: capsuleTitles[index]
        }
    })



    return (
        <div className={styles.grid}>
            {capsules.map(({ id: capsuleId, title }) => {
                return (
                    <Link href={`/capsule/${capsuleId}`} key={capsuleId} className={styles.link}>
                        <DocumentMiniature title={title} />
                    </Link>
                )
            })}
        </div>
    )
}
