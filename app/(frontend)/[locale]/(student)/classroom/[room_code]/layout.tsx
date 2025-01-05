import { RoomProvider } from '@/app/(frontend)/_hooks/contexts/useRoom'
import { PresencesProvider } from '@/app/(frontend)/_hooks/contexts/usePresences'
import { NavProvider } from '@/app/(frontend)/_hooks/contexts/useNav'
import { TLEditorProvider } from '@/app/(frontend)/_hooks/contexts/useTLEditor'
import { Viewport } from 'next'
import { Grid } from '@radix-ui/themes'
import PollAnswering from './_components/PollAnswering'


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
                            <PollAnswering />
                        </NavProvider>
                    </TLEditorProvider>
                </PresencesProvider>
            </RoomProvider>
        </Grid>
    )
}

