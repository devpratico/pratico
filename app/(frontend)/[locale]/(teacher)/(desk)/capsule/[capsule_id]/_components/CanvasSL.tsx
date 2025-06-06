'use client'
import Canvas from "@/app/(frontend)/[locale]/_components/canvases/Canvas";
import { TLStoreSnapshot } from "tldraw";
import AutoSaver from "@/app/(frontend)/[locale]/_components/canvases/custom-ui/AutoSaver";
import { useParams } from "next/navigation";
import { fetchCapsuleSnapshot } from "@/app/(backend)/api/capsule/capsule.client";
import { useEffect, useState } from "react";
import Resizer from "@/app/(frontend)/[locale]/_components/canvases/custom-ui/Resizer";
import logger from "@/app/_utils/logger";
import { CustomTlToolbar } from "@/app/(frontend)/[locale]/_components/canvases/custom-ui/tool-bar/ToolBar";
import useWindow from "@/app/(frontend)/_hooks/contexts/useWindow";
import { Flex, Box } from "@radix-ui/themes";



/**
 * This is a solo canvas (no real time collaboration). `SL` stands for "solo".
 * It can either fetch the remote snapshot from database (if `local=false`)
 * or use the local storage (if `local=true`) for loginless users.
 * It also has the ability to load a default snapshot (if `loadDefault` search param is set in URL).
 */
export default function CanvasSL() {
    const { capsule_id: capsuleId } = useParams<{ capsule_id: string }>()
    //const { widerThan } = useWindow();

    // Get the user
    /*
    const initialUser: CanvasUser = { id: 'anonymous', name: 'Anonymous', color: 'black'}
    const [user, setUser] = useState<CanvasUser>(initialUser)
    useEffect(() => {
        async function _setUser() {
            const userId = (await fetchUser()).id
            const { first_name, last_name } = await fetchNames(userId)
            const user: CanvasUser = {
                id: userId,
                name: `${first_name} ${last_name}`,
                color: getRandomColor(),
            }
            setUser(user)
        }
        _setUser()
    }, [])*/

    // Get the initial snapshot from the capsule
    const [initialSnapshot, setInitialSnapshot] = useState<TLStoreSnapshot | undefined>(undefined)
	
	useEffect(() => {
        async function _setInitialSnapshot() {
            const { data, error } = await fetchCapsuleSnapshot(capsuleId)
            const snapshot = data?.tld_snapshot?.[0]

            if (snapshot) {
                logger.log('react:component', 'CanvasSL', 'Initial snapshot fetched')
                setInitialSnapshot(snapshot as any)
            } else {
                logger.log('react:component', 'CanvasSL', 'No initial snapshot')
            }
        }
        _setInitialSnapshot()
    }, [capsuleId])
	  
    // Create the store
    /*
    const [store, setStore] = useState(createTLStore({shapeUtils: defaultShapeUtils}))
    useEffect(() => {
        if (initialSnapshot) {
            const _store = createTLStore({shapeUtils: defaultShapeUtils})
            _store.loadSnapshot(initialSnapshot)
            setStore(_store)
        }
    }, [initialSnapshot])*/

    
    return (
        <Canvas initialSnapshot={initialSnapshot}>
            <CustomTlToolbar /> 
            <Box display={{initial:'none', xs:'block'}} >
                <Resizer insets={{top: 0, right: 0, bottom: 0, left: 80}} margin={0} />
            </Box>

            <Box display={{ initial: 'block', xs: 'none' }} >
                <Resizer insets={{ top: 0, right: 0, bottom: 0, left: 0 }} margin={0} />
            </Box>
            <AutoSaver saveTo={{ destination: 'remote capsule', capsuleId: capsuleId }} />
        </Canvas>
    )

}




/*


//const searchParams = useSearchParams()
//const local = searchParams.get('local') === 'true'
//const loadDefault = searchParams.get('loadDefault')


async function _setInitialSnapshot() {

            // Let's make a value out of local and loadDefault to use in a switch statement
            // It's a string that will look something like this: "{local: false, withloadDefault: true}"
            // (We need to use a strin because we can't use objects in a switch statement - they're compared by reference instead of value)
            const caseKey = JSON.stringify({ local: local, withloadDefault: !!loadDefault});

            switch (caseKey) {

                // A supabase capsule with no default snapshot to load
                case JSON.stringify({local: false, withloadDefault: false}): {
                    const snapshot = await fetchCapsuleSnapshot(capsuleId)
                    setInitialSnapshot(snapshot)
                    logger.log('react:component', 'CanvasSL', 'Init a supabase capsule with no default snapshot to load')
                    break
                }

                // A supabase capsule with a default snapshot to load
                case JSON.stringify({local: false, withloadDefault: true}): {
                    const snapshot = await fetchCapsuleSnapshot(capsuleId)
                    if (snapshot) {
                        // If a snapshot already exists, we don't load the default snapshot
                        setInitialSnapshot(snapshot)
                        logger.log('react:component', 'CanvasSL', 'Init a supabase capsule with a default snapshot to load, but a snapshot already exists')
                    } else {
                        // Load the default snapshot
                        logger.log('react:component', 'CanvasSL', 'Init a supabase capsule with a default snapshot to load (not implemented yet)')
                    }
                    break
                }

                // A local capsule with no default snapshot to load
                case JSON.stringify({local: true, withloadDefault: false}): {
                    // Nothing to do, the snapshot will be empty
                    logger.log('react:component', 'CanvasSL', 'Init a local capsule with no default snapshot to load')
                    break
                }

                // A local capsule with a default snapshot to load
                case JSON.stringify({local: true, withloadDefault: true}): {
                    // Load the default snapshot
                    
                    const isProduction = process.env.NODE_ENV === 'production';
                    // TODO: Remove hard coded capsule id
                    const demoCapsuleId = isProduction ? '40b2ea17-97b4-4cb6-b630-6db76b00a27d' : '1c5fff8e-64fb-4540-9e0e-10120e163b77';
                    const demoSnapshot = await fetchCapsuleSnapshot(demoCapsuleId)
                    setInitialSnapshot(demoSnapshot)
                    logger.log('react:component', 'CanvasSL', 'Init a local capsule with a default snapshot to load')
                    break
                }
            }
        }








if (local) {
        // If local, we will use the local storage (see https://tldraw.dev/docs/persistence)
        return <Canvas user={user} persistenceKey={capsuleId} initialSnapshot={initialSnapshot}/>


*/