import { Container, Section, Heading, Callout, Grid, Box, Link as RadixLink, ScrollArea } from '@radix-ui/themes';
import { fetchUser } from '@/app/api/actions/user';
import { fetchCapsulesData } from '@/app/api/actions/capsule';
import { Json } from '@/supabase/types/database.types';
import logger from '@/app/_utils/logger';
import { ReportsDisplay } from './_components/ReportsDisplay';
import { Loading } from './_components/LoadingPage';
import { fetchSessionInfoByUser } from '@/app/api/actions/room';
import { SessionInfoType } from './[capsule_id]/page';
import { fetchAttendanceByRoomId } from '@/app/api/actions/attendance';
import createClient from '@/supabase/clients/client';

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
	let loading = true;
	let capsules: CapsuleType[] = [];
	let sessions: SessionInfoType[] = [];
	const supabase = createClient();

	try {
		const { user, error } = await fetchUser();
		if (!user || error)
		{
			logger.error("next:page", "ReportsPage", !user ? "User not found" : `error: ${error}`);
			return (<></>);
		}
		if (user) {
			const { data, error } = await fetchCapsulesData(user.id);
			if (data) {
				capsules = data;
			}
		}
		const { data: roomData, error: roomError } = await fetchSessionInfoByUser(user.id);
		logger.debug('supabase:database', 'ReportsPage', 'fetchRoomsByUser datas', roomData, roomError);
		if (!roomData || roomError) {
			logger.error('supabase:database', 'ReportsPage', roomError ? roomError : 'No rooms data for this user');
			return ;
		}
		await Promise.all(
			roomData.map(async (elem) => {
				const { data, error } = await fetchAttendanceByRoomId(elem.id);
				if (!data || error) {
					logger.error('supabase:database', 'ReportsPage', error ? error : 'No attendance data for this room');
				}

				const { data: capsuleData, error: capsuleError } = await supabase.from("capsules").select("title").eq("id", elem.capsule_id).single();
				if (!capsuleData || capsuleError) {
					logger.error('supabase:database', 'ReportsPage', error ? error : 'No capsule data');
				}
				const tmp: SessionInfoType = {
					id: elem.id,
					numberOfParticipant: data?.length || 0,
					created_at: elem.created_at, 
					status: elem.status,
					capsule_id: elem.capsule_id,
					capsule_title: capsuleData?.title
				}
				logger.debug("next:page", "ReportsPage tmp", tmp);
				sessions.push(tmp);
			})
		);
		logger.log("next:page", "ReportsPage", sessions)
	} catch (error){
		logger.error("next:page", "ReportsPage", "Error caught", error);
	} finally {
		loading = false;
		logger.debug("next:page", "ReportsPage sessions", sessions);

	}


    return (
		<ScrollArea>
			<Section px={{ initial: '3', xs: '0' }}>
				<Container>
				<Heading mb='4' as='h1'>Rapports</Heading>
				{
					loading
					? <Loading />
					: (capsules.length)
						? 	<ReportsDisplay capsules={capsules} sessions={sessions} />
						:	<Callout.Root mt='4'>
							<p>Vous retrouverez ici des rapports détaillés concernant vos sessions.</p>
						</Callout.Root>
				}					
				</Container>
			</Section>
		</ScrollArea>
    )
}