'use client';
import { useRouter } from 'next/navigation';
import useSearchParams from '@/app/_hooks/useSearchParams';
import logger from '@/app/_utils/logger';
import { useEffect, useState } from 'react';
import { fetchRoomsByCapsuleId } from '@/app/api/_actions/room';
import { fetchAttendanceByRoomId } from '@/app/api/_actions/attendance';
import { Callout, Container, Grid, Heading, Link, ScrollArea, Section, Text } from '@radix-ui/themes';
import { formatDate, sanitizeUuid } from '@/app/_utils/utils_functions';
import { fetchCapsule } from '@/app/api/_actions/capsule';

// TYPE
export type SessionInfoType = {
  id: string;
  created_at: string;
  numberOfParticipant: number;
  status?: 'open' | 'closed';
};

export default function CapsuleSessionReportPage() {
	const searchParams = useSearchParams().getPathnameWithoutSearchParam('capsuleId');
	const router = useRouter();
	const capsuleId = searchParams.split('/').pop();
	const [sessionInfo, setSessionInfo] = useState<SessionInfoType[] | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [ capsuleTitle, setCapsuleTitle ] = useState("");

  useEffect(() => {
    const getSessions = async () => {
		setLoading(true);
		try {
			if (!capsuleId)
				return ;
			let sessions: SessionInfoType[] = [];		
			const { data: roomData, error: roomError } = await fetchRoomsByCapsuleId(capsuleId);
			logger.debug('supabase:database', 'CapsuleSessionsReportServer', 'fetchRoomsByCapsuleId datas', roomData, roomError);
			if (!roomData || roomError) {
			logger.error('supabase:database', 'CapsuleSessionsReportServer', roomError ? roomError : 'No rooms data for this capsule');
			setError(roomError ? 'Une erreur est survenue lors de la récupération des sessions.' : 'Aucune sessions');
			return;
			}
			const { data: capsuleData, error: capsuleError } = await fetchCapsule(capsuleId);
			if (capsuleData)
				setCapsuleTitle(capsuleData?.title ? capsuleData.title : "");
			console.log("JIJDIJI", capsuleTitle);
			await Promise.all(
				roomData.map(async (room) => {
					const { data, error } = await fetchAttendanceByRoomId(room.id);
					if (!data || error) {
					logger.error('supabase:database', 'CapsuleSessionsReportServer', error ? error : 'No attendance data for this room');
					}
					const infos: SessionInfoType = {
						id: room.id.toString(),
						created_at: room.created_at,
						numberOfParticipant: data ? data.length : 0,
						status: room.status,
					};
					sessions.push(infos);
				})
			);

			setSessionInfo(sessions);
		} catch (err) {
			console.error('Error getting sessions', err);
			setError('Erreur lors de la récupération des sessions.');
		} finally {
			setLoading(false);
		}
    };

    getSessions();
  }, [capsuleId]);

  if (!capsuleId) {
    logger.error('next:page', 'ReportsOfCapsulePage', 'capsuleId missing');
    router.push('/reports');
	return ;
  }


  logger.log('next:page', 'Reports of capule #', capsuleId);

  return (
    <ScrollArea>
      <Section px={{ initial: '3', xs: '0' }}>
        <Container>
			<Heading as="h1">{capsuleTitle.length ? capsuleTitle : "Capsule sans titre"}</Heading>
          <Callout.Root mt='4'>
            <Grid columns='repeat(auto-fill, minmax(200px, 1fr))' gap='3'>
				{
					error
					? error
					: null
				}
              {
				loading ? (
					'Chargement des sessions...'
				) : sessionInfo && sessionInfo.length > 0 ? (
					sessionInfo.map((session, index) => {
					const url = `/reports/${sanitizeUuid(capsuleId)}/${session.id}`;
					
					return (
						<Link key={index} href={url}>
							{formatDate(session.created_at)} - Nombre de participants: {session.numberOfParticipant}{' '}
							{session.status === 'open' ? '(En cours)' : null}
						</Link>
					);
					})
				) : (
					'Aucune session pour cette capsule.'
              )}
            </Grid>
          </Callout.Root>
        </Container>
      </Section>
    </ScrollArea>
  );
}
