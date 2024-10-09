'use client'
import { Flex, Grid, Text, Card, IconButton, Popover, Box } from '@radix-ui/themes'
import {  Plus, ChevronRight, ChevronLeft } from 'lucide-react'
import AddMenu from './menus/AddMenu'
import { useNav } from '@/app/(frontend)/_hooks/useNav'
import Thumbnail from '@/app/(frontend)/[locale]/_components/Thumbnail'
import MobileToolbar from './MobileToolbar'



export default function MobileControls() {
    const { pageIds, currentPageId, nextPageId, prevPageId, setCurrentPage, goNextPage, goPrevPage, newPage } = useNav()
    const pagesNumber = pageIds.length
    const currentPageIndex = currentPageId ? (pageIds.indexOf(currentPageId)+1).toString() : '?'

    return (
        <Flex direction='column' gap='3'>

            {/* MOBILE TOOLBAR */}
            <MobileToolbar />

            {/* MOBILE PAGES NUMBERS AND + BUTTON */}
            <Grid columns='2' gap='3'>
                <Flex align='center' justify='center'>
                    <Text size='7'>
                        {currentPageIndex}/{pagesNumber}
                    </Text>
                </Flex>

                <Popover.Root>
                    <Popover.Trigger>
                        <IconButton size='4' style={{ width: '100%', boxShadow: 'var(--shadow-2)' }}>
                            <Plus size='30' />
                        </IconButton>
                    </Popover.Trigger>
                    <Popover.Content>
                        <AddMenu />
                    </Popover.Content>
                </Popover.Root>
            </Grid>

            {/* MOBILE THUMBNAILS FOR NAVIGATION */}
            <Grid columns='2' gap='3'>

                { prevPageId &&
                    <Card variant='classic' asChild>
                        <button onClick={goPrevPage} disabled={!prevPageId}>
                            <Flex direction='column' align='center' gap='3'>
                                <Box style={{boxShadow: 'var(--shadow-2)', borderRadius:'var(--radius-3)'}}>
                                    <Thumbnail pageId={prevPageId} />
                                </Box>
                                <ChevronLeft size='30' color={'var(--accent-10)'} />
                            </Flex>
                        </button>
                    </Card>

                    ||

                    <Box/>
                }

                { nextPageId &&

                    <Card variant='classic' asChild>
                        <button onClick={goNextPage} disabled={!nextPageId}>
                            <Flex direction='column' align='center' gap='3'>
                                <Box style={{boxShadow: 'var(--shadow-2)', borderRadius:'var(--radius-3)'}}>
                                    <Thumbnail pageId={nextPageId} />
                                </Box>
                                <ChevronRight size='30' color={'var(--accent-10)'} />
                            </Flex>
                        </button>
                    </Card>

                    ||

                    <Box/>
                }

            </Grid>

        </Flex>
    )
}