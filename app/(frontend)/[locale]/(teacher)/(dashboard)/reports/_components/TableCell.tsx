"use client";

import { Badge, IconButton, Table, Text } from "@radix-ui/themes";
import logger from "@/app/_utils/logger";
import { useEffect, useState } from "react";
import { useRouter } from "@/app/(frontend)/_intl/intlNavigation";
import { Trash2 } from "lucide-react";
import { useFormatter } from "next-intl";
import createClient from "@/supabase/clients/client";

export type ReportsProps = {
	roomId: string,
	nbParticipant: number,
}

export type TableCellProps = {
	roomClosed: boolean,
	title: string,
	date: string,
	status: string, //  "En cours" | "Terminé"
}

export function TableCell ({navigationsIds, infos, onDelete}: {navigationsIds: ReportsProps, infos: TableCellProps, onDelete: (roomId: string) => void,}) {
	const router = useRouter();
	const formatter = useFormatter();
	const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	const supabase = createClient();
	const [ isClosed, setIsClosed ] = useState(infos.roomClosed);

	useEffect(() => {
		setIsClosed(infos.roomClosed);
	  }, [infos.roomClosed]);

	const handleClick = () => {
		if (navigationsIds.roomId && infos.roomClosed)
			router.push(`/reports/${navigationsIds.roomId}`);
		else
		{
			if (!navigationsIds.roomId)
				logger.error("next:page", "CapsuleSessionReportPage", "handle click error: roomId missing");
			if (!infos.roomClosed)
				logger.log("next:page", "CapsuleSessionReportPage", "handle click: The session is already opened");
		}
	};

	const handleRemoveReport = async (e: React.MouseEvent) => {
		e.stopPropagation();
		logger.log("next:page", "CapsuleSessionReportPage", "handleRemoveReport: remove report");
		await supabase.from('rooms').delete().eq('id', navigationsIds.roomId);
		onDelete(navigationsIds.roomId);
	};

	return (
		<Table.Row style={{cursor: infos.roomClosed ? 'pointer' : 'default', backgroundColor: isClosed ? 'var(--white-4)': 'var(--gray-3)'}} onClick={handleClick}>
			<Table.RowHeaderCell>{infos.title}</Table.RowHeaderCell>
			<Table.Cell>
				{formatter.dateTime(new Date(infos.date), { dateStyle: 'short', timeStyle: 'short', timeZone: timezone})}
			</Table.Cell>
			<Table.Cell>
				{
					infos.status === "En cours"
					? <Badge color="violet" variant="soft" radius="full">
						{infos.status}
					</Badge>
					: <Badge color="jade" variant="soft" radius="full">
							{infos.status}
					</Badge>
				}				
			</Table.Cell>
			<Table.Cell>
				<Text>{navigationsIds.nbParticipant}</Text>
			</Table.Cell>
			<Table.Cell style={{ display: 'flex', justifyContent: 'flex-end', gap: '2' }}>	
				<IconButton onClick={handleRemoveReport} variant="ghost">
					<Trash2 size="20" />
				</IconButton>
			</Table.Cell>
		</Table.Row>
	);
};