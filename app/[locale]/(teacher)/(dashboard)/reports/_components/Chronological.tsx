import { Heading, Table } from "@radix-ui/themes";
import { SessionInfoType } from "../[capsule_id]/page";
import { TableCell } from "./TableCell";
import logger from "@/app/_utils/logger";
import { formatDate } from "@/app/_utils/utils_functions";

export function Chronological ({sessions, order}: {sessions: SessionInfoType[], order: boolean}) {
	logger.log("react:component", "Chronological", sessions);
	const antechronoSessions = [...sessions].sort((a, b) => {
		return (new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
	});
	return (
		<>
			<Heading mb='4' as='h1'>Rapports par {order ? "ordre chronologique" : "ordre antéchronologique"}</Heading>
			<Table.Root variant="surface">
				<Table.Header>
					<Table.Row>
					<Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
					<Table.ColumnHeaderCell>Nombre de participants</Table.ColumnHeaderCell>
					<Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
					</Table.Row>
				</Table.Header>

				<Table.Body>
				{
					order
					?	sessions?.map((session, index) => {
							return (
								<TableCell
									key={index}
									index={index}
									navigationsIds={{capsuleId: session.capsule_id, roomId: session.id}}
									infos={{roomClosed: true, rowHeaderCell: formatDate(session.created_at), cellOne: session.numberOfParticipant.toString(), cellTwo: session.status === "open" ? "En cours" : "Terminé"}}
								/>
							);
						})
					: 	antechronoSessions.map((session, index) => {
							return (
								<TableCell
									key={index}
									index={index}
									navigationsIds={{capsuleId: session.capsule_id, roomId: session.id}}
									infos={{roomClosed: true, rowHeaderCell: formatDate(session.created_at), cellOne: session.numberOfParticipant.toString(), cellTwo: session.status === "open" ? "En cours" : "Terminé"}}
								/>
							);
						})
				}
				</Table.Body>
			</Table.Root>
		</>
	);
};