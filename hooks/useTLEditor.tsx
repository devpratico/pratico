'use client'
import { Editor, TldrawEditor, createTLStore } from '@tldraw/tldraw';
import { createContext, useContext, useState } from 'react';


type TLEditorContextType = {
    editor: Editor;
    setEditor: (editor: Editor) => void;
};


const TLEditorContext = createContext<TLEditorContextType | undefined>(undefined);


export function TLEditorProvider({ children }: { children: React.ReactNode }) {

    // TODO: Maybe there's a better way to create a blank editor
    const blankEditor = new Editor({
        store: createTLStore({}),
        shapeUtils: [],
        tools: [],
        getContainer: () => document.createElement('div'),
    })

    const [editor, setEditor] = useState<Editor>(blankEditor);

    return (
        <TLEditorContext.Provider value={{ editor, setEditor }}>
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
    if (!context) throw new Error('useTLEditor must be used within a TLEditorProvider');
    return context;
}