"use client";
import useSearchParams from "@/app/_hooks/useSearchParams";
import logger from "@/app/_utils/logger";
import { formatDate } from "@/app/_utils/utils_functions";
import { fetchAttendance, fetchAttendanceByRoomId } from "@/app/api/_actions/attendance";
import { fetchCapsule } from "@/app/api/_actions/capsule";
import { fetchRoomsByCapsuleId } from "@/app/api/_actions/room";
import { Container, Heading, ScrollArea, Section, Separator, Table } from "@radix-ui/themes";
import { at } from "lodash";
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
	const [attendanceInfo, setAttendanceInfo] = useState<AttendanceInfoType[] | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [ capsuleTitle, setCapsuleTitle ] = useState("");

  useEffect(() => {
	logger.debug("next:page", "SessionDetailsPage", searchParams, roomIdTmp, capsuleId);
    const getAttendances = async () => {
		setLoading(true);
		try {
			if (!roomIdTmp)
			{
				router.push(`/reports/${capsuleId}`);
				return ;				
			}

			const roomId = parseInt(roomIdTmp);
			let attendances: AttendanceInfoType[] = [];		
			const { data: attendanceData, error: attendanceError } = await fetchAttendanceByRoomId(Number(roomId));
			logger.debug("supabase:database", "SessionDetailsPage", "fetchAttendanceByRoomID", attendanceData, attendanceError);
			if (!attendanceData || attendanceError) {
				logger.error('supabase:database', 'sessionDetailsPage', attendanceError ? attendanceError : 'No attendances data for this capsule');
				setError(attendanceError ? 'Une erreur est survenue lors de la récupération des emargements.' : 'Aucun émargement.');
				return ;
			}
			if (capsuleId)
			{
				const { data: capsuleData, error: capsuleError } = await fetchCapsule(capsuleId);
				if (capsuleData)
					setCapsuleTitle(capsuleData?.title ? capsuleData.title : "");
			}
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
			setError('Erreur lors de la récupération des émargements.');
		} finally {
			setLoading(false);
		}
    };

    getAttendances();
  }, [roomIdTmp, router]);

  	if (!capsuleId)
		router.push("/reports");
	return (<>
		<ScrollArea>
			<Section>
				<Container >
					<Heading as="h1">{`attendance du ${'date/heure'}`}</Heading>
					<Heading as="h3">{`${capsuleTitle !== "Sans titre" ? capsuleTitle : null}`}</Heading>
					<Separator my='3'/>
					<Table.Root variant="surface">
						
						<Table.Header>
							<Table.Row>
								<Table.ColumnHeaderCell>Nom</Table.ColumnHeaderCell>
								<Table.ColumnHeaderCell>Prénom</Table.ColumnHeaderCell>
								<Table.ColumnHeaderCell>{"Heure d'arrivée"}</Table.ColumnHeaderCell>
							</Table.Row>
						</Table.Header>

						<Table.Body>
						{
							loading
							? <>Chargement...</>
							: attendanceInfo?.map((attendance, index) => {
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
				</Container>
			</Section>
		</ScrollArea>
	</>);
};