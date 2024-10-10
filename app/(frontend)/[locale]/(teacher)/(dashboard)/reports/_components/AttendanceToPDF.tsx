"use client";
import { Button, Card, Flex, Link, Text } from "@radix-ui/themes";
import { AttendanceInfoType } from "../[room_id]/page";
import { ArrowLeft } from "lucide-react";
import { formatDate } from "@/app/_utils/utils_functions";
import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { janifera, luciole } from "@/app/(frontend)/Fonts";
/// TYPE
export type TeacherInfo = {
	first_name: string | null,
	last_name: string | null,
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
			<Flex justify='between'>
				<Button asChild variant="soft">
					<Link href={`/reports`}>
						<ArrowLeft />Retour
					</Link>
				</Button>
				<Button onClick={() => reactToPrint()}>
					Générer PDF
				</Button>
			</Flex>

			<Card>
				<div style={{fontSize: '12px', margin: '20px'}} ref={contentRef} className={luciole.className} >
					<p>Pratico</p>
					<h2 style={{ fontSize: '18px', textAlign: 'center', margin: "50px "}}>Rapport de Session</h2>
					<h2 style={{ fontSize: '14px'}}>{`${capsuleTitle !== "Sans titre" ? capsuleTitle : ""}`}</h2>
					<Text as='div' style={{ color: "var(--gray-8)"}}>{`${date ? `Session du ${date}` : ""} ${date && hour ? ` à ${hour}` : ""}`}</Text>
					{
						userInfo ?
						<>
							<Text as='div' style={{ marginTop: '10px', fontSize: '14px'}}>{`Animateur: ${userInfo?.first_name} ${userInfo?.last_name}`}</Text>
							<Text as='div' style={{ fontSize: '25px', marginLeft: "20px", marginBottom: "50px"}} className={janifera.className}>{`${userInfo.first_name} ${userInfo.last_name}`}</Text>
						</>

						: ""
					}
					
					<Flex justify="between" mt='9' mb='3'>
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
										<Text >Aucun participant</Text>
									</td>
								</tr>
								: sortedAttendances.map((attendance, index) => (
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
			</Card>
			
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
