import { Table } from "@radix-ui/themes";
import { SessionInfoType } from "../[capsule_id]/page";
import { TableCell } from "./TableCell";
import logger from "@/app/_utils/logger";
import { formatDate } from "@/app/_utils/utils_functions";

export function Chronological ({sessions, order}: {sessions: SessionInfoType[], order: boolean}) {
	logger.log("react:component", "Chronological", sessions);
	const sortedSessions = order
		? [...sessions].sort((a, b) => {
			return (new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
		})
		: [...sessions].sort((a, b) => {
		return (new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
	});
	return (
		<>
			<Table.Root variant="surface">
				<Table.Header>
					<Table.Row>
						<Table.ColumnHeaderCell>Titre de la capsule</Table.ColumnHeaderCell>
						<Table.ColumnHeaderCell>Date de la session</Table.ColumnHeaderCell>
						<Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
					</Table.Row>
				</Table.Header>

				<Table.Body>
				{
					sortedSessions?.map((session, index) => {
						return (
							<TableCell
								key={index}
								index={index}
								navigationsIds={{capsuleId: session.capsule_id, roomId: session.id}}
								infos={{roomClosed: session.status === "closed", rowHeaderCell: session.capsule_title, cellOne: formatDate(session.created_at), cellTwo: session.status === "open" ? "En cours" : "Terminé"}}
							/>
						);
					})
				}
				</Table.Body>
			</Table.Root>
		</>
	);
};