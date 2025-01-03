import logger from "@/app/_utils/logger";
import { Container, Flex, Grid, ScrollArea, Section, Text } from "@radix-ui/themes";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import createClient from "@/supabase/clients/server";
import { AttendanceWidget } from "./attendance/_components/AttendanceWidget";
import { BackButton } from "@/app/(frontend)/[locale]/_components/BackButton";
import { getFormatter } from "next-intl/server";
import { CapsuleWidget } from "./_components/CapsuleWidget";


// TYPE
export type AttendanceInfoType = {
	first_name: string | null,
	last_name: string | null,
	additional_info: string | null,
	connexion: string | undefined,
}
// // TYPE
export type SessionInfoType = {
  id: string;
  created_at: string;
  numberOfParticipant: number;
  status?: 'open' | 'closed';
  capsule_id?: string;
  capsule_title?: string | null
};

export default async function SessionDetailsPage ({ params }: { params: Params }) {
	const supabase = createClient();
	const roomId: string = params.room_id;
	const formatter = await getFormatter();
	let userId: string | null = null;
	let capsuleTitle = "Sans titre";
	let capsuleId: string | null = null;
	let sessionDate: { date: Date, end: Date } | null = null;
	if (!(roomId))
	{
		logger.error("next:page", "SessionDetailsPage", "roomId or capsuleId missing");
		return ;				
	}
	try {
		const {data: { user }} = await supabase.auth.getUser();
		if (user)
		{
			userId = user.id;
			const {data: roomData, error: roomError} = await supabase.from('rooms').select('created_at, capsule_id, end_of_session').eq('id', roomId).single();
			if (roomError)
				logger.error('supabase:database', 'sessionDetailsPage', 'fetch form rooms error', roomError);
			if (roomData && roomData.end_of_session)
				sessionDate = { date: new Date(roomData.created_at), end: new Date(roomData.end_of_session) };
			if (roomData?.capsule_id)
			{
				capsuleId = roomData?.capsule_id;
				const { data: capsuleData } = await supabase.from('capsules').select('title').eq('id', capsuleId).single();
				if (capsuleData)
					capsuleTitle = capsuleData.title ? capsuleData.title : "Sans titre";
			}
		}
	} catch (err) {
        logger.error('supabase:database', 'CapsuleSessionsReportServer', 'Error getting attendances', err);
	}
	if (!userId)
	{	
		logger.error('supabase:database', 'CapsuleSessionsReportServer', 'User not found');
		throw new Error("L'utilisateur n'a pas été trouvé");
	}
	return (<>
		<ScrollArea type="scroll"> 
			<Section px={{ initial: '3', xs: '0' }}>
				<Container>
					<Flex direction="column" gap="3" align="start">
						<BackButton backTo="/reports"/>
						<Text size="4" weight="bold">
						{		
							capsuleTitle && capsuleTitle !== "Sans titre"
							? capsuleTitle
							: "Capsule sans titre"
						}
						</Text>
						{
							sessionDate?.date
							? <Text size="1">{`Session du ${formatter.dateTime(sessionDate.date, {dateStyle: "short"})}`}</Text> 
							: <></>
						}
					</Flex>
					<Grid columns='repeat(auto-fill, minmax(400px, 1fr))' gap='3' p='5'>
						<AttendanceWidget roomId={roomId} userId={userId!} capsuleTitle={capsuleTitle}/>
						{/* <CapsuleWidget userId={userId} capsuleTitle={capsuleTitle} capsuleId={capsuleId} roomId={roomId} /> */}
					</Grid>
				</Container>
			</Section>	
		</ScrollArea>
	</>);
};