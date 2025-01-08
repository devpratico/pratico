"use client";

import { Badge, Table, Text } from "@radix-ui/themes";
import logger from "@/app/_utils/logger";
import { useEffect, useState } from "react";
import { useRouter } from "@/app/(frontend)/_intl/intlNavigation";
import { RemoveReportAlertDialog } from "./RemoveReportAlertDialog";
import createClient from "@/supabase/clients/client";
import { Radio } from "lucide-react";

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

export function TableRow ({navigationsIds, infos, onDelete}: {navigationsIds: ReportsProps, infos: TableCellProps, onDelete: (roomId: string) => void,}) {
	const router = useRouter();
	const supabase = createClient();
	const [ isClosed, setIsClosed ] = useState(infos.roomClosed);
	const [ deleteOk, setDeleteOk ] = useState(false);
	const roomOpen = infos.status === "en cours";

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

	useEffect(() => {
		const handleRemoveReport = async () => {
			logger.log("next:page", "CapsuleSessionReportPage", "handleRemoveReport: remove report");
			if (deleteOk)
			{
				await supabase.from('rooms').delete().eq('id', navigationsIds.roomId);
				onDelete(navigationsIds.roomId);
				setDeleteOk(false);
			};
		};
		if (deleteOk)
			handleRemoveReport();
	}, [deleteOk, navigationsIds.roomId, onDelete, supabase]);

	return (
		<Table.Row style={{cursor: infos.roomClosed ? 'pointer' : 'default', backgroundColor: isClosed ? 'var(--white-4)': 'var(--gray-3)'}} onClick={handleClick}>
			<Table.RowHeaderCell>{infos.title}</Table.RowHeaderCell>
			<Table.Cell >
				<Text color="gray">{infos.date}</Text>
			</Table.Cell>
			<Table.Cell>
				{
					roomOpen
					? <Badge color="red" variant="soft" radius="full">
						<Radio size="15" />{infos.status}
					</Badge>
					: <Badge color="gray" variant="soft" radius="full">
						{infos.status}
					</Badge>
				}				
			</Table.Cell>
			<Table.Cell align="center">
				<Text>{navigationsIds.nbParticipant}</Text>
			</Table.Cell>
			<Table.Cell justify="end" onClick={(e) => e.stopPropagation()}>	
				<RemoveReportAlertDialog roomOpen={roomOpen} date={infos.date} setDeleteOk={setDeleteOk} />
			</Table.Cell>
		</Table.Row>
	);
};