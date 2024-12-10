"use client";

import { Flex, Heading, Table, Text } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { AttendanceInfoType } from "../page";
import { OptionsMenu } from "../../../_components/OptionsMenu";
import { janifera } from "@/app/(frontend)/Fonts";
import { BackButton } from "@/app/(frontend)/[locale]/_components/BackButton";

export function AttendanceDisplay ({attendances, roomId}: {attendances: AttendanceInfoType[], roomId: string}) {
	const options = ["+ récent", "- récent", "alphabétique", "anti-alphabétique"];
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
			<Flex justify={"between"}>
				<BackButton backTo={`/reports/${roomId}`}/>
				<Text as="div" mb='4' ml="auto">
					<OptionsMenu setOption={setOption} label="Trier par" options={options} />
				</Text>
			</Flex>
			<Table.Root variant="surface">
				<Table.Header>
					<Table.Row>
						<Table.ColumnHeaderCell>Prénom</Table.ColumnHeaderCell>
						<Table.ColumnHeaderCell>Nom</Table.ColumnHeaderCell>
						<Table.ColumnHeaderCell>Heure de connexion</Table.ColumnHeaderCell>
						<Table.ColumnHeaderCell>Signature</Table.ColumnHeaderCell>
					</Table.Row>
				</Table.Header>
				<Table.Body>
				{
					sorted.map((attendance, index) => {
						return (
							<Table.Row key={index}>
								<Table.Cell>
									{attendance.first_name}
								</Table.Cell>
								<Table.Cell>
									{attendance.last_name}
								</Table.Cell>
								<Table.Cell>
									{attendance.connexion}
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