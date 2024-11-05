// https://docs.dndkit.com/presets/sortable

'use client';
import { DndContext, DragEndEvent, DragStartEvent, closestCenter, DragOverlay, DraggableAttributes } from '@dnd-kit/core';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { SortableContext, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Flex, FlexProps } from '@radix-ui/themes';
import React, { useState } from 'react';

/*
interface SortableItemProps {
    id: string
    children: React.JSX.Element
}

function SortableItem({ id, children }: SortableItemProps) {
    const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition } = useSortable({ id });
    const style = {
        transform: CSS.Translate.toString(transform),
        transition: transition,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {children}
        </div>
    );
}*/


export interface DnDItemRendererArgs {
    variant:
        | 'normal'  // default
        | 'active'  // the item as it stays in the list while being dragged
        | 'overlay' // the item you grab and move around

    /** Append this style to the main node. It will handle drag position */
    dndStyle: React.CSSProperties

    /** Set this to the main node ref prop */
    setNodeRef: (node: HTMLElement | null) => void

    /** Set this to the drag handler node ref prop, if you wish to have a drag handle instead of the whole node */
    setActivatorNodeRef?: (node: HTMLElement | null) => void

    /** Set this to the main node props */
    attributes: DraggableAttributes | undefined

    /** Set this to the drag handler node props, or to the main node props */
    listeners: SyntheticListenerMap | undefined
}


interface Item {
    id: string
    renderer: (args: DnDItemRendererArgs) => JSX.Element
}


function SortableItem({ id, renderer, isActive }: Item & { isActive: boolean }) {
    const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition } = useSortable({ id });
    const _style = { transform: CSS.Translate.toString(transform), transition: transition };

    return renderer({
        variant: isActive ? 'active' : 'normal',
        dndStyle: _style,
        setNodeRef,
        setActivatorNodeRef,
        attributes,
        listeners
    });
}

function OverlayItem({ renderer }: { renderer: Item['renderer'] }) {
    return renderer({
        variant: 'overlay',
        dndStyle: {},
        setNodeRef: () => {},
        setActivatorNodeRef: () => {},
        attributes: undefined,
        listeners: undefined
    });
}







/*
type DndSortableProps = FlexProps & {
    ids: string[]
    itemFactory: (id: string) => {
        normal: React.JSX.Element
        active: React.JSX.Element
        overlay: React.JSX.Element
    }
}*/

type DndSortableProps = FlexProps & {
    items: Item[]
}



export function DndSortableFlex({ items, ...flexProps }: DndSortableProps) {
    const [itemsIds, setItemsIds] = useState<string[]>(() => items.map(item => item.id));
    const [activeId, setActiveId] = useState<string | null>(null);

    function handleDragStart(event: DragStartEvent) {
        setActiveId(event.active.id.toString());
    }

    function handleDragEnd(event: DragEndEvent) {
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
    }

    return (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} onDragStart={handleDragStart}>

            <SortableContext items={itemsIds}>
                <Flex {...flexProps}>
                    {items.map(({ id, renderer }) => (

                        /*<SortableItem key={id} id={id} >
                            {itemFactory(id)[activeId === id ? 'active' : 'normal']}
                        </SortableItem>*/

                        <SortableItem
                            key={id}
                            id={id}
                            isActive={activeId == id}
                            renderer={renderer}
                        />

                    ))}
                </Flex>
            </SortableContext>

            <DragOverlay>
                { activeId ? <OverlayItem renderer={items.find(item => item.id == activeId)!.renderer} /> : null }
            </DragOverlay>

        </DndContext>
    )
}



// { activeId ?  itemFactory(activeId).overlay : null }