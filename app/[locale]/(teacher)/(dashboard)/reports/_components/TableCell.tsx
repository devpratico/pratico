"use client";

import { Badge, Table } from "@radix-ui/themes";
import { sanitizeUuid } from "@/app/_utils/utils_functions";
import { useRouter } from "@/app/_intl/intlNavigation";
import logger from "@/app/_utils/logger";


export type ReportsNavigationIDs = {
	capsuleId?: string,
	roomId?: string,
}

export type TableCellProps = {
	roomClosed?: boolean,
	rowHeaderCell: string | null | undefined
	cellOne: string | null | undefined,
	cellTwo: string | null | undefined,
	title?: string | null | undefined;
}

export function TableCell ({index, navigationsIds, infos}: {index: number, navigationsIds: ReportsNavigationIDs, infos: TableCellProps}) {
	const router = useRouter();

	const handleClick = () => {
		logger.debug("react:component", "TableCell", navigationsIds, infos);
		if (navigationsIds.capsuleId && navigationsIds.roomId && infos.roomClosed)
			router.push(`/reports/${sanitizeUuid(navigationsIds.capsuleId)}/${navigationsIds.roomId}`);
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
			{
				infos.title
				?  infos.title === "Sans titre"
					? <Table.Cell>{"Capsule sans titre"}</Table.Cell>
					: <Table.Cell>{infos.title}</Table.Cell>
				: null
			}
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