import { RoomProvider } from '@/app/(frontend)/_hooks/contexts/useRoom'
import { PresencesProvider } from '@/app/(frontend)/_hooks/contexts/usePresences'
import { NavProvider } from '@/app/(frontend)/_hooks/contexts/useNav'
import { TLEditorProvider } from '@/app/(frontend)/_hooks/contexts/useTLEditor'
import { Viewport } from 'next'
import { Box, Grid } from '@radix-ui/themes'
import PollParticipation from './_components/PollParticipation'
import QuizParticipation from './_components/QuizParticipation'
import { RealtimeActivityProvider } from '@/app/(frontend)/_hooks/contexts/useRealtimeActivityContext'


export const viewport: Viewport = {
    themeColor: 'black',
    maximumScale: 1,
    userScalable: false,
}


export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <Box height='100vh' width="100%" style={{backgroundColor:'black'}}>
            <RoomProvider>
                <RealtimeActivityProvider>
                    <PresencesProvider>
                        <TLEditorProvider>
                            <NavProvider>
                                {children}
                                <PollParticipation />
                                <QuizParticipation />
                            </NavProvider>
                        </TLEditorProvider>
                    </PresencesProvider>
                </RealtimeActivityProvider>
            </RoomProvider>
        </Box>
    )
}

