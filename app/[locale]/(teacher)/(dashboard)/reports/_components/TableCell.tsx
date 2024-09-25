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
	roomOpen?: boolean,
	rowHeaderCell: string | undefined
	cellOne: string | number,
	cellTwo: string
}

export function TableCell ({index, navigationsIds, infos}: {index: number, navigationsIds: ReportsNavigationIDs, infos: TableCellProps}) {
	const router = useRouter();

	const handleClick = () => {
		if (navigationsIds.capsuleId && navigationsIds.roomId && !open)
			router.push(`/reports/${sanitizeUuid(navigationsIds.capsuleId)}/${sanitizeUuid(navigationsIds.roomId)}`);
		else if (navigationsIds.capsuleId && !navigationsIds.roomId)
			router.push(`/reports/${sanitizeUuid(navigationsIds.capsuleId)}`);
		else
		{
			if (!navigationsIds.capsuleId)
				logger.error("next:page", "CapsuleSessionReportPage", "handle click error: capsuleId");
			if (infos.roomOpen)
				logger.log("next:page", "CapsuleSessionReportPage", "handle click: The session is already opened");
		}
	};
	return (
		<Table.Row key={index} style={{cursor: infos.roomOpen ? 'default': 'pointer', backgroundColor: infos.roomOpen ? '#E0E0E0': 'none'}} onClick={handleClick}>
			<Table.RowHeaderCell>{infos.rowHeaderCell ? infos.rowHeaderCell : ""}</Table.RowHeaderCell>
			<Table.Cell>{infos.cellOne}</Table.Cell>
			<Table.Cell>{infos.cellTwo}</Table.Cell> 
		</Table.Row>
	);
};