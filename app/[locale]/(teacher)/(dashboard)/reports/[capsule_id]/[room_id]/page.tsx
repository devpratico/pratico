"use client";
import useSearchParams from "@/app/_hooks/useSearchParams";
import logger from "@/app/_utils/logger";
import { formatDate } from "@/app/_utils/utils_functions";
import { fetchAttendance, fetchAttendanceByRoomId } from "@/app/api/_actions/attendance";
import { fetchCapsule } from "@/app/api/_actions/capsule";
import { fetchRoomDate } from "@/app/api/_actions/room";
import { Container, Heading, ScrollArea, Section, Separator, Table } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// TYPE
export type AttendanceInfoType = {
	first_name: string | null,
	last_name: string | null,
	connexion: string | undefined,
}

export default function SessionDetailsPage () {
	const searchParams = useSearchParams().getPathnameWithoutSearchParam('roomId');
	const router = useRouter();
	const roomIdTmp: string | number | undefined = searchParams.split('/').pop();
	const capsuleId = searchParams.split('/')[2];
	const [ attendanceInfo, setAttendanceInfo ] = useState<AttendanceInfoType[] | null>(null);
	const [ loading, setLoading ] = useState(true);
	const [ title, setTitle ] = useState<{capsuleTitle: string, sessionDate: string | undefined}>({capsuleTitle: '', sessionDate: ''});

  	useEffect(() => {
		logger.debug("next:page", "SessionDetailsPage", searchParams, roomIdTmp, capsuleId);
    	const getAttendances = async () => {
			if (!roomIdTmp)
			{
				router.push(`/reports/${capsuleId}`);
				return ;				
			}
			setLoading(true);
			try {
				const roomId = parseInt(roomIdTmp);
				if (!title.sessionDate?.length)
				{
					const {data: roomData, error: roomError} = await fetchRoomDate(roomId);
					logger.debug("supabase:database", "SessionDetailsPage", "fetchRoom", roomData, roomError);
					if (roomData)
						setTitle((prevTitle) => ({ ...prevTitle, sessionDate: roomData.created_at }));				}
				let attendances: AttendanceInfoType[] = [];		
				const { data: attendanceData, error: attendanceError } = await fetchAttendanceByRoomId(Number(roomId));
				logger.debug("supabase:database", "SessionDetailsPage", "fetchAttendanceByRoomID", attendanceData, attendanceError);
				if (!attendanceData || attendanceError) {
					logger.error('supabase:database', 'sessionDetailsPage', attendanceError ? attendanceError : 'No attendances data for this capsule');
					return ;
				}
				if (capsuleId && !title.capsuleTitle.length)
				{
					const { data: capsuleData, error: capsuleError } = await fetchCapsule(capsuleId);
					if (capsuleData)
						setTitle((prevTitle) => ({ ...prevTitle, capsuleTitle: capsuleData.title || '' }));				}
				await Promise.all(
					attendanceData.map(async (attendance) => {
						const { data, error } = await fetchAttendance(attendance.id);
						if (!data || error) {
						logger.error('supabase:database', 'CapsuleSessionsReportServer', error ? error : 'No attendance data for this attendance');
						}
						const infos: AttendanceInfoType = {
							first_name: attendance.first_name,
							last_name: attendance.last_name,
							connexion: formatDate(attendance.created_at, undefined, "hour")
						};
						attendances.push(infos);
					})
				);
				setAttendanceInfo(attendances);
			} catch (err) {
				console.error('Error getting attendances', err);
			} finally {
				setLoading(false);
			}
		};
		getAttendances();
		// eslint-disable-next-line react-hooks/exhaustive-deps
  	}, [roomIdTmp, capsuleId, router]);

	return (<>
		<ScrollArea>
			<Section>
				<Container >
					<Heading as="h1">{`Emargements${title.sessionDate ? ` du ${formatDate(title.sessionDate)}` : ""}`}</Heading>
					<Heading as="h3">{`${title.capsuleTitle !== "Sans titre" ? title.capsuleTitle : ""}`}</Heading>
					<Separator my='3'/>
					{
						loading
						? <>Chargement...</>
						: <Table.Root variant="surface">
							
							<Table.Header>
								<Table.Row>
									<Table.ColumnHeaderCell>Nom</Table.ColumnHeaderCell>
									<Table.ColumnHeaderCell>Prénom</Table.ColumnHeaderCell>
									<Table.ColumnHeaderCell>{"Heure d'arrivée"}</Table.ColumnHeaderCell>
								</Table.Row>
							</Table.Header>
							<Table.Body>
							{
								attendanceInfo?.map((attendance, index) => {
									return (
										<Table.Row key={index}>
											<Table.RowHeaderCell>{attendance.last_name}</Table.RowHeaderCell>
											<Table.Cell>{attendance.first_name}</Table.Cell>
											<Table.Cell>{attendance.connexion}</Table.Cell>
										</Table.Row>
									);
								})
							}
								</Table.Body>
						</Table.Root>
					}
				</Container>
			</Section>
		</ScrollArea>
	</>);
};