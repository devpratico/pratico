import { useDraggable } from "@dnd-kit/core";
import { useState } from 'react';

export function Draggable({ children, id }: { children?: React.ReactNode; id: string }) {
	const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
	const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined;
	const [isDragging, setIsDragging] = useState(false);

	const handleMouseDown = () => {
		setIsDragging(true);
		const handleMouseUp = () => {
			setIsDragging(false);
			document.removeEventListener('mouseup', handleMouseUp);
		};
		document.addEventListener('mouseup', handleMouseUp);
	}

	return (
		<div
			ref={setNodeRef}
			style={style}
			onMouseDown={handleMouseDown}
			{...(isDragging ? listeners : {})}
			{...attributes}
		>
			{children}
		</div>
	);
};
