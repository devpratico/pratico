"use client";
import { Table } from "@radix-ui/themes";
import { TableCell } from "./TableCell";
import { SessionInfoType } from "../[room_id]/page";
import { useFormatter, useTimeZone } from "next-intl";

export function Chronological ({sessions, order}: {sessions: SessionInfoType[], order: boolean}) {
	const formatter = useFormatter();
	const timezone = useTimeZone();
	const sortedSessions = order
		? [...sessions].sort((a, b) => {
			return (new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
		})
		: [...sessions].sort((a, b) => {
		return (new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
	});


	return (
		<Table.Root variant="surface">
			<Table.Header>
				<Table.Row>
					<Table.ColumnHeaderCell>Titre de la capsule</Table.ColumnHeaderCell>
					<Table.ColumnHeaderCell>Date de la session</Table.ColumnHeaderCell>
					<Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
					<Table.ColumnHeaderCell></Table.ColumnHeaderCell>
				</Table.Row>
			</Table.Header>

			<Table.Body>
			{
				sortedSessions?.map((session, index) => {
					return (
						<TableCell
							key={index}
							navigationsIds={{roomId: session.id, nbParticipant: session.numberOfParticipant}}
							infos={{roomClosed: session.status === "closed", title: session.capsule_title || "", date: formatter.dateTime(new Date(session.created_at), {timeZoneName: 'short', timeZone: timezone}), status: session.status === "open" ? "En cours" : "Terminé"}}
						/>
					);
				})
			}
			</Table.Body>
		</Table.Root>
	);
};