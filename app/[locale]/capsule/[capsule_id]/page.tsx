import styles from './page.module.css'
import MainLayout from '../../../../components/layouts/MainLayout/MainLayout'
import Desk from '@/components/desk/canvas/Desk/Desk'
import { getCapsuleSnapshot } from '@/supabase/services/capsules';


export default async function CreationPage({params}: {params: { capsule_id: string }}) {

  const { capsule_id } = params;
  let snapshot = undefined
	try {
		snapshot = await getCapsuleSnapshot(capsule_id)
	} catch (error) {
		console.error('Error getting snapshot', error)
	}

  const propsForMainLayout = {
    content:  <Desk initialSnapshot={snapshot} capsuleId={capsule_id} />
  }


  return (
    <main className={styles.main}>
      <MainLayout {...propsForMainLayout} />
    </main>
  )
}
