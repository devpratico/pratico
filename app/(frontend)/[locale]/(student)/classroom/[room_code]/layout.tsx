import { RoomProvider } from '@/app/(frontend)/_hooks/contexts/useRoom'
import { PresencesProvider } from '@/app/(frontend)/_hooks/contexts/usePresences'
import { NavProvider } from '@/app/(frontend)/_hooks/contexts/useNav'
import { TLEditorProvider } from '@/app/(frontend)/_hooks/contexts/useTLEditor'
import { Viewport } from 'next'
import { Box, Grid } from '@radix-ui/themes'
import PollParticipation from './_components/PollParticipation'
import QuizParticipation from './_components/QuizParticipation'
import { RealtimeActivityProvider } from '@/app/(frontend)/_hooks/contexts/useRealtimeActivityContext'
import Image from 'next/image'
import Link from '../../../_components/Link'


export const viewport: Viewport = {
    themeColor: 'black',
    maximumScale: 1,
    userScalable: false,
}

const logoScale = 0.15


export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <Box height='100dvh' width="100%" style={{backgroundColor:'black'}}>
            <Link
                href='https://pratico.live'
                target='_blank'
                style={{
                    position: 'absolute',
                    top: '2vh',
                    left: '2vw',
                    zIndex: 1000,
            }}>
                <Image
                    src='/images/logo.png'
                    width={420*logoScale}
                    height={105*logoScale}
                    alt='Pratico'
                    style={{
                        opacity: 0.2,
                        mixBlendMode: 'difference',
                    }}
                />
            </Link>
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

