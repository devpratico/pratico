'use client'
import Thumbnail from '@/app/(frontend)/[locale]/_components/Thumbnail'
import { useNav } from '@/app/(frontend)/_hooks/useNav'
import { Card, Flex, ScrollArea, DropdownMenu, IconButton, Box } from '@radix-ui/themes'
import { Ellipsis, Trash2, Copy } from 'lucide-react'
import { TLPageId } from 'tldraw'
import { useState, useEffect, useMemo, useCallback, memo } from 'react'
import { SnapshotProvider } from '@/app/(frontend)/_hooks/useSnapshot'
import { DndContext, DragEndEvent, DragMoveEvent, DragOverEvent, DragOverlay, DragStartEvent, UniqueIdentifier } from '@dnd-kit/core';
import { Draggable } from './Draggable'
import { Droppable } from './Droppable'

interface MiniatureProps {
    pageId: TLPageId
    onClick: () => void
}

const MemoizedThumbnail = memo(Thumbnail)
const MemoizedMiniature = memo(Miniature)

export default function Carousel() {
    const { pageIds, setCurrentPage, currentPageId, movePage } = useNav()
	const [ activeId, setActiveId ] = useState<TLPageId | undefined>();

	const handleDragStart = (e: DragStartEvent) => {
		setActiveId(currentPageId);
		console.log("EVENT dragStart", e);

	}

	const handleDragOver = (e: DragOverEvent) => {
		console.log("EVENT dragOver", e);

	};

	const handleDragEnd = (e: DragEndEvent) => {
		setActiveId(undefined);
		console.log("EVENT", e);
		movePage(e.over?.id as TLPageId);
	}


    useEffect(() => {
        const currentThumbnail = document.getElementById(`${currentPageId}-id`);
        const scrollContainer = currentThumbnail?.parentElement?.parentElement?.parentElement;

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


    return (
		<DndContext onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>

        <SnapshotProvider>
            <Card variant='classic' style={{ padding: '0' }} asChild>
                <ScrollArea>
                    <Flex key={JSON.stringify(pageIds)} gap='3' p='3' height='100%' align='center'>
                        {pageIds.map((id, index) => (
							<Draggable key={id} id={id}>
							<Droppable key={id} id={id}>
								<MemoizedMiniature
									key={`${id}`}
									pageId={id}
									onClick={() => setCurrentPage(id)}
								/>
							</Droppable>
							</Draggable>
                        ))}
                    </Flex>
                </ScrollArea>
            </Card>
        </SnapshotProvider>
		<DragOverlay>
			{activeId ? (
				<MemoizedMiniature
					pageId={activeId}
					onClick={() => {}}
				/>
			) : null}
            </DragOverlay>
		</DndContext>
    )
}


function Miniature({ pageId, onClick }: MiniatureProps) {
    const [showEllipsis, setShowEllipsis] = useState(false)
    const [showMenu, setShowMenu] = useState(false)
    const { currentPageId, nextPageId, prevPageId, goNextPage, goPrevPage, deletePage } = useNav()

    const shadow = useMemo(() => {
        return currentPageId == pageId ? '0 0 0 3px var(--accent-10)' : 'var(--shadow-2)'
    }, [currentPageId, pageId])

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
			draggable
		>

			<Box
				style={{
					width: '100%',
					height: '100%',
					overflow: 'hidden',
					borderRadius: 'var(--radius-2)',
					boxShadow: shadow,
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
