"use client";

import { Table } from "@radix-ui/themes";
import { TableCell } from "./TableCell";
import { SessionInfoType } from "../[room_id]/page";
import { Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useFormatter } from "next-intl";
import { useRouter } from "@/app/(frontend)/_intl/intlNavigation";

export function Chronological ({sessions, order}: {sessions: SessionInfoType[], order: boolean}) {
	const router = useRouter();
	const formatter = useFormatter();
	const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	const [ reports, setReports ] = useState<SessionInfoType[]>(sessions);
	const sortedSessions = order
		? [...reports].sort((a, b) => {
			return (new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
		})
		: [...reports].sort((a, b) => {
		return (new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
	});

	useEffect(() => {
		if (sortedSessions.length === 0)
		{
			router.refresh();
		}
	}, [sortedSessions, router]);

	return (
		<Table.Root variant="surface">
			<Table.Header>
				<Table.Row>
					<Table.ColumnHeaderCell>Titre de la capsule</Table.ColumnHeaderCell>
					<Table.ColumnHeaderCell>Début de la session</Table.ColumnHeaderCell>
					<Table.ColumnHeaderCell>Statut</Table.ColumnHeaderCell>
					<Table.ColumnHeaderCell><Users size="21" /></Table.ColumnHeaderCell>
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
							infos={{roomClosed: session.status === "closed", title: session.capsule_title || "", date: formatter.dateTime(new Date(session.created_at), { dateStyle: 'short', timeStyle: 'short', timeZone: timezone}), status: session.status === "open" ? "En cours" : "Terminé"}}
							onDelete={(roomId) => setReports(reports.filter((r) => r.id !== roomId))}
						/>
					);
				})
			}
			</Table.Body>
		</Table.Root>
	);
};