'use client'
import Canvas from "../Canvas/Canvas";
import { TLStoreSnapshot,  createTLStore, defaultShapeUtils } from "tldraw";
import AutoSaver from "../custom-ui/AutoSaver/AutoSaver";
import { useParams, useSearchParams } from "next/navigation";
import { fetchCapsuleSnapshot } from "@/supabase/services/capsules";
import { useEffect, useState } from "react";
import logger from "@/utils/logger";


/**
 * This is a solo canvas (no real time collaboration). `SL` stands for "solo".
 * It can either fetch the remote snapshot from database (if `local=false`)
 * or use the local storage (if `local=true`) for loginless users.
 * It also has the ability to load a default snapshot (if `loadDefault` search param is set in URL).
 */
export default function CanvasSL() {
    const { capsule_id: capsuleId } = useParams<{ capsule_id: string }>()
    const searchParams = useSearchParams()
    const local = searchParams.get('local') === 'true'
    const loadDefault = searchParams.get('loadDefault')

    // Get the initial snapshot from the capsule
    const [initialSnapshot, setInitialSnapshot] = useState<TLStoreSnapshot | undefined>(undefined)
    useEffect(() => {
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
                    const demoSnapshot = await fetchCapsuleSnapshot('1c5fff8e-64fb-4540-9e0e-10120e163b77')
                    setInitialSnapshot(demoSnapshot)
                    logger.log('react:component', 'CanvasSL', 'Init a local capsule with a default snapshot to load')
                    break
                }
            }
        }
        _setInitialSnapshot()
    }, [capsuleId, local, loadDefault])


    // Create the store
    const [store, setStore] = useState(createTLStore({shapeUtils: defaultShapeUtils}))
    useEffect(() => {
        if (initialSnapshot) {
            const _store = createTLStore({shapeUtils: defaultShapeUtils})
            _store.loadSnapshot(initialSnapshot)
            setStore(_store)
        }
    }, [initialSnapshot])

    
    if (local) {
        // If local, we will use the local storage (see https://tldraw.dev/docs/persistence)
        return <Canvas persistenceKey={capsuleId} initialSnapshot={initialSnapshot}/>
        
    } else {
        // If not local, we will use the AutoSaver to save the snapshot to the capsule
        return (
            <Canvas store={store}>
                <AutoSaver saveTo={{ destination: 'remote capsule', capsuleId: capsuleId }} />
            </Canvas>
        )
    }
}


