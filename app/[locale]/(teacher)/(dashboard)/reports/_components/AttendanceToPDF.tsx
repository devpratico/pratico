"use client";
import { Button, Flex, Heading, Link, Text } from "@radix-ui/themes";
import { AttendanceInfoType } from "../[room_id]/page";
import { ArrowLeft } from "lucide-react";
import { usePDF } from "react-to-pdf";
import { janifera } from "@/app/Fonts";

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

			<div ref={targetRef} >
				<Heading mb="4" as="h2">{`${capsuleTitle !== "Sans titre" ? capsuleTitle : ""}`}</Heading>
				<Heading ml="3" mb="4" as="h4">{`Emargements${sessionDate ? ` du ${sessionDate}` : ""}`}</Heading>

				<table style={{ width: '100%', borderCollapse: 'collapse' }}>
					<thead style={{ backgroundColor: '#f0f0f0', borderBottom: '2px solid #ddd' }}>
						<tr>
						<th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>
							<Text>Prénom</Text>
						</th>
						<th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>
							<Text>Nom</Text>
						</th>
						<th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>
							<Text>{"Heure d'arrivée"}</Text>
						</th>
						<th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>
							<Text>Signature</Text>
						</th>
						</tr>
					</thead>
					<tbody>
						{!attendances.length ? (
						<tr>
							<td colSpan={4} style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>
								<Text>Aucun participant</Text>
							</td>
						</tr>
						) : (
							attendances.map((attendance, index) => (
								<tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
									<td style={{ padding: '8px' }}>
										<Text>{attendance.first_name}</Text>
									</td>
									<td style={{ padding: '8px' }}>
										<Text>{attendance.last_name}</Text>
									</td>
									<td style={{ padding: '8px' }}>
										<Text>{attendance.connexion}</Text>
									</td>
									<td style={{ padding: '8px' }}>
										<Text className={janifera.className}>{`${attendance.first_name} ${attendance.last_name}`}</Text>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</>		
	);
};