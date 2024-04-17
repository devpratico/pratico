'use client'
import {
  TldrawImage,
  Box,
  TLPageId,
  StoreSnapshot,
  TLRecord,
} from "tldraw";


interface ThumbnailProps {
    snapshot: StoreSnapshot<TLRecord>
    scale?: number
    pageId?: TLPageId
}


/**
 * Creates a thumbnail of a page. See [TldrawImage](https://github.com/tldraw/tldraw/blob/main/apps/examples/src/examples/image-component/TldrawImageExample.tsx) for more info.
 * @param snapshot - The snapshot of the tldraw store
 * @param pageId - The id of the page (optional). If not provided, the first page will be used.
 */
export default function Thumbnail({ snapshot, scale=0.05, pageId }: ThumbnailProps) {
  return (
    <TldrawImage
        snapshot={snapshot}
        format='png'
        scale={scale}
        background={false}
        pageId={pageId}
        bounds={new Box(0, 0, 1920, 1080)}
        preserveAspectRatio={'true'}
    />
  );
}