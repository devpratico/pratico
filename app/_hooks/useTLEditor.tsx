'use client'
import { Editor } from 'tldraw';
import { createContext, useContext, useState } from 'react';


type TLEditorContextType = {
    editor: Editor | undefined; // There is no editor until tldraw is ready
    setEditor: (editor: Editor) => void;
};


const TLEditorContext = createContext<TLEditorContextType | undefined>(undefined);


export function TLEditorProvider({ children }: { children: React.ReactNode }) {

    const [editor, setEditor] = useState<Editor | undefined>(undefined);

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