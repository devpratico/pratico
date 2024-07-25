'use client'
import { Editor, TLEditorSnapshot } from 'tldraw';
import { createContext, useContext, useState, useEffect } from 'react';
//import logger from '../_utils/logger';
import debounce from '../_utils/debounce';


type TLEditorContextType = {
    editor: Editor | undefined; // There is no editor until tldraw is ready
    setEditor: (editor: Editor) => void;
    //snapshot: StoreSnapshot<TLRecord> | undefined;
    snapshot: TLEditorSnapshot | undefined;
};


const emptyTLEditorContext: TLEditorContextType = {
    editor: undefined,
    setEditor: () => { },
    snapshot: undefined,
};


const TLEditorContext = createContext<TLEditorContextType>(emptyTLEditorContext);


export function TLEditorProvider({ children }: { children: React.ReactNode }) {

    const [editor, setEditor] = useState<Editor | undefined>(undefined);
    //const [snapshot, setSnapshot] = useState<StoreSnapshot<TLRecord> | undefined>(undefined);
    const [snapshot, setSnapshot] = useState<TLEditorSnapshot | undefined>(undefined);

    useEffect(() => {
        // Get the new snapshot
        setSnapshot(editor?.getSnapshot());

        // Create a debounced function to update the snapshot
        const debouncedSetSnapshot = debounce((snapshot?: TLEditorSnapshot) => {
            setSnapshot(snapshot);
        }, 50)

        // React to the changes of the snapshot
        const unlisten = editor?.store.listen((event) => {
            debouncedSetSnapshot(editor?.getSnapshot());
        },{ scope: 'document', source: 'all' });

        return () => {
            unlisten?.();
        }

    }, [editor]);



    return (
        <TLEditorContext.Provider value={{ editor, setEditor, snapshot }}>
            {children}
        </TLEditorContext.Provider>
    );
}

/**
 * This hook is used to expose the TLdraw [Editor](https://tldraw.dev/docs/editor) **outside** of the TLdraw component.
 * 
 * Out of the box, the editor is only accessible by TLdraw component's children via the `useEditor` hook.
 * Instead of using `useEditor` in a child component, you can use `useTLEditor` where it is accessible.
 * `useTLEditor` is used in the same way as `useEditor` and exposes the same methods and properties.
 * For consistency, I recommend using `useTLEditor` instead of `useEditor` in the whole app.
 * @example
 * const { editor } = useTLEditor();
 * editor.createPage({ name: 'New page' });
 */
export function useTLEditor() {
    const context = useContext(TLEditorContext);
    return context;
}