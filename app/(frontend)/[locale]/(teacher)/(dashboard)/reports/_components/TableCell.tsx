"use client";

import { Badge, Table, Text } from "@radix-ui/themes";
import { useRouter } from "@/app/_intl/intlNavigation";
import logger from "@/app/_utils/logger";
import { useEffect, useState } from "react";
import { janifera } from "@/app/(frontend)/Fonts";

export type ReportsProps = {
	attendanceView: boolean,
	roomId?: string,
}

export type TableCellProps = {
	roomClosed?: boolean,
	rowHeaderCell: string | null | undefined
	cellOne: string | null | undefined,
	cellTwo: string | null | undefined,
	cellThree?: string | undefined
}

export function TableCell ({navigationsIds, infos}: {navigationsIds: ReportsProps, infos: TableCellProps}) {
	const router = useRouter();
	const [ isClosed, setIsClosed ] = useState(infos.roomClosed);
	useEffect(() => {
		setIsClosed(infos.roomClosed);
	  }, [infos.roomClosed]);
	const handleClick = () => {
		if (!navigationsIds.attendanceView && navigationsIds.roomId && infos.roomClosed)
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
		<Table.Row style={{cursor: infos.roomClosed && !navigationsIds.attendanceView ? 'pointer' : 'default', backgroundColor: isClosed ? 'var(--white-4)': 'var(--gray-3)'}} onClick={handleClick}>
			<Table.RowHeaderCell style={{verticalAlign: 'middle'}}>{infos.rowHeaderCell ? infos.rowHeaderCell : ""}</Table.RowHeaderCell>
			<Table.Cell style={{verticalAlign: 'middle'}}>
					{infos.cellOne}
			</Table.Cell>
			<Table.Cell style={{verticalAlign: 'middle'}}>
				{
					infos.cellTwo === "En cours"
					? <Badge color="violet" variant="soft" radius="full">
						{infos.cellTwo}
					</Badge>
					: infos.cellTwo === "Terminé"
						? <Badge color="jade" variant="soft" radius="full">
							{infos.cellTwo}
						</Badge>
						: infos.cellTwo
				}				
			</Table.Cell>
			{
				navigationsIds.attendanceView
				? <Table.Cell style={{verticalAlign: 'middle'}}>
					<Text size='6' className={janifera.className}>{`${infos.rowHeaderCell} ${infos.cellOne}`}</Text>
				</Table.Cell>			
				: ""
			}
		</Table.Row>
	);
};