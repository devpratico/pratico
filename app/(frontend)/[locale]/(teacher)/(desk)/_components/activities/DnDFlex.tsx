// https://docs.dndkit.com/presets/sortable

'use client';
import { DndContext, DragEndEvent, DragStartEvent, closestCenter, rectIntersection, DragOverlay, DragOverEvent } from '@dnd-kit/core';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { SortableContext, useSortable, arrayMove, verticalListSortingStrategy, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Flex as RadixFlex, FlexProps } from '@radix-ui/themes';
import React, { useState, createContext, useContext, useMemo, useCallback, useEffect } from 'react';
import { useId } from 'react';


/*
 These are utility components to help you build a sortable list with drag and drop.
 Example usage:
 ```
 <DnDFlex direction="column" gap="3">
    <DnDItem id="item-1">
        //... your content
    </DnDItem>
    <DnDItem id="item-2">
        //... your content
    </DnDItem>
 </DnDFlex>
 ```
 
 If you want to have a grab handle, instead of the whole item being draggable, you can use the `DnDGrabHandle` component.
 It must be within a `DnDItemNormal` component.
 ```
<DnDItem id="item-1">
    <DnDItemNormal>
        <Flex>
            <Text>Normal 1</Text>
            <DnDGrabHandle>
                <Text>Grab me</Text>
            </DnDGrabHandle>
        </Flex>
    </DnDItemNormal>
</DnDItem>
```

If you want to use different components for the active and overlay states, you can use `DnDItemActive` and `DnDItemOverlay` components
to wrap the content you want to show in those states.

```
<DnDItem id="item-1">
    <DnDItemNormal>
        // Normal look
    </DnDItemNormal>
    <DnDItemActive>
        // Active look
    </DnDItemActive>
    <DnDItemOverlay>
        // Overlay look
    </DnDItemOverlay>
</DnDItem>
```
 */



/** Provide the children of DnDItem some useful stuff */
interface ItemContextType {
    id: string
    setActivatorNodeRef: (node: HTMLElement | null) => void
    listeners: SyntheticListenerMap | undefined
    isActive: boolean
}

const ItemContext = createContext<ItemContextType | null>(null);

/** Allow the DnDGrabHandle to notify DnDItemNormal of its presence inside a DnDItemNormal*/
const GrabHandleContext = createContext<(grabHandlePresence: boolean) => void>(() => {});

/** Tell the children they are in a DnDItemNormal */
const DnDItemNormalContext = createContext<boolean>(false);


function Item({id, children}: {id: string, children: React.ReactNode}) {
    const { active, attributes, setNodeRef, setActivatorNodeRef, listeners, transform, transition } = useSortable({ id });

    const dndStyle = {
        transform: CSS.Transform.toString(transform),
        transition: transition,
    };

    const validChildren = React.Children.toArray(children).filter(
        (child): child is React.ReactElement<{ id: string }> => React.isValidElement(child)
    );

    const NormalItem  = () => validChildren.find(child => child.type === Normal) || validChildren[0];
    const ActiveItem  = () => validChildren.find(child => child.type === Active) || <div style={{opacity: 0}}><NormalItem /></div>;

    const isActive = active?.id == id;

    return (
        <div id={id} ref={setNodeRef} style={dndStyle} {...attributes}>
            <ItemContext.Provider value={{id, setActivatorNodeRef, listeners, isActive}}>
                { isActive ? <ActiveItem/> : <NormalItem/> }
            </ItemContext.Provider>
        </div>
    )
}


function Normal({children}: {children: JSX.Element}) {
    const [hasGrabHandle, setHasGrabHandle] = useState(false);
    const itemContext = useContext(ItemContext);

    if (!itemContext) return <p>Item normal outside Item</p>

    // If there is a grab handle, the listeners will be attached to it.
    // If not, this item will serve as the grab handle
    const _listeners        = hasGrabHandle ? {} : itemContext.listeners;
    const _activatorNodeRef = hasGrabHandle ? undefined : itemContext.setActivatorNodeRef;

    return (
        <GrabHandleContext.Provider value={setHasGrabHandle}>
            <DnDItemNormalContext.Provider value={true}>                
                <div ref={_activatorNodeRef} {..._listeners}>
                    {children}
                </div>
            </DnDItemNormalContext.Provider>
        </GrabHandleContext.Provider>
    )
}


function Active({children}: {children: JSX.Element}) {
    return children
}


function Overlay({children}: {children: JSX.Element}) {
    return children
}

/** Adds the grabbing interactive behavior to the child */
function InteractiveGrabHandle({children}: {children: JSX.Element}) {
    const itemContext = useContext(ItemContext);
    const setHasGrabHandle = useContext(GrabHandleContext);

    // Notify its parent DnDItemNormal that it does have a grab handle
    useEffect(() => {
        setHasGrabHandle(true);
    }, [setHasGrabHandle]);

    return (
        <RadixFlex
            align='center'
            justify='center'
            ref={itemContext?.setActivatorNodeRef}
            {...itemContext?.listeners}
        >
            {children}
        </RadixFlex>
    )
}


function GrabHandle({children}: {children: JSX.Element}) {
    const isInDnDItemNormal = useContext(DnDItemNormalContext);
    // No need for interactive behavior elsewhere than in a DnDItemNormal
    return isInDnDItemNormal ? <InteractiveGrabHandle>{children}</InteractiveGrabHandle> : children
}


type DnDFlexProps = FlexProps & {
    children: React.ReactNode
    onReorder?: (newOrder: string[]) => void
}


function Flex({children, onReorder, ...flexProps}: DnDFlexProps) {
    // Normalize children to an array and filter to only include <DnDItem> elements
    const validChildren = React.Children.toArray(children).filter(
        (child): child is React.ReactElement<{ id: string }> => React.isValidElement(child) && child.type === Item
    );

    const initialIds = useMemo(() => validChildren.map(child => child.props.id), [validChildren]);
    const [itemsIds, setItemsIds] = useState<string[]>(initialIds);
    const [activeId, setActiveId] = useState<string | null>(null);

    const flexId = useId();
    const sortableId = useId();

    const handleDragStart = useCallback((event: DragStartEvent) => {
        setActiveId(event.active.id.toString());
    }, []);


    const handleDragEnd = useCallback((event: DragEndEvent) => {
        setActiveId(null);
        const { active, over } = event;

        if (!over) {
            setItemsIds((itemsIds) => [...itemsIds]);
            return;
        }

        if (active.id !== over.id) {
            setItemsIds((itemsIds) => {
                const oldIndex = itemsIds.indexOf(active.id.toString());
                const newIndex = itemsIds.indexOf(over.id.toString());
                const newArray = arrayMove(itemsIds, oldIndex, newIndex);
                onReorder?.([...newArray]);
                return newArray;
            });
        }
    }, [setItemsIds, onReorder]);

    const handleDragCancel = useCallback(() => {
        setActiveId(null);
    }, []);


    const OverlayElt = () => {
        const activeElt = validChildren.find(child => child.props.id == activeId) as React.ReactElement<{ id: string, children: React.ReactNode }> | null;
        if (!activeElt) return null;

        const overlayElt = React.Children.toArray(activeElt.props.children).find((child): child is React.ReactElement => 
            React.isValidElement(child) && child.type === Overlay
        ) || null;

        if (!overlayElt) return null;

        return (
            <DragOverlay>
                {overlayElt}
            </DragOverlay>
        )
    }

    const strategy = flexProps.direction === 'column' ? verticalListSortingStrategy : horizontalListSortingStrategy;


    return (
        <DndContext
            id={flexId}
            collisionDetection={rectIntersection} // {closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
        >
            <SortableContext
                items={itemsIds}
                id={sortableId}
                strategy={strategy}
            >
                <RadixFlex {...flexProps}>
                    {
                        itemsIds.map((id, index) => {
                            const elt = validChildren.find((child) => child.props.id == id) || <p>{`No ${id}`}</p>;
                            const clonedElt = React.cloneElement(elt, { key: `${id}-${index}` });
                            return clonedElt
                        })
                    }
                </RadixFlex>
            </SortableContext>


            <OverlayElt />

        </DndContext>
    );
}


const DnD = {
    Flex,
    Item,
    Normal,
    Active,
    Overlay,
    GrabHandle
}

export default DnD;