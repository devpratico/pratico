"use client";

import { Button, Card, Flex, Table, Text } from "@radix-ui/themes";
import { useEffect, useRef, useState } from "react";
import { AttendanceInfoType } from "../page";
import { OptionsMenu } from "../../../_components/OptionsMenu";
import { janifera, luciole } from "@/app/(frontend)/Fonts";
import { BackButton } from "@/app/(frontend)/[locale]/_components/BackButton";
import { useFormatter } from "next-intl";
import { useReactToPrint } from "react-to-print";
import { AttendanceToPDF } from "../../_components/AttendanceToPdf";

export function AttendanceDisplay ({attendances, roomId, sessionDate, userInfo, capsuleTitle}:
	{attendances: AttendanceInfoType[], roomId: string, sessionDate: { date: string, end: string | undefined | null }, userInfo: any, capsuleTitle: string}) {
	// const formatter = useFormatter();
	const contentRef = useRef<HTMLDivElement>(null);
	const reactToPrint = useReactToPrint({contentRef});
	// const options = ["+ récent", "- récent", "alphabétique", "anti-alphabétique"];
	// const date = formatter.dateTime(new Date(sessionDate.date), {dateStyle:'short'});
	// const start = formatter.dateTime(new Date(sessionDate.date), {timeStyle:'short'});
	// const dateEnd = sessionDate.end ? formatter.dateTime(new Date(sessionDate.end), {dateStyle: 'short'}) : undefined;
	// const end = sessionDate.end ? formatter.dateTime(new Date(sessionDate.end), {timeStyle: 'short'}) : undefined;
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
			<Flex justify={"between"}>
				<BackButton backTo={`/reports/${roomId}`}/>
				<Button onClick={() => reactToPrint()}>Générer en PDF</Button>
				{/* <OptionsMenu setOption={setOption} label="Trier par" options={options} /> */}
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
			<AttendanceToPDF attendances={sorted} sessionDate={sessionDate} capsuleTitle={capsuleTitle} user={{userInfo}} classnameDiv={luciole.className} ref={contentRef}/>
			
			{/* <Card mt='5' className="hidden-on-screen">
				<div style={{fontSize: '12px', margin: '20px'}} ref={contentRef} className={luciole.className} >
					<p>Pratico</p>
					<h2 style={{ fontSize: '18px', textAlign: 'center', margin: "50px "}}>Fiche de présence</h2>
					<h2 style={{ fontSize: '14px'}}>{`${capsuleTitle !== "Sans titre" ? capsuleTitle : ""}`}</h2>
					{
						sessionDate.date !== "Invalid Date" &&  start !== "Invalid Date"
						? 
							date && start && end
							? 	dateEnd && date !== dateEnd
								? <Text as='div' mb='4'>{`Session du ${date} à ${start} au ${dateEnd} à ${end}`}</Text>
								: <Text as='div' mb='4'>{`Session du ${date} de ${start} à ${end}`}</Text> 
							: <Text as='div' mb='4'>{`${date ? `Session du ${date}` : ""} ${date && start ? ` à ${start}` : ""}`}</Text>
						: <Text as='div' mb='4'></Text>
					}
					{
						userInfo ?
						<>
						{
								userInfo.organization
								? <Text >{`${userInfo.organization} `}</Text>
								: <></>
							}
							<Text as='div'>
								<Text style={{ fontSize: '12px', fontWeight: 'bold'}}>Animateur: </Text>
								<Text >{`${userInfo.first_name}, ${userInfo.last_name}`}</Text>
							</Text>	
							
							<Text as='div' style={{ fontSize: '25px', marginLeft: "20px" }} className={janifera.className}>{`${userInfo.first_name} ${userInfo.last_name}`}</Text>
						</>
						: ""
					}
					
					<Flex style={{ marginTop: '50px'}} justify="between" mt='9' mb='3'>
						<h2 style={{ fontSize: '14px'}}>Émargement</h2>
						<Text> {`Participants: ${attendances.length || "Aucun"}`}</Text>		
					</Flex>

					<table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #cccccc'}}>
						<thead style={{ backgroundColor: 'var(--gray-6)', borderBottom: '2px solid #cccccc' }}>
							<tr>
								<th style={{ maxInlineSize: '200px', padding: '10px', textAlign: 'left', borderBottom: '1px solid  var(--gray-3)'}}>
									<Text ml='1'>Prénom</Text>
								</th>
								<th style={{ maxInlineSize: '200px', padding: '10px', textAlign: 'left', borderBottom: '1px solid  var(--gray-3)'}}>
									<Text ml='1'>Nom</Text>
								</th>
								<th style={{ maxInlineSize: '100px', padding: '10px', textAlign: 'left', borderBottom: '1px solid  var(--gray-3)' }}>
									<Text  ml='1'>{"Heure de connexion"}</Text>
								</th>
								<th style={{ maxInlineSize: '200px', padding: '10px', textAlign: 'left', borderBottom: '1px solid  var(--gray-3)' }}>
									<Text ml='1'>Signature</Text>
								</th>
							</tr>
						</thead>
					
						<tbody style={{backgroundColor: 'white'}}>
							{
								!attendances.length ?
								<tr>
									<td colSpan={4} style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid var(--gray-3)' }}>
										<Text >Aucun participant</Text>
									</td>
								</tr>
								: attendances.map((attendance, index) => (
									<tr className={index === 0 ? "test" : "none"} key={index} style={{ pageBreakInside: 'avoid', borderBottom: '1px solid  var(--gray-3)' }}>
										<td style={{ maxInlineSize: '200px', padding: '10px', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
											<Text ml='1'>{attendance.first_name}</Text>
										</td>
										<td style={{ maxInlineSize: '200px', padding: '10px', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
											<Text ml='1'>{attendance.last_name}</Text>
										</td>
										<td style={{ maxInlineSize: '100px', padding: '10px' }}>
											<Text ml='1'>{attendance.connexion}</Text>
										</td>
										<td style={{ maxInlineSize: '200px', padding: '10px', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
											<Text ml='1' className={janifera.className}>{`${attendance.first_name} ${attendance.last_name}`}</Text>
										</td>
									</tr>
								)
							)}
						</tbody>
					</table>
				</div>
			</Card>	 */}
		</>
	);
};