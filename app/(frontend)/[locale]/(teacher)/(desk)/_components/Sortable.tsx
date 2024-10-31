import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function Sortable ({children, id}: {children: React.ReactNode, id: string}) {
    const {
        isDragging,
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({ id: id });

    const style = {
		transform: CSS.Transform.toString(transform),
        cursor: isDragging ? 'grabbing' : 'grab',
        // transition: transition || undefined,
	};

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
        >{children}</div>
    );
};