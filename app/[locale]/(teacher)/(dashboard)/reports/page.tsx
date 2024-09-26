import { Container, Section, Heading, Callout, Grid, Box, Link as RadixLink, ScrollArea } from '@radix-ui/themes';
import CapsuleReports from './_components/CapsuleReports';
import { fetchUser } from '@/app/api/actions/user';
import { fetchCapsulesData } from '@/app/api/actions/capsule';
import { Json } from '@/supabase/types/database.types';
import logger from '@/app/_utils/logger';
import { ReportsDisplay } from './_components/ReportsDisplay';
import { OptionsMenu } from './_components/OptionsMenu';
import { Loading } from './_components/LoadingPage';

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
	} catch (error){
		logger.error("next:page", "ReportsPage", "Error caught", error);
	} finally {
		loading = false;
	}


    return (
		<ScrollArea>
			<Section px={{ initial: '3', xs: '0' }}>
				<Container>
				{
					loading
					? <Loading />
					: (capsules.length)
						? 	<ReportsDisplay capsules={capsules} />
						:	<Callout.Root mt='4'>
							<p>Vous retrouverez ici des rapports détaillés concernant vos sessions.</p>
						</Callout.Root>
				}					
				</Container>
			</Section>
		</ScrollArea>
    )
}