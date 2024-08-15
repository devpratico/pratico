'use client'
import {
  TldrawImage,
  Box,
  TLPageId,
  TLEditorSnapshot,
} from "tldraw";
import { useTLEditor } from "@/app/_hooks/useTLEditor";
import { Flex, Spinner } from "@radix-ui/themes";


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
const Thumbnail = ({ snapshot, scale=0.05, pageId }: ThumbnailProps) => {
    const {snapshot: hookSnapshot } = useTLEditor();

    const _snapshot = snapshot || hookSnapshot;
    if (!_snapshot) return null;

    /**
     * When using the hookSnapshot, it may not contain the desired pageId yet,
     * because we debounce its updates for performance reasons.
     * In that case, we show a spinner until the pageId is available.
     */
    if (!snapshot) {
        const store = _snapshot.document.store as any
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
            snapshot={_snapshot}
            format='png'
            scale={scale}
            //background={false}
            pageId={pageId}
            bounds={new Box(0, 0, 1920, 1080)}
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