import logger from "@/app/_utils/logger";
import { Container, Flex, Grid, ScrollArea, Section, Text } from "@radix-ui/themes";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import createClient from "@/supabase/clients/server";
import { AttendanceWidget } from "./_components/AttendanceWidget";
import { BackButton } from "@/app/(frontend)/[locale]/_components/BackButton";
import { getFormatter } from "next-intl/server";

// TYPE
export type AttendanceInfoType = {
	first_name: string | null,
	last_name: string | null,
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
	const roomId = params.room_id;
	const formatter = await getFormatter();
	let userId: string | null = null;
	let capsuleTitle = "Sans titre";
	let sessionDate: { date: string, end: string | null | undefined } = {
		date: "",
		end: ""
	};
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
			if (roomData)
				sessionDate = { date: roomData.created_at, end: roomData.end_of_session };
			const capsuleId = roomData?.capsule_id;
			if (capsuleId)
			{
				const { data: capsuleData } = await supabase.from('capsules').select('*').eq('id', capsuleId).single();
				if (capsuleData)
					capsuleTitle = capsuleData.title ? capsuleData.title : "Sans titre";
			}
		}
	} catch (err) {
        logger.error('supabase:database', 'CapsuleSessionsReportServer', 'Error getting attendances', err);
	}
	return (<>
		<ScrollArea>
			<Section px={{ initial: '3', xs: '0' }}>
				<Container>
					<BackButton backTo="/reports"/>
					<Flex gap="5" justify="start">
						<Grid columns='repeat(auto-fill, minmax(400px, 1fr))' gap='3' p='5'>

								<Text size="4" weight="bold">
								{		
									capsuleTitle && capsuleTitle !== "Sans titre"
									? capsuleTitle
									: "Capsule sans titre"
								}
								</Text>
								{
									sessionDate.date
									? <Text size="1">{`Session du ${formatter.dateTime(new Date(sessionDate.date), {dateStyle: "short"})}`}</Text> 
									: <></>
								}
							<Flex direction="column" gap="5" mt="5">
								<AttendanceWidget roomId={roomId} userId={userId} />
							</Flex>
						</Grid>
					</Flex>
				</Container>
			</Section>	
		</ScrollArea>
	</>);
};