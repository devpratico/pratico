"use client";

import { Badge, Flex, Table, Text } from "@radix-ui/themes";
import logger from "@/app/_utils/logger";
import { useEffect, useState } from "react";
import { useRouter } from "@/app/(frontend)/_intl/intlNavigation";
import { User, Users } from "lucide-react";

export type ReportsProps = {
	roomId: string,
	nbParticipant: number
}

export type TableCellProps = {
	roomClosed: boolean,
	title: string,
	date: string,
	status: string, //  "En cours" | "Terminé"
}

export function TableCell ({navigationsIds, infos}: {navigationsIds: ReportsProps, infos: TableCellProps}) {
	const router = useRouter();
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
	return (
		<Table.Row style={{cursor: infos.roomClosed ? 'pointer' : 'default', backgroundColor: isClosed ? 'var(--white-4)': 'var(--gray-3)'}} onClick={handleClick}>
			<Table.RowHeaderCell>{infos.title}</Table.RowHeaderCell>
			<Table.Cell>
					{infos.date}
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
				{
					navigationsIds.nbParticipant > 1
					? <Flex gap="1"><Text>1{navigationsIds.nbParticipant}</Text><Users size="20" /></Flex>
					: <Flex gap="1"><Text>{navigationsIds.nbParticipant}</Text><User size="20" /></Flex>
				}
			</Table.Cell>
		</Table.Row>
	);
};