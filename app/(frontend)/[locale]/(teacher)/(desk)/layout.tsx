import TopBarBox from "../_components/TopBarBox"
import { Grid, Card, Box, Flex } from "@radix-ui/themes"
import MenuDialog from "./_components/MenuDialog"
import MenuSelector from "./_components/MenuSelector"
import Carousel from "./_components/Carousel"
import Controls from "./_components/Controls"
import { TLEditorProvider } from "@/app/(frontend)/_hooks/contexts/useTLEditor"
import { NavProvider } from "@/app/(frontend)/_hooks/contexts/useNav"
import MobileControls from "./_components/MobileControls"
import { PresencesProvider } from "@/app/(frontend)/_hooks/contexts/usePresences"
import { RoomProvider } from "@/app/(frontend)/_hooks/contexts/useRoom"
import ActivitiesMenu from "./_components/menus/ActivitiesMenu/ActivitiesMenu"
import AllQuizesMenu from "./_components/menus/ActivitiesMenu/components/AllQuizesMenu"
import AllPollsMenu from "./_components/menus/ActivitiesMenu/components/AllPollsMenu"
import ParticipantsMenu from "./_components/menus/ParticipantsMenu/ParticipantsMenu"
import DefilementMenu from "./_components/menus/ParticipantsMenu/DefilementMenu"
import ChatMenu from "./_components/menus/ChatMenu"
import MoreMenu from "./_components/menus/MoreMenu"
import { CardDialogProvider } from "@/app/(frontend)/_hooks/contexts/useCardDialog"
import GlobalCardDialog from "./_components/GlobalCardDialog"
import { FullscreenProvider } from "@/app/(frontend)/_hooks/contexts/useFullscreen"
import PollCreation from "./_components/menus/ActivitiesMenu/components/PollCreation"
import QuizCreation from "./_components/menus/ActivitiesMenu/components/QuizCreation"

export default function Layout({ children }: { children: React.ReactNode }) {

    return (
        <TLEditorProvider>
        <NavProvider>
        <PresencesProvider>
        <RoomProvider>
		<FullscreenProvider>
        <CardDialogProvider>
            {/**
             * Top bar, as defined in the parent layout
             * It is empty because the content is defined in the children
             * The children will use `TopBarPortal` to render inside this component.
             */}
            <TopBarBox/>
            

            {/**
             * The main content will contain the canvas and the carousel + controls.
             * The menus layout is also defined here.
             */}
            <Grid
                rows={{ initial: '1fr auto', xs: '1fr 60px' }}
                py='3'
                gap='3'
                pl='max(env(safe-area-inset-left), 12px)'
                pr='max(env(safe-area-inset-right), 12px)'
                position='relative'
                overflowY='clip' // Necessary for mobile landscape - the toolbar overflows
            >

                {/* Main content. Canvas will go here */}
                <Box>
                    {children}
                </Box>    

                {/* Menus layout (outside the grid layout because of `absolute`)*/}
                <Box position='absolute' top='0' bottom='0' right='0' width='100%' overflow='clip' style={{pointerEvents: 'none'}}>
                    <MenuDialog>
                        <MenuSelector
                            menus={{
                                'activities': <ActivitiesMenu />,
                                'quizes': <AllQuizesMenu />,
                                'polls': <AllPollsMenu />,
                                'participants': <ParticipantsMenu />,
                                'defilement': <DefilementMenu />,
                                'chat': <ChatMenu />,
                                'more': <MoreMenu />
                            }}
                        />
                    </MenuDialog>
                </Box>

                {/* Carousel + controls for desktop */}
                <Grid columns='1fr auto' gap='3' height='auto' display={{initial: 'none', xs: 'grid'}}>
                    <Carousel/>
                    <Card variant='classic'><Controls/></Card>
                </Grid>

                {/* Controls for mobile */}
                <Box display={{ initial: 'block', xs: 'none' }}>
                    <MobileControls/>
                </Box>


                {/* Global card dialog */}
                <Box position='absolute'>
                    <GlobalCardDialog/>
                </Box>

                {/* Poll creation dialog */}
                <PollCreation/>
                
                {/* Quiz creation dialog */}
                <QuizCreation/>

                

            </Grid>
        </CardDialogProvider>
		</FullscreenProvider>
        </RoomProvider>
        </PresencesProvider>
        </NavProvider>
        </TLEditorProvider>
    )
}