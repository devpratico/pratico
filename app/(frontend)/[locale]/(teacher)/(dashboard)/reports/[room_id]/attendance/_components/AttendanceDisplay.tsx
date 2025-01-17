"use client";

import { Table } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { AttendanceInfoType } from "../../page";
import { janifera } from "@/app/(frontend)/Fonts";
import { useFormatter } from "next-intl";
import { AttendanceToPDF } from "./AttendanceToPdf";
import logger from "@/app/_utils/logger";

export function AttendanceDisplay ({attendances, roomId, sessionDate, userInfo, capsuleTitle, hideColumnInfo}:
	{attendances: AttendanceInfoType[], roomId: string, sessionDate: { date: string, end: string | undefined | null }, userInfo: any, capsuleTitle: string, hideColumnInfo: boolean}) {
	const formatter = useFormatter();
	const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	logger.log("react:component", "AttendanceDisplay", "timezone", timezone, attendances.length > 0 && attendances[0].connexion);
	// const options = ["+ récent", "- récent", "alphabétique", "anti-alphabétique"];
	const date = formatter.dateTime(new Date(sessionDate.date), {dateStyle:'short'});
	const start = formatter.dateTime(new Date(sessionDate.date), {timeStyle:'short', timeZone: timezone});
	const dateEnd = sessionDate.end ? formatter.dateTime(new Date(sessionDate.end), {dateStyle: 'short'}) : undefined;
	const end = sessionDate.end ? formatter.dateTime(new Date(sessionDate.end), {timeStyle: 'short', timeZone: timezone}) : undefined;
	attendances = attendances.sort((a, b) => {
			const tmpA = a.last_name || '';
			const tmpB = b.last_name || '';
			return (tmpA.localeCompare(tmpB));
		});
	const [ option, setOption ] = useState("alphabétique");
	const [ sorted, setSorted ] = useState<AttendanceInfoType[]>(attendances);

	useEffect(() => {
		switch (option) {
			case "- récent":
				setSorted([...attendances].sort((a, b) => {
					return (a.connexion!.localeCompare(b.connexion!));
				}));
				break ;
			case "+ récent":
				setSorted([...attendances].sort((a, b) => {
					return ((b.connexion!).localeCompare(a.connexion!));
				}));
				break ;
			case "alphabétique":
				setSorted([...attendances].sort((a, b) => {
					return (a.last_name!.localeCompare(b.last_name!));
				}));
				break ;
			default: // anti-alphabétique
				const tmp = [...attendances].sort((a, b) => {
					return (b.last_name!.localeCompare(a.last_name!));
				});
				setSorted(tmp);
		};
	}, [option, attendances]);

	return (
		<>
			<AttendanceToPDF attendances={sorted} sessionDate={{ startDate: date, startTime: start, endDate: dateEnd, endTime: end }}
				capsuleTitle={capsuleTitle} user={{ userInfo }} backTo={`/reports/${roomId}`}
			/>
			<Table.Root variant="surface">
				<Table.Header>
					<Table.Row>
						<Table.ColumnHeaderCell>Prénom</Table.ColumnHeaderCell>
						<Table.ColumnHeaderCell>Nom</Table.ColumnHeaderCell>
						<Table.ColumnHeaderCell hidden={hideColumnInfo}>Information supplémentaire</Table.ColumnHeaderCell>
						<Table.ColumnHeaderCell>Heure de connexion</Table.ColumnHeaderCell>
						<Table.ColumnHeaderCell>Signature</Table.ColumnHeaderCell>
					</Table.Row>
				</Table.Header>
				<Table.Body>
				{
					sorted.map((attendance, index) => {
						const formattedConnection = attendance.connexion ? formatter.dateTime(new Date(attendance.connexion), { timeStyle: 'medium', timeZone: timezone }) : undefined;		

						return (
							<Table.Row key={index}>
								<Table.Cell>
									{attendance.first_name}
								</Table.Cell>
								<Table.Cell>
									{attendance.last_name}
								</Table.Cell>
								<Table.Cell hidden={hideColumnInfo}>
									{attendance.additional_info}
								</Table.Cell>
								<Table.Cell>
									{formattedConnection}
								</Table.Cell>
								<Table.Cell className={janifera.className}>
									{`${attendance.first_name} ${attendance.last_name}`}
								</Table.Cell>
							</Table.Row>
						);
					})
				}
				</Table.Body>
			</Table.Root>
		</>
	);
};