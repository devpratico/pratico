"use client";
import useSearchParams from "@/app/_hooks/useSearchParams";
import logger from "@/app/_utils/logger";
import { formatDate } from "@/app/_utils/utils_functions";
import { fetchRoomsByCapsuleId } from "@/app/api/_actions/room";
import { Container, Heading, ScrollArea, Section, Separator, Table } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// TYPE
export type AttendanceInfoType = {
	first_name: string,
	last_name: string,
	connexion: string
}

export default function SessionDetailsPage () {
	const searchParams = useSearchParams().getPathnameWithoutSearchParam('roomId');
	const router = useRouter();
	const roomId = searchParams.split('/').pop();
	const capsuleId = searchParams.split('/')[1];
	const [attendanceInfo, setAttendanceInfo] = useState<AttendanceInfoType[] | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [ capsuleTitle, setCapsuleTitle ] = useState("");

  useEffect(() => {
    const getattendances = async () => {
		setLoading(true);
		try {
			if (!roomId)
				return ;
			let attendances: AttendanceInfoType[] = [];		
			
	
			setAttendanceInfo(attendances);
		} catch (err) {
			console.error('Error getting attendances', err);
			setError('Erreur lors de la récupération des emargements.');
		} finally {
			setLoading(false);
		}
    };

    getattendances();
  }, [roomId]);

  if (!roomId) {
    logger.error('next:page', 'SessionDetailsPage', 'roomId missing');
    router.push('/reports');
	return ;
  }
	return (<>
		<ScrollArea>
			<Section>
				<Container >
					<Heading as="h1">{`attendance du ${'date/heure'}`}</Heading>
					<Heading as="h3">{`${capsuleTitle !== "Sans titre" ? capsuleTitle : null}`}</Heading>
					<Separator my='3'/>
					{
						error
						? error
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
								loading
								? <>Chargement...</>
								: attendanceInfo?.map((attendance, index) => {
									return (
										<Table.Row key={index}>
											<Table.RowHeaderCell>{attendance.last_name}</Table.RowHeaderCell>
											<Table.Cell>{attendance.first_name}</Table.Cell>
											<Table.Cell>{formatDate(attendance.connexion, undefined, "hour")}</Table.Cell>
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