# useEditor()


## Généralités

Tldraw met à disposition un hook permettant d'accéder à l'état de tldraw, ainsi qu'agir dessus.
Tous les composants enfants du composant principal `<Tldraw>...</Tldraw>` ont accès à ce hook.
Il est donc utilisé par exemple pour la toolbar (qui va écouter quels outils sont actifs, sélectionner des outils et des couleurs par exemple), ou la slidebar (qui va écouter quelle page est active, et la changer).


## Utilisation
Attention, ce hook n'utilise pas le pattern classique de React. En effet, lorsque l'état de tldraw change (par exemple, un nouvel outil est sélectionné, ou un nouveau participant est ajouté), le composant utilisant le hook ne sera pas re-rendu (pour des raisons de performance).
Il faut donc manuellement "tracker" quels propriétés nous intéressent.


### Dans un composant

Il suffit de wrapper le composant dans `track` (fourni par tldraw), pour que le composant soit re-rendu lorsqu'une propriété qui nous intéresse change.

```tsx
import { useEditor, track } from 'tldraw';

const monComposant = track(() => {
  const editor = useEditor();

  // Grâce à `track`, le composant sera re-rendu à chaque fois que activeTool change
  // Il ne sera pas re-rendu si une autre propriété de editor change,
  // ce qui permet de meilleures performances.
  const activeTool = editor.activeTool;

  return <div>{activeTool}</div>;
});
```


### Dans un hook

Pour créer un *custom hook* utilisant `useEditor`, on ne peut pas utiliser `track`.
On va utiliser `computed` pour récupérer de façon réactive la propriété qui nous intéresse, ainsi que `react` pour réagir lorsqu'elle change.

```tsx
import { useState, useEffect } from 'react';
import { useEditor, computed, react, Tool } from 'tldraw';

export function useActiveTool() {
    const editor = useEditor();
    const [activeTool, setActiveTool] = useState<Tool>(editor.activeTool);

    useEffect(() => {
        // `computed` permet de récupérer de façon réactive la propriété qui nous intéresse
        const activeToolSignal = computed<Tool>(() => editor.activeTool);

        // `react` permet de réagir lorsqu'elle change
        // elle renvoit une fonction de cleanup, à appeler lorsqu'on ne veut plus réagir
        const cleanup = react('when activeTool changes', () => {
            setActiveTool(activeToolSignal.get());
        });

        // La fonction cleanup du useEffect
        return cleanup;
    }, [editor]);

    return activeTool;
}
```

