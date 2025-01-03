"use client";
import { Button, Card, Flex, Text } from "@radix-ui/themes";
import { AttendanceInfoType } from "../../page";
import { forwardRef, RefObject, useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { janifera, luciole } from "@/app/(frontend)/Fonts";
import { Json } from "@/supabase/types/database.types";
import { BackButton } from "@/app/(frontend)/[locale]/_components/BackButton";
import { FileDown } from "lucide-react";
/// TYPE
export type TeacherInfo = {
	first_name: string | null,
	last_name: string | null,
	organization?: Json | null
}

  interface Props {
	attendances: AttendanceInfoType[];
	sessionDate: { startDate: string; startTime: string; endDate?: string; endTime?: string };
	capsuleTitle: string;
	user: { userInfo: { first_name: string | null; last_name: string | null; organization: Json | null} | null };
	backTo: string;
	hideClassname?: string;
  }
  
  export const AttendanceToPDF = forwardRef<HTMLDivElement, Props>(({ attendances, sessionDate, capsuleTitle, user: { userInfo }, backTo, hideClassname }, ref) => {
	const [ sortedAttendances, setSortedAttendances ] = useState<AttendanceInfoType[]>();
	const contentRef = useRef<HTMLDivElement>(null);
	const reactToPrint = useReactToPrint({contentRef: ref as RefObject<HTMLDivElement> || contentRef});

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
			{
				hideClassname === "hidden-on-screen"
				?	<></>
				:	<Flex mb="5" justify='between'>
						<BackButton	backTo={backTo} />
						<Button onClick={() => reactToPrint()}>
							<FileDown size="20"/> Imprimer / Exporter PDF
						</Button>
					</Flex>
  			}
			<style jsx global>{`
				.hidden-on-screen {
					display: none;
				}

				@media print {
					.hidden-on-screen {
						display: block !important;
					}

					@page {
						margin: 10mm 20mm;
					}
				}
			`}</style>
			<Card mt='5' className={"hidden-on-screen"} style={{display: "none"}}>
				<div style={{fontSize: '12px'}} ref={ref || contentRef} className={luciole.className} >
					<p>Pratico</p>
					<h2 style={{ fontSize: '18px', textAlign: 'center', margin: "50px "}}>Fiche de présence</h2>
					<h2 style={{ fontSize: '14px'}}>{`${capsuleTitle !== "Sans titre" ? capsuleTitle : ""}`}</h2>
					{
						sessionDate.startDate && sessionDate.startTime && sessionDate.endTime
						? 	sessionDate.endDate && sessionDate.startDate !== sessionDate.endDate
							? <Text as='div' mb='4'>{`Session du ${sessionDate.startDate} à ${sessionDate.startTime} au ${sessionDate.endDate} à ${sessionDate.endTime}`}</Text>
							: <Text as='div' mb='4'>{`Session du ${sessionDate.startDate} de ${sessionDate.startTime} à ${sessionDate.endTime}`}</Text> 
						: <Text as='div' mb='4'>{`${sessionDate.startDate ? `Session du ${sessionDate.startDate}` : ""} ${sessionDate.startDate && sessionDate.startTime ? ` à ${sessionDate.startTime}` : ""}`}</Text>
					}
					{
						userInfo ?
						<>
						{
								userInfo.organization
								? <Text >{`${userInfo.organization.toString()} `}</Text>
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
		</>		
  	);
});

AttendanceToPDF.displayName = "AttendanceToPDF";