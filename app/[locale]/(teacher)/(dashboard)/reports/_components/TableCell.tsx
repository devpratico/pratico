"use client";

import { Badge, Table } from "@radix-ui/themes";
import { useRouter } from "@/app/_intl/intlNavigation";
import logger from "@/app/_utils/logger";
import { useEffect, useState } from "react";

export type ReportsNavigationIDs = {
	capsuleId?: string,
	roomId?: string,
}

export type TableCellProps = {
	roomClosed?: boolean,
	rowHeaderCell: string | null | undefined
	cellOne: string | null | undefined,
	cellTwo: string | null | undefined,
}

export function TableCell ({navigationsIds, infos}: {navigationsIds: ReportsNavigationIDs, infos: TableCellProps}) {
	const router = useRouter();
	const [ isClosed, setIsClosed ] = useState(infos.roomClosed);
	useEffect(() => {
		setIsClosed(infos.roomClosed);
	  }, [infos.roomClosed]);
	const handleClick = () => {
		if (navigationsIds.capsuleId && navigationsIds.roomId && infos.roomClosed)
			router.push(`/reports/${navigationsIds.roomId}`);
		else
		{
			if (!(navigationsIds.capsuleId && navigationsIds.roomId))
				logger.error("next:page", "CapsuleSessionReportPage", "handle click error: capsuleId or roomId missing");
			if (!infos.roomClosed)
				logger.log("next:page", "CapsuleSessionReportPage", "handle click: The session is already opened");
		}
	};
	return (
		<Table.Row style={{cursor: infos.roomClosed ? 'pointer' : 'default', backgroundColor: isClosed ? 'var(--white-4)': 'var(--gray-3)'}} onClick={handleClick}>
			<Table.RowHeaderCell>{infos.rowHeaderCell ? infos.rowHeaderCell : ""}</Table.RowHeaderCell>
			<Table.Cell>{infos.cellOne}</Table.Cell>
			<Table.Cell>
				{
					infos.cellTwo 
					? infos.cellTwo === "En cours"
						? <Badge color="violet" variant="soft" radius="full">
							{infos.cellTwo}
						</Badge>
						: infos.cellTwo === "Terminé"
							? <Badge color="jade" variant="soft" radius="full">
								{infos.cellTwo}
							</Badge>
							: infos.cellTwo
					: ""
				}
			</Table.Cell> 
		</Table.Row>
	);
};