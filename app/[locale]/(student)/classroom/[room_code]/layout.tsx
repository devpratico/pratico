import { RoomProvider } from '@/app/_hooks/useRoom'
import { PresencesProvider } from '@/app/_hooks/usePresences'
import { NavProvider } from '@/app/_hooks/useNav'
import { TLEditorProvider } from '@/app/_hooks/useTLEditor'
import { Viewport } from 'next'
import { Grid, Box, Flex } from '@radix-ui/themes'


export const viewport: Viewport = {
    themeColor: 'black',
    maximumScale: 1,
    userScalable: false,
}


export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <Grid
            columns={{initial: '1fr', xs: 'auto 1fr'}}
            rows={{initial: '1fr auto', xs: '1fr'}}
            height='100dvh'
            style={{backgroundColor:'black'}}
        >
            <RoomProvider>
                <PresencesProvider>
                    <TLEditorProvider>
                        <NavProvider>
                            {children}
                        </NavProvider>
                    </TLEditorProvider>
                </PresencesProvider>
            </RoomProvider>
        </Grid>
    )
}

/**
 * Helps position the toolbar in the correct grid cell
 */
export function ToolbarBox({ children }: { children: React.ReactNode }) {
    return (
        <Flex gridRow={{ initial: '2', xs: '1' }} align='center'>
            {children}
        </Flex>
    )
}