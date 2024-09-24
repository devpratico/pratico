'use client';
import { useRouter } from 'next/navigation';
import useSearchParams from '@/app/_hooks/useSearchParams';
import logger from '@/app/_utils/logger';
import { useEffect, useState } from 'react';
import { fetchRoomsByCapsuleId } from '@/app/api/_actions/room';
import { fetchAttendanceByRoomId } from '@/app/api/_actions/attendance';
import { Button, Container, Flex, Heading, ScrollArea, Section, Table } from '@radix-ui/themes';
import { formatDate, sanitizeUuid } from '@/app/_utils/utils_functions';
import { fetchCapsule } from '@/app/api/_actions/capsule';

// TYPE
export type SessionInfoType = {
  id: string;
  created_at: string;
  numberOfParticipant: number;
  status?: 'open' | 'closed';
};

const DISPAY_SESSIONS = "TABLE";

export default function CapsuleSessionReportPage() {
	const searchParams = useSearchParams().getPathnameWithoutSearchParam('capsuleId');
	const router = useRouter();
	const capsuleId = searchParams.split('/').pop();
	const [sessionInfo, setSessionInfo] = useState<SessionInfoType[] | null>(null);
	const [loading, setLoading] = useState(true);
	const [ capsuleTitle, setCapsuleTitle ] = useState("");

  useEffect(() => {
	if (!capsuleId)
		return ;
    const getSessions = async () => {
		setLoading(true);
		try {
			let sessions: SessionInfoType[] = [];
			const { data: roomData, error: roomError } = await fetchRoomsByCapsuleId(capsuleId);
			logger.debug('supabase:database', 'CapsuleSessionsReportServer', 'fetchRoomsByCapsuleId datas', roomData, roomError);
			if (!roomData || roomError) {
				logger.error('supabase:database', 'CapsuleSessionsReportServer', roomError ? roomError : 'No rooms data for this capsule');
				return ;
			}
			const { data: capsuleData, error: capsuleError } = await fetchCapsule(capsuleId);

			if (capsuleData)
				setCapsuleTitle(capsuleData?.title ? capsuleData.title : "");
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
		} finally {
			setLoading(false);
		}
    };

    getSessions();
  }, [capsuleId]);

  const handleClick = (roomId: string, open: boolean) => {
	if (!open && capsuleId)
		router.push(`/reports/${sanitizeUuid(capsuleId)}/${sanitizeUuid(roomId)}`);
	logger.log('next:page', 'Reports of capule #', capsuleId);
   };


  return (
	<>
		<ScrollArea>
	      	<Section px={{ initial: '3', xs: '0' }}>
				<Container >
					<Heading as="h1">{capsuleTitle && capsuleTitle !== "Sans titre" ? capsuleTitle : "Capsule sans titre"}</Heading>
					<Section px={{ initial: '3', xs: '0' }}>
					{
						DISPAY_SESSIONS === "TABLE"
						? <Table.Root variant="surface">
						
							<Table.Header>
								<Table.Row>
								<Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
								<Table.ColumnHeaderCell>Nombre de participants</Table.ColumnHeaderCell>
								<Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
								</Table.Row>
							</Table.Header>

							<Table.Body>
								{
									sessionInfo?.map((session, index) => {
										return (
											<Table.Row key={index} style={{cursor: session.status === "open" ? 'default': 'pointer', backgroundColor: session.status === "open" ? '#E0E0E0': 'none'}} onClick={() => handleClick(session.id, session.status === "open")}>
												<Table.RowHeaderCell>{formatDate(session.created_at)}</Table.RowHeaderCell>
												<Table.Cell>{session.numberOfParticipant ? session.numberOfParticipant : "Aucun"}</Table.Cell>
												<Table.Cell>{session.status === "open" ? "En cours" : "Terminé" }</Table.Cell>
											</Table.Row>
										);
									})
								}
							</Table.Body>
						</Table.Root>
						: <>
							{
								loading ? (
									'Chargement des sessions...'
								) : sessionInfo && sessionInfo.length > 0 ? (
									sessionInfo.map((session, index) => {
									
									return (
										<Flex key={index} direction='row' mb='2'>
											<Button onClick={() => handleClick(session.id, session.status === "open")}>
												{formatDate(session.created_at)} - Nombre de participants: {session.numberOfParticipant}{' '}
												{session.status === 'open' ? '(En cours)' : null}
											</Button>
										</Flex>
									
									);
									})
								) : (
									'Aucune session pour cette capsule.'
							)}
						</>

					}
					</Section>
				</Container>
			</Section>
		</ScrollArea>
	</>
		
  );
}