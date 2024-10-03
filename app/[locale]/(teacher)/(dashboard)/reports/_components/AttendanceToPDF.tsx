"use client";
import { Button, Flex, Heading, Link, Table } from "@radix-ui/themes";
import { TableCell } from "./TableCell";
import { AttendanceInfoType } from "../[room_id]/page";
import { ArrowLeft } from "lucide-react";
import { useEffect, useRef } from "react";
import generatePDF from "react-to-pdf";

export default function AttendanceToPDF ({ attendances, sessionDate, capsuleTitle, roomId }:
	{ attendances: AttendanceInfoType[], sessionDate: string | undefined, capsuleTitle: string, roomId: string }
) {
	const targetRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (targetRef.current) {
		  targetRef.current.style.color = 'black';
		  targetRef.current.style.backgroundColor = 'white';
		  targetRef.current.style.padding = '10px';
		}
	  }, []);
	return (
		<>
			<Flex justify='between'>
				<Button asChild variant="soft">
					<Link href={`/reports`}>
						<ArrowLeft />Retour
					</Link>
				</Button>
				<Button onClick={() => generatePDF(targetRef , {filename: 'emargement.pdf'})}>Générer PDF</Button>
			</Flex>

			<div ref={targetRef} style={{color: '#000000' , backgroundColor: '#FFFFFF', padding: '10px'}} >
				<Heading mb="4" as="h2">{`${capsuleTitle !== "Sans titre" ? capsuleTitle : ""}`}</Heading>
				<Heading ml="3" mb="4" as="h4">{`Emargements${sessionDate ? ` du ${sessionDate}` : ""}`}</Heading>

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
									<TableCell key={index} navigationsIds={{roomId}} infos={{roomClosed: true, rowHeaderCell: attendance.first_name, cellOne: attendance.last_name, cellTwo: attendance.connexion}} />
								);
							})
						}
					</Table.Body>
				</Table.Root>
			</div>
		</>		
	);
};