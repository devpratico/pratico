'use client'
import { Flex, IconButton, Text, Popover } from "@radix-ui/themes"
import { Plus, ChevronLeft, ChevronRight, Maximize } from "lucide-react"
import { useNav } from "@/app/(frontend)/_hooks/useNav"
import AddMenu from "./menus/AddMenu"
//import dynamic from "next/dynamic"
//const AddMenu = dynamic(() => import('./menus/AddMenu'), { ssr: false })
import { useState, useEffect, useMemo } from "react"
import { debounce } from "lodash"
import logger from "@/app/_utils/logger"



const iconSize = '30'


export default function Controls() {

    const {
        pageIds,
        currentPageId,
        goNextPage,
        goPrevPage,
    } = useNav()

    const leftNumber = pageIds && currentPageId ? Array.from(pageIds).indexOf(currentPageId) + 1 : 0
    const rightNumber = pageIds ? Array.from(pageIds).length : 0

    const [openImport, setOpenImport] = useState(false)
    const numberOfPages = useMemo(() => pageIds ? Array.from(pageIds).length : 0, [pageIds])

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
		  if (e.key === 'ArrowRight') {
			logger.log("react:component", "CanvasSL", "TEST ARROW RIGHT");
			e.preventDefault();
			goNextPage();
		  } else if (e.key === 'ArrowLeft') {
			logger.log("react:component", "CanvasSL", "TEST ARROW LEFT");
			e.preventDefault();
			goPrevPage();
		  }
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => {
		  window.removeEventListener('keydown', handleKeyDown);
		};
	  }, [goNextPage, goPrevPage]);

    useEffect(() => {
        const debouncedSetOpenImport = debounce((pages) => {
            if (pages == 1) {
                setOpenImport(true)
            } else {
                setOpenImport(false)
            }
        }, 1000)

        debouncedSetOpenImport(numberOfPages)

        return () => {
            debouncedSetOpenImport.cancel()
        }
    }, [numberOfPages])


    return (
        <Flex gap='4' justify='between' align='center' height='100%'>

            <Popover.Root open={openImport} onOpenChange={setOpenImport}>
                <Popover.Trigger>
                    <IconButton size='3'>
                        <Plus size={iconSize} />
                    </IconButton>
                </Popover.Trigger>

                <Popover.Content size='3'>
                    <AddMenu />
                </Popover.Content>
            </Popover.Root>

            

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