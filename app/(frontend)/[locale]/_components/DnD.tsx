// https://docs.dndkit.com/presets/sortable

'use client';
import { DndContext, DragEndEvent, DragStartEvent, closestCenter, DragOverlay } from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Flex, Card } from '@radix-ui/themes';
import React, { useState } from 'react';


interface ItemProps {
    id: string
    state: 'default' | 'dragging' | 'slot'
}

function Item({ id, state }: ItemProps) {
    const shadow = state === 'dragging' ? 'var(--shadow-4)' : undefined;
    const opacity = state === 'slot' ? 0.2 : undefined;
    const transformations = 'scale(1.07)'; //rotate(-1deg) 
    const transform = state === 'dragging' ? transformations : undefined;

    const _style: React.CSSProperties = {
        boxShadow: shadow,
        outline: 'none',
        opacity: opacity,
        width: '200px',
        height: '100px',
        transform: transform,
    }

    return (
        <Card variant='classic' style={_style}>
            {id}
        </Card>
    )
}


interface SortableItemProps {
    id: string
    isActive: boolean
}


function SortableItem({ id, isActive }: SortableItemProps) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const style = {
        transform: CSS.Translate.toString(transform),
        transition: transition,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Item id={id} state={isActive ? 'slot' : 'default'} />
        </div>
    );
}

function OverlayItem({ id }: { id: string }) {
    return (
        <Item id={id} state='dragging' />
    )
}




function DndCarousel() {
    const [itemsIds, setItemsIds] = useState<string[]>(['1', '2', '3', '4', '5']);
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
                <Flex gap='2' p='2'>
                    {itemsIds.map((id) => (
                        <SortableItem key={id} id={id} isActive={activeId === id} />
                    ))}
                </Flex>
            </SortableContext>

            <DragOverlay>
                {activeId ? <OverlayItem id={activeId} /> : null}
            </DragOverlay>

        </DndContext>
    )
}


export default function PlayGround() {
    //if (process.env.NODE_ENV === 'production') return (null);

    return (
        <DndCarousel />
    )
};