// https://docs.dndkit.com/presets/sortable

'use client';
import { DndContext, DragEndEvent, DragStartEvent, closestCenter, rectIntersection, DragOverlay, DragOverEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove, verticalListSortingStrategy, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Flex, FlexProps } from '@radix-ui/themes';
import React, { useState, createContext, useContext, useMemo, useCallback, useEffect } from 'react';
import { useId } from 'react';



const DnDItemContext = createContext<{id: string} | undefined>(undefined);
const DragOverlayContext = createContext<boolean>(false);


export function DnDItem({id, children}: {id: string, children: React.ReactNode}) {
    const { active, attributes, setNodeRef, transform, transition } = useSortable({ id });

    const dndStyle = {
        transform: CSS.Transform.toString(transform),
        transition: transition,
    };

    const validChildren = React.Children.toArray(children).filter(
        (child): child is React.ReactElement<{ id: string }> => React.isValidElement(child)
    );

    const NormalItem  = validChildren.find(child => child.type === DnDItemNormal);
    const ActiveItem  = validChildren.find(child => child.type === DnDItemActive);
    //const OverlayItem = validChildren.find(child => child.type === DnDItemOverlay);

    const isActive = active?.id == id;

    return (
        <div ref={setNodeRef} style={dndStyle} {...attributes} key={id}>
            <DnDItemContext.Provider value={{id}}> 
                { isActive ? ActiveItem : NormalItem }
            </DnDItemContext.Provider>
        </div>
    )
}


export function DnDItemNormal({children}: {children: JSX.Element}) {
    return children;
}


export function DnDItemActive({children}: {children: JSX.Element}) {
    return children;
}


export function DnDItemOverlay({children}: {children: React.ReactNode}) {
    return (
        <DragOverlayContext.Provider value={true}>
            {children}
        </DragOverlayContext.Provider>
    );
}


export function DnDGrabHandle({children}: {children: JSX.Element}) {
    const isDragging = useContext(DragOverlayContext);
    const context = useContext(DnDItemContext);
    
    //if (!context) throw new Error('DnDGrabHandle must be a child of DnDItem');

    const { listeners, setActivatorNodeRef } = useSortable({ id: context?.id || '' });

    if (!context || isDragging) {
        return (
            <div style={{cursor:'grabbing'}}>
                {children}
            </div>
        )
    }

    const child = React.Children.only(children);

    //const existingStyle: React.CSSProperties = child.props.style || {};
    //const style: React.CSSProperties = { ...existingStyle, cursor: isDragging ? 'grabbing' : 'grab' };
    const dndStyle = { cursor: 'grab' };

    //return React.cloneElement(child, {ref: setActivatorNodeRef, style, ...listeners})
    return (
        <div ref={setActivatorNodeRef} style={dndStyle} {...listeners}>
            {children}
        </div>
    )
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
        setActiveId(event.active.id.toString());
    }, []);


    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;

        setActiveId(null);

        if (active.id !== over.id) {
            setItemsIds((itemsIds) => {
                const oldIndex = itemsIds.indexOf(active.id.toString());
                const newIndex = itemsIds.indexOf(over.id.toString());

                return arrayMove(itemsIds, oldIndex, newIndex);
            });
        }
    }, [setItemsIds]);


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
            collisionDetection={rectIntersection} // {closestCenter}
            onDragEnd={handleDragEnd}
            id={flexId}
            onDragStart={handleDragStart}
        >
            <SortableContext
                items={itemsIds}
                id={sortableId}
                strategy={strategy}
            >
                <Flex {...flexProps}>
                    {
                        itemsIds.map((id, index) => {
                            const elt = validChildren.find((child) => child.props.id == id) || <p>Error</p>;
                            const clonedElt = React.cloneElement(elt, { key: `${id}-${index}` });
                            return clonedElt
                        })
                    }
                </Flex>
            </SortableContext>

            <DragOverlay>
                <OverlayElt />
            </DragOverlay>
        </DndContext>
    );
}