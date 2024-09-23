"use client";
import useSearchParams from "@/app/_hooks/useSearchParams";
import logger from "@/app/_utils/logger";
import { formatDate } from "@/app/_utils/utils_functions";
import { Container, Heading, ScrollArea, Section, Separator, Table } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// TYPE
export type AttendanceInfoType = {
	first_name: string,
	last_name: string,
	connexion: string
}

export default function SessionDetails () {
	const searchParams = useSearchParams().getPathnameWithoutSearchParam('roomId');
	const router = useRouter();
	const roomId = searchParams.split('/').pop();
	const [attendanceInfo, setAttendanceInfo] = useState<AttendanceInfoType[] | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [ capsuleTitle, setCapsuleTitle ] = useState("");

  useEffect(() => {
    const getattendances = async () => {
		setLoading(true);
		try {
		
		} catch (err) {
			console.error('Error getting attendances', err);
			setError('Erreur lors de la récupération des attendances.');
		} finally {
			setLoading(false);
		}
    };

    getattendances();
  }, [roomId]);

  if (!roomId) {
    logger.error('next:page', 'ReportsOfCapsulePage', 'capsuleId missing');
    router.push('/reports');
	return ;
  }
	return (<>
		<ScrollArea>
			<Section>
				<Container >
					<Heading as="h1">{`attendance du ${'date/heure'}`}</Heading>
					<Heading as="h3">{`${'titre capsule'}`}</Heading>
					<Separator my='3'/>
					{
						<Table.Root variant="surface">
						
							<Table.Header>
								<Table.Row>
								<Table.ColumnHeaderCell>Nom</Table.ColumnHeaderCell>
								<Table.ColumnHeaderCell>Prénom</Table.ColumnHeaderCell>
								<Table.ColumnHeaderCell>Heure d'arrivée</Table.ColumnHeaderCell>
								</Table.Row>
							</Table.Header>

							<Table.Body>
							{
								attendanceInfo?.map((attendance, index) => {
									return (
										<Table.Row key={index}>
											<Table.RowHeaderCell>{attendance.first_name}</Table.RowHeaderCell>
											<Table.Cell>{attendance.last_name}</Table.Cell>
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