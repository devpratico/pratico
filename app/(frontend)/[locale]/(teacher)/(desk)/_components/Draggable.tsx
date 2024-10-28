import { useDraggable } from "@dnd-kit/core";
import { Box } from "@radix-ui/themes";

export function Draggable ({children, id}: {children?: React.ReactNode, id: string}) {
	const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: id });
	const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined;

	return (<Box ref={setNodeRef} style={style} {...listeners} {...attributes}>
			{children}
		</Box>);
};