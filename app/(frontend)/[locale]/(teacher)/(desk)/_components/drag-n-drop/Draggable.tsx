import { useDraggable } from "@dnd-kit/core";

export function Draggable({ children, id, isDragging }: { children?: React.ReactNode; id: string, isDragging: boolean }) {
	const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
	const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`} : undefined;

	return (
		<div ref={setNodeRef} style={style} {...(isDragging ? listeners : {})} {...attributes}>
			{children}
		</div>
	);
};
