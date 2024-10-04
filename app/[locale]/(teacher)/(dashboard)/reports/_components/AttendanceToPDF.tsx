"use client";
import { Button, Flex, Heading, Link, Text, Table, Theme, Box } from "@radix-ui/themes";
import { AttendanceInfoType } from "../[room_id]/page";
import { ArrowLeft } from "lucide-react";
import { usePDF } from "react-to-pdf";
import { janifera } from "@/app/Fonts";
import { TableCell } from "./TableCell";
import "@radix-ui/themes/styles.css";

export default function AttendanceToPDF ({ attendances, sessionDate, capsuleTitle, roomId }:
	{ attendances: AttendanceInfoType[], sessionDate: string | undefined, capsuleTitle: string, roomId: string }
) {
	const { toPDF, targetRef } = usePDF({filename: "emargement.pdf"});

	return (
		<>
			<Flex justify='between'>
				<Button asChild variant="soft">
					<Link href={`/reports`}>
						<ArrowLeft />Retour
					</Link>
				</Button>
				<Button onClick={() => toPDF()}>Générer PDF</Button>
			</Flex>
			{/* <Heading style={{textAlign: 'right'}} mt="4" mb="3">{`${capsuleTitle !== "Sans titre" ? capsuleTitle : ""}`}</Heading>
			<Heading as="h6" style={{textAlign: 'right'}} mb="4">{`Emargements${sessionDate ? ` du ${sessionDate}` : ""}`}</Heading>
			<Table.Root variant="surface">
				
				<Table.Header>
					<Table.Row>
						<Table.ColumnHeaderCell>Prénom</Table.ColumnHeaderCell>
						<Table.ColumnHeaderCell>Nom</Table.ColumnHeaderCell>
						<Table.ColumnHeaderCell>{"Heure d'arrivée"}</Table.ColumnHeaderCell>
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
								<TableCell key={index} navigationsIds={{attendanceView: true, roomId}} infos={{roomClosed: true, rowHeaderCell: attendance.first_name, cellOne: attendance.last_name, cellTwo: attendance.connexion}} />
							);
						})
					}
				</Table.Body>
			</Table.Root> */}

			<div ref={targetRef}>
			{/* <div ref={targetRef} style={{display: 'none'}}> */}

				<Heading style={{textAlign: 'right'}} mt="4" mb="3" >{`${capsuleTitle !== "Sans titre" ? capsuleTitle : ""}`}</Heading>
				<Heading style={{textAlign: 'right'}} mb="4">{`Emargements${sessionDate ? ` du ${sessionDate}` : ""}`}</Heading>
				{/* <Table.Root style={{color: 'black', backgroundColor: 'white'}} variant="surface">
				<Table.Header style={{color: 'black'}}>
					<Table.Row style={{color: 'black'}}>
						<Table.ColumnHeaderCell style={{color: 'black'}}>Prénom</Table.ColumnHeaderCell>
						<Table.ColumnHeaderCell style={{color: 'black'}}>Nom</Table.ColumnHeaderCell>
						<Table.ColumnHeaderCell style={{color: 'black'}}>{"Heure d'arrivée"}</Table.ColumnHeaderCell>
						<Table.ColumnHeaderCell style={{color: 'black'}}>Signature</Table.ColumnHeaderCell>
					</Table.Row>
				</Table.Header>
				<Table.Body style={{color: 'black !important', backgroundColor: 'white !important'}}>
					{
						!attendances.length
						? <Table.Row style={{color: 'black'}}>
							<Table.Cell style={{color: 'black'}}>
								Aucun participant
							</Table.Cell>
						</Table.Row>
						: attendances?.map((attendance, index) => {
							return (
								<TableCell key={index} navigationsIds={{attendanceView: true, roomId}} infos={{roomClosed: true, rowHeaderCell: attendance.first_name, cellOne: attendance.last_name, cellTwo: attendance.connexion}} />
							);
						})
					}
				</Table.Body>
				</Table.Root> */}
				<table style={{ backgroundColor: 'white', width: '100%', borderRadius: '0.9%', borderCollapse: 'separate', borderSpacing: '0', overflow: 'hidden', border: '1px solid var(--gray-6)'}}>
					<thead style={{ backgroundColor: 'var(--gray-3)', borderBottom: '2px solid var(--gray-6)', borderRadius: '30%' }}>
						<tr>
						<th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid var(--gray-3)' }}>
							<Text ml='1'>Prénom</Text>
						</th>
						<th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid var(--gray-3)' }}>
							<Text ml='1'>Nom</Text>
						</th>
						<th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid var(--gray-3)' }}>
							<Text ml='1'>{"Heure d'arrivée"}</Text>
						</th>
						<th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid var(--gray-3)' }}>
							<Text ml='1'>Signature</Text>
						</th>
						</tr>
					</thead>
					<tbody>
						{
							!attendances.length ? (
							<tr>
								<td colSpan={4} style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid var(--gray-3)' }}>
									<Text>Aucun participant</Text>
								</td>
							</tr>
							) : (
								attendances.map((attendance, index) => (
									<tr key={index} style={{ borderBottom: '1px solid var(--gray-3)' }}>
										<td style={{ padding: '10px' }}>
											<Text ml='1'>{attendance.first_name}</Text>
										</td>
										<td style={{ padding: '10px' }}>
											<Text ml='1'>{attendance.last_name}</Text>
										</td>
										<td style={{ padding: '10px' }}>
											<Text ml='1'>{attendance.connexion}</Text>
										</td>
										<td style={{ padding: '10px' }}>
											<Text ml='1' className={janifera.className}>{`${attendance.first_name} ${attendance.last_name}`}</Text>
										</td>
									</tr>
								)
							)
						)}
					</tbody>
				</table>
			</div>
		</>		
	);
};