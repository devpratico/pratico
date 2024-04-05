import { fetchCapsulesData, Capsule } from '@/supabase/services/capsules';
import { fetchUserId } from '@/supabase/services/auth';
import { CapsulesProvider } from '@/app/_hooks/useCapsules';
import logger from '@/app/_utils/logger';


export default async function Layout({ children }: { children: React.ReactNode }) {

    let capsules: Capsule[] = []

    // Fetch capsules data
    try {
        const userId = await fetchUserId()
        capsules = await fetchCapsulesData(userId)
    } catch (error) {
        logger.log('react:hook', 'No capsules fetched', (error as Error).message)
    }


    return (
        <CapsulesProvider value={{ capsules }}>
            { children }
        </CapsulesProvider>
    )
}