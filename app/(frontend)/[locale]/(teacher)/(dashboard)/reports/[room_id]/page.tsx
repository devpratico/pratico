import logger from "@/app/_utils/logger";
import { formatDate } from "@/app/_utils/utils_functions";
import { Box, Container, Flex, Grid, ScrollArea, Section, Text } from "@radix-ui/themes";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import createClient from "@/supabase/clients/server";
import { AttendanceWidget } from "./_components/AttendanceWidget";
import { NextIntlClientProvider } from "next-intl";

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
		<NextIntlClientProvider>
			<ScrollArea>
				<Section px={{ initial: '3', xs: '0' }}>
					<Container>
						<Flex direction="column" gap="5">
							<Flex justify="start" gap="5">
								<Text weight="bold">
								{		
									capsuleTitle && capsuleTitle !== "Sans titre"
									? capsuleTitle
									: "Capsule sans titre"
								}
								</Text>
								{
									sessionDate.date
									? `Session du ${formatDate(sessionDate.date)}`
									: <></>
								}
							</Flex>
							<Grid columns='repeat(auto-fill, minmax(400px, 1fr))' gap='3' p='5'>
								<AttendanceWidget roomId={roomId} userId={userId} />
							</Grid>
						</Flex>
					</Container>
				</Section>	
			</ScrollArea>
		</NextIntlClientProvider>
	</>);
};