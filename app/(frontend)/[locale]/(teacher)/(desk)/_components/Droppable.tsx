import { useDroppable } from "@dnd-kit/core";

export function Droppable ({children, id}: {children?: React.ReactNode, id: string}) {
	const { isOver, setNodeRef } = useDroppable({id: id});
	const style = { backgroundColor: isOver ? 'var(--gray-5)' : undefined};

	return (<div ref={setNodeRef} style={style}>
		{children}
	</div>);
};