import { DndContext } from "@dnd-kit/core";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { forwardRef, HTMLAttributes, CSSProperties } from 'react';


export function Sortable (props: {children: React.ReactNode, id: string, items: any[]}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({ id: props.id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition: transition || undefined,
    };

    return (
		<DndContext>
		<SortableContext items={props.items}>
			<Item
				ref={setNodeRef}
				style={style}
				{...props}
				{...attributes}
				{...listeners}
			>{props.children}</Item>

		</SortableContext>
		</DndContext>


    );
};

export type ItemProps = HTMLAttributes<HTMLDivElement> & {
    id: string;
    isDragging?: boolean;
};

const Item = forwardRef<HTMLDivElement, ItemProps>(({ id, isDragging, style, ...props }, ref) => {
    const styles: CSSProperties = {
        cursor: isDragging ? 'grabbing' : 'grab',
        transform: isDragging ? 'scale(1.05)' : 'scale(1)',
        ...style,
    };

    return <div ref={ref} style={styles} {...props}>{props.children}</div>;
});