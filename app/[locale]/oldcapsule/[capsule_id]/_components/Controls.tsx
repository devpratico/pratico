'use client'
import { Flex, IconButton, Text } from "@radix-ui/themes"
import { Plus, ChevronLeft, ChevronRight, Maximize } from "lucide-react"
import { useNav } from "@/app/_hooks/useNav"
import { useMenus } from "@/app/_hooks/useMenus"


export default function Controls() {

    const {
        pageIds,
        currentPageId,
        goNextPage,
        goPrevPage,
    } = useNav()

    const { toggleDeskMenu } = useMenus()

    const leftNumber = pageIds && currentPageId ? Array.from(pageIds).indexOf(currentPageId) + 1 : 0
    const rightNumber = pageIds ? Array.from(pageIds).length : 0

    const iconSize = '30'


    return (
        <Flex gap='4' px='4' justify='between' align='center' style={{ backgroundColor: 'var(--background)' }}>
            <IconButton size='3' onPointerDown={() => toggleDeskMenu('add')}>
                <Plus size={iconSize} />
            </IconButton>

            <IconButton variant='ghost' size='3' onClick={goPrevPage}>
                <ChevronLeft size={iconSize} />
            </IconButton>

            <Text>{leftNumber}/{rightNumber}</Text>

            <IconButton variant='ghost' size='3' onClick={goNextPage}>
                <ChevronRight size={iconSize} />
            </IconButton>

            <IconButton variant='ghost' size='3' disabled={true}>
                <Maximize size={iconSize} />
            </IconButton>
        </Flex>
    )
}