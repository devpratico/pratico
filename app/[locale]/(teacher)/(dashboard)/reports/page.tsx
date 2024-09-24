import { Container, Section, Heading, Callout, Grid, Box, Link, ScrollArea } from '@radix-ui/themes';
import CapsuleReports from './_components/CapsuleReports';
import { fetchUser } from '@/app/api/_actions/user';
import { fetchCapsulesData } from '@/app/api/_actions/capsule';
import { Json } from '@/supabase/types/database.types';
import logger from '@/app/_utils/logger';

// TYPE
export type CapsuleType = {
	created_at: string;
	created_by: string | null;
	id: string;
	title: string | null;
	tld_snapshot: Json[] | null;
};

// export const getReportData = async (capsuleId: string) => {
// 	const { data: roomData, error: roomError } = await fetchRoomsByCapsuleId(capsuleId);
// 	let sessions: SessionInfoType[] | null = null;
// 	logger.debug("supabase:database", "ReportsOfCapsulePage", "fetchRoomsByCapsuleId datas", roomData, roomError);
// 	if (!roomData || roomError)
// 	{
// 		logger.error("supabase:database", "ReportsOfCapsulePage", roomError ? roomError : "No rooms data for this capsule");
// 		return (null);
// 	}
// 	roomData.map(async (room) => {
// 		const{ data, error } =  await fetchAttendancesByRoomId(room.id);
// 		if (!data || error)
// 			logger.error("supabase:database", "ReportsOfCapsulePage", error ? error : "No attendance data for this room");
// 		const infos: SessionInfoType = {
// 			created_at: room.created_at,
// 			numberOfParticipant: data ? data.length : 0,
// 			status: room.status
// 		}
// 		if (sessions)
// 			sessions.push(infos);
// 		else
// 			sessions = [infos];
// 	});
// 	return (sessions);
// };

export default async function ReportsPage() {
	const { user, error } = await fetchUser();
	if (!user || error)
	{
		logger.error("next:page", "ReportsPage", !user ? "User not found" : `error: ${error}`);
		return (<></>);
	}
    let capsules: CapsuleType[] = [];
    if (user) {
        const { data, error } = await fetchCapsulesData(user.id);
        if (data) {
			capsules = data;
		}
    }


    return (
		<ScrollArea>
			<Section px={{ initial: '3', xs: '0' }}>
				<Container>
					<Heading as='h1'>Rapports</Heading>
						{
							(capsules.length)
							? 	<Grid columns='repeat(auto-fill, minmax(200px, 1fr))' gap='3'>
								{
									capsules.map((cap, index) => {
										let url = `/reports/${cap.id}`
										return (<CapsuleReports key={index} capsule={cap} />);
									})
								}
								</Grid>	
							:	<Callout.Root mt='4'>
								<p>Vous retrouverez ici des rapports détaillés concernant vos sessions.</p>
							</Callout.Root>
						}
				</Container>
			</Section>
		</ScrollArea>
    )
}