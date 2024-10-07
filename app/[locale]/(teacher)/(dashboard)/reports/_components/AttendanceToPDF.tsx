"use client";
import { Button, Flex, Link, Text } from "@radix-ui/themes";
import { AttendanceInfoType } from "../[room_id]/page";
import { ArrowLeft } from "lucide-react";
import generatePDF, { usePDF } from "react-to-pdf";
import { janifera } from "@/app/Fonts";
import { formatDate } from "@/app/_utils/utils_functions";
import { useEffect, useState } from "react";

/// TYPE
export type TeacherInfo = {
	first_name: string,
	last_name: string,
}
export default function AttendanceToPDF ({ attendances, sessionDate, capsuleTitle, user }:
	{ attendances: AttendanceInfoType[], sessionDate: string | undefined, capsuleTitle: string, user: TeacherInfo | null}
) {
	const { targetRef } = usePDF({filename: `emargement_${capsuleTitle && capsuleTitle !== "Sans titre" ? capsuleTitle : null}_${formatDate(sessionDate, undefined, "date") || null}.pdf`});
	const [ sortedAttendances, setSortedAttendances ] = useState<AttendanceInfoType[]>();
	const date = formatDate(sessionDate, undefined, "date");
	const hour = formatDate(sessionDate, undefined, "hour");

	useEffect(() => {
		const getAttendancesList = () => {
			setSortedAttendances(attendances.sort((a, b) => {
				const tmpA = a.last_name || '';
				const tmpB = b.last_name || '';
				return (tmpA.localeCompare(tmpB));
			}));
		}
		getAttendancesList();
	}, [attendances]);

	
	return (
		<>
			<Flex justify='between'>
				<Button asChild variant="soft">
					<Link href={`/reports`}>
						<ArrowLeft />Retour
					</Link>
				</Button>
				<Button mr="8" onClick={() => generatePDF(targetRef, {method: 'open'})}>Générer PDF</Button>
			</Flex>

			<div ref={targetRef}>
			<div  style={{margin: "50px 50px"}} >
				<Text>Pratico</Text>
				<h1 style={{textAlign: 'center', margin: "50px "}}>Rapport de Session</h1>
				<h2>{`${capsuleTitle !== "Sans titre" ? capsuleTitle : ""}`}</h2>
				<h3 style={{color: "var(--gray-8)"}}>{`${date ? `Session du ${date}` : ""} ${date && hour ? ` à ${hour}` : ""}`}</h3>
				{
					user ?
					<h4 style={{marginBottom: "50px"}}>{`Animateur: ${user?.first_name} ${user?.last_name}`}</h4>
					: ""
				}
				<Flex justify="between" mb='3'>
					<h2>Émargement</h2>
					<Text>{`Participants: ${attendances.length || "Aucun"}`}</Text>		
				</Flex>

				<table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid var(--gray-6)'}}>
					<thead style={{ backgroundColor: 'var(--gray-3)', borderBottom: '2px solid var(--gray-6)' }}>
						<tr>
						<th style={{  maxInlineSize: '200px', padding: '10px', textAlign: 'left', borderBottom: '1px solid var(--gray-3)' }}>
							<Text ml='1'>Prénom</Text>
						</th>
						<th style={{ maxInlineSize: '200px', padding: '10px', textAlign: 'left', borderBottom: '1px solid var(--gray-3)' }}>
							<Text ml='1'>Nom</Text>
						</th>
						<th style={{ maxInlineSize: '100px', padding: '10px', textAlign: 'left', borderBottom: '1px solid var(--gray-3)' }}>
							<Text ml='1'>{"Heure d'arrivée"}</Text>
						</th>
						<th style={{ maxInlineSize: '200px', padding: '10px', textAlign: 'left', borderBottom: '1px solid var(--gray-3)' }}>
							<Text ml='1'>Signature</Text>
						</th>
						</tr>
					</thead>
					<tbody style={{backgroundColor: 'white'}}>
						{
							!sortedAttendances || !sortedAttendances.length ?
							<tr>
								<td colSpan={4} style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid var(--gray-3)' }}>
									<Text>Aucun participant</Text>
								</td>
							</tr>
							: sortedAttendances.map((attendance, index) => (
								<tr key={index} style={{ borderBottom: '1px solid var(--gray-3)' }}>
									<td style={{ maxInlineSize: '200px', padding: '10px' }}>
										<Text ml='1'>{attendance.first_name}</Text>
									</td>
									<td style={{ maxInlineSize: '200px', padding: '10px' }}>
										<Text ml='1'>{attendance.last_name}</Text>
									</td>
									<td style={{ maxInlineSize: '100px', padding: '10px' }}>
										<Text ml='1'>{attendance.connexion}</Text>
									</td>
									<td style={{ maxInlineSize: '200px', padding: '10px' }}>
										<Text ml='1' className={janifera.className}>{`${attendance.first_name} ${attendance.last_name}`}</Text>
									</td>
								</tr>
							)
						)}
					</tbody>
				</table>
			</div>
			</div>
		</>		
	);
};