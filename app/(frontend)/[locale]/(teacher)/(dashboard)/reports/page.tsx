import { Container, Section, Callout, ScrollArea } from '@radix-ui/themes';
import { TablesInsert } from '@/supabase/types/database.types';
import logger from '@/app/_utils/logger';
import { ReportsDisplay } from './_components/ReportsDisplay';
import createClient from '@/supabase/clients/server';
import { SessionInfoType } from './[room_id]/page';

// TYPE
export type CapsuleType = TablesInsert<"capsules">;

export default async function ReportsPage() {
	let capsules: CapsuleType[] = [];
	let sessions: SessionInfoType[] = [];
	const supabase = createClient();

	try {
		const { data: {user}, error } = await supabase.auth.getUser();
		if (!user || error)
		{
			logger.error("next:page", "ReportsPage", !user ? "User not found" : `error: ${error}`);
			return (<></>);
		}
		if (user) {
			const { data } = await supabase.from('capsules').select('*').eq('created_by', user.id)
			if (data) {
				capsules = data;
			}
		}
		const { data: roomData, error: roomError } = await supabase.from('rooms').select('id, created_at, status, capsule_id').eq('created_by', user.id)
		if (!roomData || roomError) {
			logger.error('supabase:database', 'ReportsPage', roomError ? roomError : 'No rooms data for this user');
			return ;
		}
		await Promise.all(
			roomData.map(async (elem) => {
				const { data, error } = await supabase.from('attendance').select('*', { count: "exact", head: true }).eq('room_id', elem.id);
				if (!data || error) {
					logger.error('supabase:database', 'ReportsPage', error ? error : 'No attendance data for this room');
				}

                if (!elem.capsule_id) {
                    logger.error('supabase:database', 'ReportsPage', 'No capsule id');
                    return;
                }

				const { data: capsuleData, error: capsuleError } = await supabase.from("capsules").select("title").eq("id", elem.capsule_id).single();
				if (!capsuleData || capsuleError) {
					logger.error('supabase:database', 'ReportsPage', error ? error : 'No capsule data');
				}
				const tmp: SessionInfoType = {
					id: `${elem.id}`,
					numberOfParticipant: data?.length || 0,
					created_at: elem.created_at, 
					status: elem.status,
					capsule_id: elem.capsule_id,
					capsule_title: capsuleData?.title
				}
				sessions.push(tmp);
			})
		);
	} catch (error){
		logger.error("next:page", "ReportsPage", "Error caught", error);
	}

    return (
		<ScrollArea>
			<Section px={{ initial: '3', xs: '0' }}>
				<Container>
				{
					(sessions.length)
					? 	<ReportsDisplay sessions={sessions} />
					:	<Callout.Root mt='4'>
						<p>Vous retrouverez ici des rapports détaillés concernant vos sessions.</p>
					</Callout.Root>
				}					
				</Container>
			</Section>
		</ScrollArea>
    )
}