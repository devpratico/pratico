import { Flex, Text, Tooltip, Box } from '@radix-ui/themes';
import Link from 'next/link';
import Image from 'next/image';
import TopBarPortal from '../../_components/TopBarPortal';
import MenuTabs from '../../_components/MenuTabs';
import { Puzzle, Ellipsis, FlaskRound } from 'lucide-react';
import CapsuleTitle from '../../_components/CapsuleTitle';
import CanvasSL from './_components/CanvasSL';
import DoneBtn from './_components/DoneBtn';
import StartBtn from './_components/StartBtn';
import { fetchCapsuleSnapshot } from '@/app/api/_actions/capsule';
import logger from '@/app/_utils/logger';
import { Json } from '@/supabase/types/database.types';



export default function Page({ params: { capsule_id } }: { params: { capsule_id: string } }) {
    const logoScale = 0.25
	// let snapshot: any = null;
    // console.log('capsule_id found in searchParams:', capsule_id, '(app/[locale]/(teacher)/(desk)/capsule/[capsule_id]/page.tsx)')
	// console.log("TEST fetchCapsuleSnapshot", capsule_id)
	// logger.debug("supabase:database", "fetchCapsuleSnapshot test ", capsule_id, "[capsule_id]/page.tsx")
	// fetchCapsuleSnapshot(capsule_id)
	// 	.then(({ data, error }) => {
	// 		console.log("DATA FETCHCAPSULESNAPSHOT:", data, " ou error: ", error);
	// 		const snapshotData = data?.tld_snapshot?.[0]
	// 		console.log('snapshot:', snapshotData, '(app/[locale]/(teacher)/(desk)/capsule/[capsule_id]/_components/CanvasSL.tsx)')
	// 		if (snapshotData) {
	// 			logger.log('react:component', 'CanvasSL', 'Initial snapshot fetched')
	// 			snapshot = snapshotData;
	// 		} else {
	// 			logger.log('react:component', 'CanvasSL', 'No initial snapshot')
	// 		}
	// 	})
	// 	.catch(error => console.error("Error fetcCapsuleSnapshot exception test", error))
	// console.log("FIN TEST fetchCpsuleSnapshot")
    return (
        <>
            <TopBarPortal>
                <Flex justify={{ initial: 'center', xs: 'between' }} align='center'>

                    <Flex gap='5' display={{ initial: 'none', xs: 'flex' }}>
                        <Link href='/capsules' style={{ display: 'flex', alignItems: 'center' }}>
                            <Tooltip content={<Text size='2'>Accueil</Text>} side='bottom' style={{ padding: '0.5rem' }}>
                                <Image src='/images/logo.png' width={386 * logoScale} height={105 * logoScale} alt="Pratico" />
                            </Tooltip>
                        </Link>

                        <CapsuleTitle capsuleId={capsule_id}/>

                        <StartBtn message='lancer la session'/>

                    </Flex>

                    

                    <Flex gap='3' align='center' justify='between' width={{ initial: '100%', xs: 'auto' }}>

                        {/* MenuTabs for Desktop */}
                        <Box display={{ initial: 'none', xs: 'block' }}>
                            <MenuTabs tabs={[
                                { menu: 'activities', label: 'Activités', icon: <Puzzle /> },
                                { menu: 'more', label: 'Plus', icon: <Ellipsis /> }
                            ]} />
                        </Box>

                        <Box width='100%' display={{ initial: 'block', xs: 'none' }}/>

                        {/* MenuTabs for Mobile - it has a Home tab and a smaller padding */}
                        <Box display={{ initial: 'block', xs: 'none' }}>
                            <MenuTabs padding='3px' tabs={[
                                { menu: undefined, label: 'Capsule', icon: <FlaskRound /> },
                                { menu: 'activities', label: 'Activités', icon: <Puzzle /> },
                                { menu: 'more', label: 'Plus', icon: <Ellipsis /> }
                            ]} />
                        </Box>

                        <DoneBtn message='terminer'/>

                    </Flex>

                </Flex>
            </TopBarPortal>

            <CanvasSL />
        </>
    )
}