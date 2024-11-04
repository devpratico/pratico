import { useDroppable } from "@dnd-kit/core";

export function Droppable ({children, id}: {children?: React.ReactNode, id: string}) {
	const { isOver, setNodeRef } = useDroppable({id: id});

	return (<div ref={setNodeRef}>
		{children}
	</div>);
};