'use client'
import {
  TldrawImage,
  Box,
  TLPageId,
  TLEditorSnapshot,
  exportAs
} from "tldraw";
import { useTLEditor } from "@/app/(frontend)/_hooks/useTLEditor";
import { Flex, Spinner } from "@radix-ui/themes";
import { useMemo, useState, useEffect, useTransition, useRef } from "react";
import { useSnapshot } from "@/app/(frontend)/_hooks/useSnapshot";
import { useNav } from "@/app/(frontend)/_hooks/useNav";


interface ThumbnailProps {
    snapshot?: TLEditorSnapshot
    scale?: number
    pageId?: TLPageId
}


/**
 * Creates a thumbnail of a page. See [TldrawImage](https://github.com/tldraw/tldraw/blob/main/apps/examples/src/examples/image-component/TldrawImageExample.tsx) for more info.
 * @param snapshot - The snapshot of the tldraw store (optional). If not provided, the snapshot from the useTLEditor hook will be used.
 * @param pageId - The id of the page (optional). If not provided, the first page will be used.
 */
const Thumbnail = ({ snapshot: argSnapshot, scale=0.05, pageId }: ThumbnailProps) => {
    const bounds = useMemo(() => new Box(0, 0, 1920, 1080), []);

    // The snapshot used will be either the one passed as a prop or the one from the hook
    const {snapshot: hookSnapshot } = useSnapshot()
    const snapshot = useMemo(() => argSnapshot || hookSnapshot, [argSnapshot, hookSnapshot])
    //const { currentPageId } = useNav()

    //const isFirstRender = useRef(true);

    /*
    // Initialize the snapshot on the first render
    const [snapshot, setSnapshot] = useState<TLEditorSnapshot | undefined>(argSnapshot);

    useEffect(() => {
        if (argSnapshot) {
            return;

        } else if (isFirstRender.current && hookSnapshot) {
            // Set the snapshot only on the first render
            setSnapshot(hookSnapshot);
            isFirstRender.current = false;

        } else if (currentPageId === pageId) {
            // Update the snapshot only when the currentPageId matches pageId
            setSnapshot(hookSnapshot);
        }
        
    }, [argSnapshot, hookSnapshot, currentPageId, pageId]);
    */

    if (!snapshot) {
        return null;
    }

    /**
     * When using the hookSnapshot, it may not contain the desired pageId yet,
     * because we debounce its updates for performance reasons.
     * In that case, we show a spinner until the pageId is available.
     */
    if (!argSnapshot && hookSnapshot) {
        const store = hookSnapshot.document.store as any
        const pageIds = getPageKeys(store)
        if (!pageIds.includes(pageId as string)) {
            return (
                <Flex align='center' justify='center' height='100%'>
                    <Spinner />
                </Flex>
            )
        }
    }

    return (
        <TldrawImage
            snapshot={snapshot}
            format='png'
            scale={scale}
            //background={false}
            pageId={pageId}
            bounds={bounds}
            //preserveAspectRatio={'true'}
            padding={0}
        />
    );
}

export default Thumbnail



function getPageKeys(obj: any): string[] {
    // Check if the input is an object
    if (typeof obj !== 'object' || obj === null) {
        throw new Error('Input must be an object');
    }

    // Get all keys from the object
    const keys = Object.keys(obj);

    // Filter keys that start with 'page:'
    const pageKeys = keys.filter(key => key.startsWith('page:'));

    return pageKeys;
}