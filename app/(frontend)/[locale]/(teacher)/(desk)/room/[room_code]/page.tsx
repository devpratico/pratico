import ActivityCard from "./_components/ActivityCard";
import TeacherCanvas from "./_components/TeacherCanvasServer";
import { Flex, Box, Text } from "@radix-ui/themes"
import { Puzzle, MessageSquareText, Users, Ellipsis, FlaskRound } from 'lucide-react';
import Image from "next/image";
import TopBarPortal from "../../_components/TopBarPortal";
import StartDialog from "./_components/StartDialog";
import StopBtn from "./_components/StopBtn";
import MenuTabs from "../../_components/MenuTabs";
import createClient from "@/supabase/clients/server";
import logger from "@/app/_utils/logger";
import { redirect } from "@/app/(frontend)/_intl/intlNavigation";

export default async function Page({ params: { room_code } }: { params: { room_code: string } }) {
    const logoScale = 0.25;
	const supabase = createClient();

	const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (!user || userError) {
        logger.log('next:page', 'User info missing or error fetchingUser', userError ? userError : null);
        return (null);
    }
    const { data: roomData, error: roomError } = await supabase.from('rooms').select('created_by').eq('code', room_code).eq("status", "open").maybeSingle()
    if (roomError) {
        logger.log("next:page", "TeacherViewPage", "room error", roomError);
        throw (roomError);
    }
    if (roomData && roomData.created_by && user?.id !== roomData?.created_by)
		redirect(`/classroom/${room_code}`);
	else if (!roomData)
		throw new Error("La session est terminée ou n'existe pas");

    return (
        <>
			<TopBarPortal>

			<Flex justify={{initial:'center', xs:'between'}} align='center'>
					
				<Flex align='center' gap='4' display={{ initial: 'none', xs: 'flex' }}>
					
					<Flex align='center'>
						<Image src='/images/logolien.png' width={500 * logoScale} height={105 * logoScale} alt="Pratico" />
						<Text size='6' style={{ color: 'var(--background)', opacity: '0.5' }}>{`/${room_code}`}</Text>
					</Flex>
					<StartDialog/>
					<StopBtn message='Arrêter la session' />

				</Flex>

				{/* MenuTabs for Desktop */}
				<Box display={{ initial: 'none', xs: 'block' }}>
					<MenuTabs tabs={[
						{ menu: 'activities', label: 'Activités', icon: <Puzzle /> },
						{ menu: 'participants', label: 'Participants', icon: <Users /> },
						// { menu: 'chat', label: 'Chat', icon: <MessageSquareText /> },
						{ menu: 'more', label: 'Plus', icon: <Ellipsis /> }
					]} />
				</Box>

				{/* MenuTabs for Mobile - it has a Home tab and a smaller padding */}
				<Box display={{ initial: 'block', xs: 'none' }}>
					<MenuTabs padding='3px' tabs={[
						{ menu: undefined, label: 'Capsule', icon: <FlaskRound /> },
						{ menu: 'activities', label: 'Activités', icon: <Puzzle /> },
						{ menu: 'participants', label: 'Participants', icon: <Users /> },
						// { menu: 'chat', label: 'Chat', icon: <MessageSquareText /> },
						{ menu: 'more', label: 'Plus', icon: <Ellipsis /> }
					]} />
				</Box>					
					
			</Flex>

			</TopBarPortal>
			<TeacherCanvas roomCode={room_code} />

			{/* Activity Card, that automatically opens when an activity is running */}
			<ActivityCard />
        </>
    )
}