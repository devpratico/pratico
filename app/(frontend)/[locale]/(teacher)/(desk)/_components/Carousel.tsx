'use client'
import Thumbnail from '@/app/(frontend)/[locale]/_components/Thumbnail'
import { useNav } from '@/app/(frontend)/_hooks/useNav'
import { Card, Flex, ScrollArea, DropdownMenu, IconButton, Box } from '@radix-ui/themes'
import { Ellipsis, Trash2, Copy } from 'lucide-react'
import { TLPageId } from 'tldraw'
import { useState, useEffect, useMemo, useCallback, memo, useRef } from 'react'
import { SnapshotProvider } from '@/app/(frontend)/_hooks/useSnapshot'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, MouseSensor, pointerWithin, TouchSensor, useSensor, useSensors, AutoScrollActivator, Over  } from '@dnd-kit/core';
import { DragMoveEvent } from '@dnd-kit/core/dist/types'
import { Droppable } from './drag-n-drop/Droppable'
import { Draggable } from './drag-n-drop/Draggable'
import { FocusZone, useFocusZone } from '@/app/(frontend)/_hooks/useFocusZone'
import useKeyboardShortcuts, { KeyboardShortcutType } from '@/app/(frontend)/_hooks/useKeyboardShortcuts'

interface MiniatureProps {
    pageId: TLPageId
    onClick: () => void
	isGrabbing: boolean
	isActiveZone: boolean
}

const MemoizedThumbnail = memo(Thumbnail)
const MemoizedMiniature = memo(Miniature)

export default function Carousel() {
    const { pageIds, setCurrentPage, currentPageId, movePage } = useNav()
	const [ activeId, setActiveId ] = useState<TLPageId | undefined>();
	const [ isGrabbing, setIsGrabbing ] = useState(false);
	const sensors = useSensors(useSensor(MouseSensor, {activationConstraint: {distance: 10}}), useSensor(TouchSensor));
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
	const [ nearestPage, setNearestPage ] = useState<Over>();
	const [ indicatorPosition, setIndicatorPosition ] = useState<number | null>(null);
	const { activeZone } = useFocusZone();
	const [ isActiveZone, setIsActiveZone ] = useState(activeZone === "focusZoneCarrousel");
	const { goPrevPage, goNextPage } = useNav();
	const shortcuts: KeyboardShortcutType = {
		"focusZoneCarrousel": {
			"ArrowLeft": () => goPrevPage(),
			"ArrowRight": () => goNextPage()
		}
	};
	useKeyboardShortcuts(shortcuts);

	const handleDragStart = (e: DragStartEvent) => {
		if (!isGrabbing)
			setIsGrabbing(true);
		
		setCurrentPage(e.active.id as TLPageId);
		setActiveId(e.active.id as TLPageId);
	};

	const handleDragMove = (e: DragMoveEvent) => {
		if (e.over)
		{
			setNearestPage(e.over);
			if (nearestPage && nearestPage?.rect.left < e.over.rect.left)
				setIndicatorPosition(e.over.rect.right);
			else if (nearestPage && nearestPage?.rect.right > e.over.rect.right)
				setIndicatorPosition(e.over.rect.left);

		}
	}

	const handleDragEnd = (e: DragEndEvent) => {
		setActiveId(undefined);

		if (e.over?.id && e.over?.id !== e.active.id)
			movePage(e.over?.id as TLPageId);
		else if (nearestPage && nearestPage.id)
			movePage(nearestPage.id as TLPageId);
		setIndicatorPosition(null);
		if (isGrabbing)
			setIsGrabbing(false);
	};

    useEffect(() => {
        const currentThumbnail = document.getElementById(`${currentPageId}-id`);
    	const scrollContainer = scrollContainerRef.current;

		if (currentThumbnail && scrollContainer) {
            const thumbnailRect = currentThumbnail.getBoundingClientRect();
            const containerRect = scrollContainer.getBoundingClientRect();
            const margin = 20;
    
			if (thumbnailRect.left < containerRect.left) {
				scrollContainer.scrollBy({
					left: thumbnailRect.left - containerRect.left - margin,
					behavior: 'smooth',
				});
			}
			else if (thumbnailRect.right > containerRect.right) {
				scrollContainer.scrollBy({
					left: thumbnailRect.right - containerRect.right + margin,
					behavior: 'smooth',
				});
			}
        }
    }, [currentPageId, pageIds]);

	useEffect(() => {
		setIsActiveZone(activeZone === "focusZoneCarrousel");
	}, [activeZone]);

    return (
		<DndContext autoScroll={{
				threshold: {
				x: 0.05,
				y: 0.05
				},
				layoutShiftCompensation: false,
				activator: AutoScrollActivator.Pointer,
				enabled: true,
				acceleration: 25,
				interval: 5
			}}
			sensors={sensors}
			collisionDetection={pointerWithin}
			onDragStart={handleDragStart}
			onDragMove={handleDragMove}
			onDragEnd={handleDragEnd}>

		<SnapshotProvider>
			<FocusZone id='focusZoneCarrousel'>

				<Card variant='classic' style={{ padding: '0' }} asChild>
					<ScrollArea ref={scrollContainerRef}>
						<Flex key={JSON.stringify(pageIds)} gap='3' p='3' height='100%' align='center'>
							{pageIds.map((id) => (
								<Draggable key={`draggable-${id}`} id={id} isDragging={true}>
								<Droppable key={`droppable-${id}`} id={id}>
									<MemoizedMiniature
										key={id}
										pageId={id}
										onClick={() => setCurrentPage(id)}
										isGrabbing={isGrabbing}
										isActiveZone={isActiveZone}
									/>
								</Droppable>
								</Draggable>
							))}
							{indicatorPosition !== null && <Indicator position={indicatorPosition} />}
						</Flex>
					</ScrollArea>
				</Card>
				
			</FocusZone>
		</SnapshotProvider>
		<DragOverlay>
			{activeId ? (
				<MemoizedMiniature
					pageId={activeId}
					onClick={() => {}}
					isGrabbing={isGrabbing}
					isActiveZone={isActiveZone}
				/>
			) : null}
			</DragOverlay>
		</DndContext>
    )
}


function Miniature({ pageId, onClick, isGrabbing, isActiveZone }: MiniatureProps) {
    const [showEllipsis, setShowEllipsis] = useState(false)
    const [showMenu, setShowMenu] = useState(false)
    const { currentPageId, nextPageId, prevPageId, goNextPage, goPrevPage, deletePage } = useNav()
	const [ clicked, setClicked ] = useState(isGrabbing)
    const shadow = useMemo(() => {
		if (!isActiveZone && currentPageId === pageId)
			return ('0 0 0 3px var(--gray-6)');
		if (isGrabbing && currentPageId === pageId)
			return ('0 0 0 3px var(--accent-8)');
        return currentPageId == pageId ? '0 0 0 3px var(--accent-10)' : 'var(--shadow-2)'
    }, [currentPageId, pageId, isGrabbing, isActiveZone]);

    const onSelect = useCallback(() => {
        if (currentPageId === pageId) {
            if (nextPageId) { goNextPage() }
            else if (prevPageId) { goPrevPage() }
        }
        deletePage(pageId)
    }, [currentPageId, pageId, nextPageId, prevPageId, goNextPage, goPrevPage, deletePage])

    const ellipsisOpacities = useMemo(() => {
        return showEllipsis ? 1 : 0
    }, [showEllipsis])

    useEffect(() => {
        setShowEllipsis(showMenu)
    }, [showMenu])

    return (
		<Box
			id={`${pageId}-id`}
			position='relative'
			width='55px'
			height='36px'
			onClick={onClick}
			onMouseEnter={() => setShowEllipsis(true)}
			onMouseLeave={() => setShowEllipsis(showMenu)}
			onMouseUp={() => setClicked(false)}
			draggable
		>
			<Box
				style={{
					width: '100%',
					height: '100%',
					overflow: 'hidden',
					borderRadius: 'var(--radius-2)',
					boxShadow: shadow,
					cursor: clicked ? 'grabbing' : 'grab'
				}} 
			>
				<MemoizedThumbnail pageId={pageId}/>
			</Box>

			<DropdownMenu.Root open={showMenu} onOpenChange={setShowMenu}>

				<DropdownMenu.Trigger>
					<IconButton
						radius='full' size='1'
						style={{ position: 'absolute', top: '-10px', right: '-10px', boxShadow: 'var(--shadow-3)', opacity: ellipsisOpacities }}
					>
						<Ellipsis size='18' />
					</IconButton>
				</DropdownMenu.Trigger>

				<DropdownMenu.Content onClick={(e) => e.stopPropagation()}>

					<DropdownMenu.Item onSelect={() => console.log('Duplicate')} disabled={true}>
						<Copy size='15' /> Dupliquer
					</DropdownMenu.Item>

					<DropdownMenu.Item color='red' onSelect={onSelect}>
						<Trash2 size='15' /> Supprimer
					</DropdownMenu.Item>
					
				</DropdownMenu.Content>
					
			</DropdownMenu.Root>	
		</Box>
    )
}

const Indicator = ({ position }: {position: number}) => {
	return (
		<div
			style={{
				position: 'absolute',
				left: position,
				height: '42px',
				width: '5px',
				backgroundColor: 'var(--violet-8)'
			}}
		/>
	);
};