'use client'
import { TLEditorSnapshot, TLPageId } from 'tldraw';
import { createContext, useContext, useState, useEffect } from 'react';
//import logger from '../_utils/logger';
import { debounce } from 'lodash';
import { useTLEditor } from './useTLEditor';


type SnapshotContextType = {
    snapshot: TLEditorSnapshot | undefined;
};


const emptySnapshotContext: SnapshotContextType = {
    snapshot: undefined,
};


const SnapshotContext = createContext<SnapshotContextType>(emptySnapshotContext);


export function SnapshotProvider({ children }: { children: React.ReactNode }) {
    const { editor } = useTLEditor()
    const [snapshot, setSnapshot] = useState<TLEditorSnapshot | undefined>(undefined);

    useEffect(() => {
        if (!editor) return;

        // Get the new snapshot
        setSnapshot(editor?.getSnapshot());

        // Create a debounced function to update the snapshot
        const debouncedSetSnapshot = debounce((snapshot?: TLEditorSnapshot) => {
            setSnapshot(snapshot);
            //console.log('Snapshot updated', snapshot);
        }, 1000, { leading: false, trailing: true });

        // React to the changes of the snapshot
        const unlisten = editor?.store.listen((event) => {
            debouncedSetSnapshot(editor?.getSnapshot());
        }, { scope: 'document', source: 'all' });

        return () => {
            unlisten?.();
            debouncedSetSnapshot.cancel();
        }

    }, [editor]);

    return (
        <SnapshotContext.Provider value={{ snapshot }}>
            {children}
        </SnapshotContext.Provider>
    );
}

/**
 * This hook is used to expose the TLdraw [Editor](https://tldraw.dev/docs/editor) **outside** of the TLdraw component.
 * 
 * Out of the box, the editor is only accessible by TLdraw component's children via the `useEditor` hook.
 * Instead of using `useEditor` in a child component, you can use `useSnapshot` where it is accessible.
 * `useSnapshot` is used in the same way as `useEditor` and exposes the same methods and properties.
 * For consistency, I recommend using `useSnapshot` instead of `useEditor` in the whole app.
 * @example
 * const { editor } = useSnapshot();
 * editor.createPage({ name: 'New page' });
 */
export function useSnapshot() {
    const context = useContext(SnapshotContext);
    return context;
}