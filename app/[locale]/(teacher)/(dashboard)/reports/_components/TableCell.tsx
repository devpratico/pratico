"use client";

import { Table } from "@radix-ui/themes";
import { sanitizeUuid } from "@/app/_utils/utils_functions";
import { useRouter } from "@/app/_intl/intlNavigation";
import logger from "@/app/_utils/logger";


export type ReportsNavigationIDs = {
	capsuleId: string,
	roomId?: string,
}

export type TableCellProps = {
	roomClosed?: boolean,
	rowHeaderCell: string | null | undefined
	cellOne: string | null,
	cellTwo: string | null
}

export function TableCell ({index, navigationsIds, infos}: {index: number, navigationsIds: ReportsNavigationIDs, infos: TableCellProps}) {
	const router = useRouter();

	const handleClick = () => {
		if (navigationsIds.capsuleId && navigationsIds.roomId && infos.roomClosed)
			router.push(`/reports/${sanitizeUuid(navigationsIds.capsuleId)}/${sanitizeUuid(navigationsIds.roomId)}`);
		else
		{
			if (!(navigationsIds.capsuleId && navigationsIds.roomId))
				logger.error("next:page", "CapsuleSessionReportPage", "handle click error: capsuleId or roomId missing");
			if (!infos.roomClosed)
				logger.log("next:page", "CapsuleSessionReportPage", "handle click: The session is already opened");
		}
	};
	return (
		<Table.Row key={index} style={{cursor: infos.roomClosed ? 'pointer' : 'default', backgroundColor: infos.roomClosed ? 'none': '#E0E0E0'}} onClick={handleClick}>
			<Table.RowHeaderCell>{infos.rowHeaderCell ? infos.rowHeaderCell : ""}</Table.RowHeaderCell>
			<Table.Cell>{infos.cellOne}</Table.Cell>
			<Table.Cell>{infos.cellTwo}</Table.Cell> 
		</Table.Row>
	);
};