'use client'
import { Flex, IconButton, Text } from "@radix-ui/themes"
import { Plus, ChevronLeft, ChevronRight, Maximize } from "lucide-react"
import { useNav } from "@/app/[locale]/_hooks/useNav"
import { useMenu } from "../../../_hooks/useMenu"


export default function Controls() {

    const {
        pageIds,
        currentPageId,
        goNextPage,
        goPrevPage,
    } = useNav()

    const { toggleDeskMenu } = useMenu()

    const leftNumber = pageIds && currentPageId ? Array.from(pageIds).indexOf(currentPageId) + 1 : 0
    const rightNumber = pageIds ? Array.from(pageIds).length : 0

    const iconSize = '30'


    return (
        <Flex  px='4' justify='between' align='center' style={{height:'100%', backgroundColor:'var(--background)'}}>
            <IconButton size='3' onClick={() => toggleDeskMenu('add')}>
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