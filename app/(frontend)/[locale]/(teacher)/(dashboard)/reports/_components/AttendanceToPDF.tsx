"use client";
import { Button, Flex, Heading, Link, Table, Text } from "@radix-ui/themes";
import { AttendanceInfoType } from "../[room_id]/page";
import { ArrowLeft } from "lucide-react";
import { janifera, luciole } from "@/app/Fonts";
import { formatDate } from "@/app/_utils/utils_functions";
import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { TableCell } from "./TableCell";
/// TYPE
export type TeacherInfo = {
	first_name: string,
	last_name: string,
}
export default function AttendanceToPDF ({ attendances, sessionDate, capsuleTitle, user: { userInfo, roomId} }:
	{ attendances: AttendanceInfoType[], sessionDate: string | undefined, capsuleTitle: string, user: { userInfo: TeacherInfo | null, roomId?: string}}
) {
	const [ sortedAttendances, setSortedAttendances ] = useState<AttendanceInfoType[]>();
	const date = formatDate(sessionDate, undefined, "date");
	const hour = formatDate(sessionDate, undefined, "hour");
	const contentRef = useRef<HTMLDivElement>(null);
	const reactToPrint = useReactToPrint({contentRef})

	useEffect(() => {
		const getAttendancesList = () => {
			if (!sortedAttendances)
				setSortedAttendances(attendances.sort((a, b) => {
					const tmpA = a.last_name || '';
					const tmpB = b.last_name || '';
					return (tmpA.localeCompare(tmpB));
				}));
		}
		getAttendancesList();
	}, [attendances, sortedAttendances]);

	
	return (
		<>
			{/* <style>
			{`
				@media print {
					body
					{
						visibility: hidden;
						margin:0;
						padding: 0;
					}
					.print-only
					{
						visibility: visible;
						display: block;
						// position: fixed;
						top: 0;
						left: 0;
						width: 100%;
						height: 100%;
					 	background-color: white;
        				z-index: 1000;
					}
				}
			`}
		</style>
		<div className='no-print'>
			<Flex justify='between'>
				<Button asChild variant="soft">
					<Link href={`/reports`}>
						<ArrowLeft />Retour
					</Link>
				</Button>
				<Button mr="8" onClick={() => reactToPrint()}>
					Générer PDF
				</Button>
			</Flex>
		
			<div style={{fontSize: '12px', margin: '20px 100px'}} ref={contentRef} className={luciole.className} >
				{/* <Text>Pratico</Text>
				<Heading as='h1' style={{textAlign: 'center', margin: "50px "}}>Rapport de Session</Heading>
				<Heading mb="4" as="h2">{`${capsuleTitle !== "Sans titre" ? capsuleTitle : ""}`}</Heading>
					<Heading style={{color: "var(--gray-8)"}} ml="3" mb="4" as="h4">{`${date ? `Session du ${date}` : ""} ${date && hour ? ` à ${hour}` : ""}`}</Heading>
					{
						userInfo ?
						<>
							<Heading as="h4">{`Animateur: ${userInfo?.first_name} ${userInfo?.last_name}`}</Heading>
							<Heading as="h1" style={{ marginLeft: "20px", marginBottom: "50px"}} className={janifera.className}>{`${userInfo.first_name} ${userInfo.last_name}`}</Heading>
						</>

						: ""
					}
					<Flex mt='9' mb='3' justify='between'>
						<Heading as="h4">Émargement</Heading>
						<Text> {`Participants: ${attendances.length || "Aucun"}`}</Text>		
					</Flex>

					<Table.Root variant="surface">
						
						<Table.Header>
							<Table.Row style={{ maxInlineSize: '100px', padding: '10px' }}>
								<Table.ColumnHeaderCell>Prénom</Table.ColumnHeaderCell>
								<Table.ColumnHeaderCell>Nom</Table.ColumnHeaderCell>
								<Table.ColumnHeaderCell  maxWidth={'100px'}>{"Heure d'arrivée"}</Table.ColumnHeaderCell>
								<Table.ColumnHeaderCell>Signature</Table.ColumnHeaderCell>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{
								!attendances.length
								? <Table.Row>
									<Table.Cell>
										Aucun participant
									</Table.Cell>
								</Table.Row>
								: attendances?.map((attendance, index) => {
									return (
										<Table.Row style={{ maxInlineSize: '100px', padding: '10px' }} key={index}>
											<Table.Cell maxWidth={'300px'} style={{wordBreak: 'break-word', overflowWrap: 'break-word'}}>
												{attendance.first_name}
											</Table.Cell>
											<Table.Cell  maxWidth={'300px'} style={{wordBreak: 'break-word', overflowWrap: 'break-word'}}>
												{attendance.last_name}
											</Table.Cell>
											<Table.Cell  maxWidth={'100px'}>
												{attendance.connexion}
											</Table.Cell>
											<Table.Cell  maxWidth={'300px'} className={janifera.className}>
												{`${attendance.first_name} ${attendance.last_name}`}
											</Table.Cell>
										</Table.Row>
											// <TableCell key={index} navigationsIds={{attendanceView: true, roomId}} infos={{roomClosed: true, rowHeaderCell: attendance.first_name, cellOne: attendance.last_name, cellTwo: attendance.connexion}} />
										);
									})
								}
						</Table.Body>
					</Table.Root> */}
				<p>Pratico</p>
				<h1 style={{ textAlign: 'center', margin: "50px "}}>Rapport de Session</h1>
				<h2>{`${capsuleTitle !== "Sans titre" ? capsuleTitle : ""}`}</h2>
				<h3 style={{color: "var(--gray-8)"}}>{`${date ? `Session du ${date}` : ""} ${date && hour ? ` à ${hour}` : ""}`}</h3>
				{
					userInfo ?
					userInfo ?
					<>
						<h4>{`Animateur: ${userInfo?.first_name} ${userInfo?.last_name}`}</h4>
						<h1 style={{ marginLeft: "20px", marginBottom: "50px"}} className={janifera.className}>{`${userInfo.first_name} ${userInfo.last_name}`}</h1>
					</>

					: ""
				}
				<Flex justify="between" mt='9' mb='3'>
					<h2>Émargement</h2>
					<Text> {`Participants: ${attendances.length || "Aucun"}`}</Text>		
				</Flex>

				<table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #cccccc'}}>
					<thead style={{ backgroundColor: 'var(--gray-6)', borderBottom: '2px solid #cccccc' }}>
					<thead style={{ backgroundColor: 'var(--gray-6)', borderBottom: '2px solid #cccccc' }}>
						<tr>
						<th style={{ maxInlineSize: '200px', padding: '10px', textAlign: 'left', borderBottom: '1px solid  var(--gray-3)'}}>
							<Text ml='1'>Prénom</Text>
						</th>
						<th style={{ maxInlineSize: '200px', padding: '10px', textAlign: 'left', borderBottom: '1px solid  var(--gray-3)'}}>
							<Text ml='1'>Nom</Text>
						</th>
						<th style={{ maxInlineSize: '100px', padding: '10px', textAlign: 'left', borderBottom: '1px solid  var(--gray-3)' }}>
							<Text  ml='1'>{"Heure d'arrivée"}</Text>
						</th>
						<th style={{ maxInlineSize: '200px', padding: '10px', textAlign: 'left', borderBottom: '1px solid  var(--gray-3)' }}>
							<Text ml='1'>Signature</Text>
						</th>
						</tr>
					</thead>
				
					<tbody style={{backgroundColor: 'white'}}>
						{
							!sortedAttendances || !sortedAttendances.length ?
							<tr>
								<td colSpan={4} style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid var(--gray-3)' }}>
								<td colSpan={4} style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid var(--gray-3)' }}>
									<Text >Aucun participant</Text>
								</td>
							</tr>
							: sortedAttendances.map((attendance, index) => (
								<tr className={index === 0 ? "test" : "none"} key={index} style={{ borderBottom: '1px solid  var(--gray-3)' }}>
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
			<style jsx global>{`
				@media print {
					@page {
						margin: 10mm 30mm;
					}
				}
			`}</style>
		</>		
	);
};
