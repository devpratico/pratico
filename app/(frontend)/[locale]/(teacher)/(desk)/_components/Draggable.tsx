import { useDraggable } from "@dnd-kit/core";
import { useRef, useState } from 'react';

export function Draggable({ children, id }: { children?: React.ReactNode; id: string }) {
	const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
	const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined;

	const [isDragging, setIsDragging] = useState(false);
	const isDraggingRef = useRef(false);

	const handleMouseDown = () => {
		isDraggingRef.current = false;

		const handleMouseMove = () => {
			isDraggingRef.current = true;
			setIsDragging(true);
			document.removeEventListener('mousemove', handleMouseMove);
		};

		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', () => {
			setIsDragging(false);
			document.removeEventListener('mousemove', handleMouseMove);
		});
	};

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
