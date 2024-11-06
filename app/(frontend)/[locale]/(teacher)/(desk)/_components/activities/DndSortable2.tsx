// https://docs.dndkit.com/presets/sortable

'use client';
import { DndContext, DragEndEvent, DragStartEvent, closestCenter, rectIntersection, DragOverlay, DragOverEvent } from '@dnd-kit/core';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { SortableContext, useSortable, arrayMove, verticalListSortingStrategy, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Flex, FlexProps } from '@radix-ui/themes';
import React, { useState, createContext, useContext, useMemo, useCallback, useEffect } from 'react';
import { useId } from 'react';


/** Provide the children of DnDItem the item id */
interface ItemContextType {
    id: string
    setActivatorNodeRef: (node: HTMLElement | null) => void
    listeners: SyntheticListenerMap | undefined
}

const ItemContext = createContext<ItemContextType | null>(null);

/** Allow the DnDGrabHandle to notify DnDItemNormal of its presence inside a DnDItemNormal*/
const GrabHandleContext = createContext<(grabHandlePresence: boolean) => void>(() => {});

/** Tell the children they are in a DnDItemNormal */
const DnDItemNormalContext = createContext<boolean>(false);


export function DnDItem({id, children}: {id: string, children: React.ReactNode}) {
    const { active, attributes, setNodeRef, setActivatorNodeRef, listeners, transform, transition } = useSortable({ id });

    const dndStyle = {
        transform: CSS.Transform.toString(transform),
        transition: transition,
    };

    const validChildren = React.Children.toArray(children).filter(
        (child): child is React.ReactElement<{ id: string }> => React.isValidElement(child)
    );

    const NormalItem  = validChildren.find(child => child.type === DnDItemNormal);
    const ActiveItem  = validChildren.find(child => child.type === DnDItemActive);

    const isActive = active?.id == id;

    return (
        <div id={id} ref={setNodeRef} style={dndStyle} {...attributes}>
            <ItemContext.Provider value={{id, setActivatorNodeRef, listeners}}>
                { isActive ? ActiveItem : NormalItem }
            </ItemContext.Provider>
        </div>
    )
}


export function DnDItemNormal({children}: {children: JSX.Element}) {
    const [hasGrabHandle, setHasGrabHandle] = useState(false);
    const itemContext = useContext(ItemContext);

    if (!itemContext) return <p>Item normal outside Item</p>

    // If there is a grab handle, the listeners will be attached to it.
    // If not, this item will serve as the grab handle
    const _listeners        = hasGrabHandle ? {} : itemContext.listeners;
    const _activatorNodeRef = hasGrabHandle ? undefined : itemContext.setActivatorNodeRef;

    const dndStyle = hasGrabHandle ? {} : { cursor: 'grab' }

    return (
        <GrabHandleContext.Provider value={setHasGrabHandle}>
            <DnDItemNormalContext.Provider value={true}>                
                <div {..._listeners} ref={_activatorNodeRef} style={dndStyle}>
                    {children}
                </div>
            </DnDItemNormalContext.Provider>
        </GrabHandleContext.Provider>
    )
}


export function DnDItemActive({children}: {children: JSX.Element}) {
    //const existingStyle: React.CSSProperties = children.props.style || {};
    //const style: React.CSSProperties = { ...existingStyle, cursor: 'grabbing !important' };
    const dndStyle = { cursor: 'grabbing' };

    return (
        <div style={dndStyle}>
            {children}
        </div>
    )
}


export function DnDItemOverlay({children}: {children: JSX.Element}) {
    //const existingStyle: React.CSSProperties = children.props.style || {};
    //const style: React.CSSProperties = { ...existingStyle, cursor: 'grabbing !important', color:'red' };
    const dndStyle = { cursor: 'grabbing', color: 'red' };
    return (
        <div style={dndStyle}>
            {children}
        </div>
    );
}


function DnDGrabHandleNormal({children}: {children: JSX.Element}) {
    const itemContext = useContext(ItemContext);
    const setHasGrabHandle = useContext(GrabHandleContext);

    // Notify its parent DnDItemNormal that it does have a grab handle
    useEffect(() => {
        setHasGrabHandle(true);
        return () => setHasGrabHandle(false);
    }, [setHasGrabHandle]);


    //const existingStyle: React.CSSProperties = child.props.style || {};
    //const style: React.CSSProperties = { ...existingStyle, cursor: isDragging ? 'grabbing' : 'grab' };
    const dndStyle = { cursor: 'grab' };


    return (
        <div ref={itemContext?.setActivatorNodeRef} {...itemContext?.listeners} style={dndStyle}>
            {children}
        </div>
    )
}


export function DnDGrabHandle({children}: {children: JSX.Element}) {
    const isInDnDItemNormal = useContext(DnDItemNormalContext);

    if (isInDnDItemNormal) return <DnDGrabHandleNormal>{children}</DnDGrabHandleNormal>;

    // If not in a normal item, just render the element as is. No need for listeners etc.
    return children;
}




export function DnDFlex({children, ...flexProps}: {children: React.ReactNode} & FlexProps) {
    // Normalize children to an array and filter to only include <DnDItem> elements
    /*const validChildren = useMemo(() => {

        const array = React.Children.toArray(children)
        const validChildren = array.filter((child): child is React.ReactElement<{ id: string }> =>
            React.isValidElement(child) && child.type === DnDItem
        )

        return validChildren
    },[children]);*/
    const validChildren = React.Children.toArray(children).filter(
        (child): child is React.ReactElement<{ id: string }> => React.isValidElement(child) && child.type === DnDItem
    );

    const initialIds = useMemo(() => validChildren.map(child => child.props.id), [validChildren]);
    const [itemsIds, setItemsIds] = useState<string[]>(initialIds);
    const [activeId, setActiveId] = useState<string | null>(null);

    const flexId = useId();
    const sortableId = useId();

    const handleDragStart = useCallback((event: DragStartEvent) => {
        console.log('Drag start', event.active.id);
        setActiveId(event.active.id.toString());
    }, []);


    const handleDragEnd = useCallback((event: DragEndEvent) => {
        setActiveId(null);
        const { active, over } = event;

        console.log('Drag end over:', over?.id);
        if (!over) {
            setItemsIds((itemsIds) => [...itemsIds]);
            return;
        }

        if (active.id !== over.id) {
            setItemsIds((itemsIds) => {
                const oldIndex = itemsIds.indexOf(active.id.toString());
                const newIndex = itemsIds.indexOf(over.id.toString());
                return arrayMove(itemsIds, oldIndex, newIndex);
            });
        }
    }, [setItemsIds]);

    const handleDragCancel = useCallback(() => {
        console.log('Drag cancel');
        setActiveId(null); // Reset active ID on cancel
    }, []);


    const OverlayElt = () => {
        const activeElt = validChildren.find(child => child.props.id == activeId) as React.ReactElement<{ id: string, children: React.ReactNode }> | null;
        if (!activeElt) return null;

        const overlayElt = React.Children.toArray(activeElt.props.children).find((child): child is React.ReactElement => 
            React.isValidElement(child) && child.type === DnDItemOverlay
        ) || null;

        return overlayElt;
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
                <Flex {...flexProps}>
                    {
                        itemsIds.map((id, index) => {
                            const elt = validChildren.find((child) => child.props.id == id) || <p>{`No ${id}`}</p>;
                            const clonedElt = React.cloneElement(elt, { key: `${id}-${index}` });
                            return clonedElt
                        })
                    }
                </Flex>
            </SortableContext>

            {/*<DragOverlay>
                <OverlayElt />
                <p>Overlay</p>
            </DragOverlay>*/}
        </DndContext>
    );
}