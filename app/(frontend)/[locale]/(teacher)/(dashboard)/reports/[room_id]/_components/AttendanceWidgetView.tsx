"use client";
import { Link } from "@/app/(frontend)/_intl/intlNavigation";
import { Json } from "@/supabase/types/database.types";
import { WidgetThumb } from "./WidgetThumb";
import ReportWidgetTemplate from "./ReportWidgetTemplate";
import { Button, Card, DataList, Flex, IconButton, Strong, Text } from "@radix-ui/themes";
import { useFormatter } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { AttendanceInfoType } from "../page";
import { janifera, luciole } from "@/app/(frontend)/Fonts";
import WidgetButton from "./WidgetButton";
import { FileDown } from "lucide-react";

export type AttendanceWidgetViewProps = {
	data: {
		sessionDate: {
            startDate: Date,
            endDate: Date
		},
		userInfo: {
			first_name: string | null,
			last_name: string | null,
			organization: Json | null
		} | null,
		attendanceCount: number;
		nextUrl: string;
		roomId: string;
		capsuleTitle: string;
		attendances: {
			first_name: string | null,
			last_name: string | null,
			connexion: string | undefined,
		}[];
	}
};

export function AttendanceWidgetView ({data}: AttendanceWidgetViewProps) {
	const contentRef = useRef<HTMLDivElement>(null);
	const reactToPrint = useReactToPrint({contentRef});
	const formatter = useFormatter();
	const [ sortedAttendances, setSortedAttendances ] = useState<AttendanceInfoType[]>();
	const date = formatter.dateTime(data.sessionDate.startDate, {dateStyle:'short'});
	const start = formatter.dateTime(data.sessionDate.startDate, {timeStyle:'short'});
	const dateEnd = data.sessionDate.endDate ? formatter.dateTime(data.sessionDate.endDate, {dateStyle: 'short'}) : undefined;
	const end = data.sessionDate.endDate ? formatter.dateTime(data.sessionDate.endDate, {timeStyle: 'short'}) : undefined; 
	

	useEffect(() => {
		const getAttendancesList = () => {
			if (!sortedAttendances)
				setSortedAttendances(data.attendances.sort((a, b) => {
					const tmpA = a.last_name || '';
					const tmpB = b.last_name || '';
					return (tmpA.localeCompare(tmpB));
				}));
		}
		getAttendancesList();
	}, [data.attendances, sortedAttendances]);

    // Thumb
    const smallText = data.attendanceCount > 1 ? "PARTICIPANTS" : "PARTICIPANT";
	const Thumb = () => <WidgetThumb bigText={data.attendanceCount.toString()} smallText={smallText} color="violet" />;


    // Content
    const Content = () => {

        const prenom = data.userInfo?.first_name || "";
        const nom = data.userInfo?.last_name || "";
        let fullName = `${prenom} ${nom}`;
        if (fullName === " ") {
            fullName = "Utilisateur anonyme";
        }

        const startDate = formatter.dateTime(data.sessionDate.startDate, {dateStyle:'short', timeStyle:'short'});
        const endDate = formatter.dateTime(data.sessionDate.endDate, {dateStyle:'short', timeStyle:'short'});

        return (
			<>
				<Strong>Présence</Strong>
				<DataList.Root size='1'>
					<DataList.Item>
						<DataList.Label>Animateur</DataList.Label>
						<DataList.Value>{fullName}</DataList.Value>
					</DataList.Item>

					<DataList.Item>
						<DataList.Label>Début</DataList.Label>
						<DataList.Value>{startDate}</DataList.Value>
					</DataList.Item>

					<DataList.Item>
						<DataList.Label>Fin</DataList.Label>
						<DataList.Value>{endDate}</DataList.Value>
					</DataList.Item>
				</DataList.Root>
			</>
            
        );
    }

    const buttons = (
		<Flex gap="2" align="center">
			<IconButton disabled={data.attendanceCount < 1}  variant="ghost" onClick={() => reactToPrint()}>
				<FileDown />
			</IconButton>
			<Button disabled={data.attendanceCount < 1} radius="full" asChild>
				<Link href={data.attendanceCount >= 1 ? data.nextUrl : "#"}>
					Détails
				</Link>
			</Button>
		</Flex>
    );

	return (
		<>
			<ReportWidgetTemplate
				thumb={<Thumb/>}
				content={<Content/>}
				buttons={buttons}
			/>

			<style jsx global>{`
				.hidden-on-screen {
					display: none;
				}

				@media print {
					.hidden-on-screen {
					display: block !important;
					}

					@page {
					margin: 10mm 30mm;
					}
				}
			`}</style>
			<Card mt='5' className="hidden-on-screen">
				<div style={{fontSize: '12px', margin: '20px'}} ref={contentRef} className={luciole.className} >
					<p>Pratico</p>
					<h2 style={{ fontSize: '18px', textAlign: 'center', margin: "50px "}}>Fiche de présence</h2>
					<h2 style={{ fontSize: '14px'}}>{`${data.capsuleTitle !== "Sans titre" ? data.capsuleTitle : ""}`}</h2>
					{
						date !== "Invalid Date" &&  start !== "Invalid Date"
						? 
							date && start && end
							? 	dateEnd && date !== dateEnd
								? <Text as='div' mb='4'>{`Session du ${date} à ${start} au ${dateEnd} à ${end}`}</Text>
								: <Text as='div' mb='4'>{`Session du ${date} de ${start} à ${end}`}</Text> 
							: <Text as='div' mb='4'>{`${date ? `Session du ${date}` : ""} ${date && start ? ` à ${start}` : ""}`}</Text>
						: <Text as='div' mb='4'></Text>
					}
					{
						data.userInfo ?
						<>
						{
								data.userInfo.organization
								? <Text >{`${data.userInfo.organization} `}</Text>
								: <></>
							}
							<Text as='div'>
								<Text style={{ fontSize: '12px', fontWeight: 'bold'}}>Animateur: </Text>
								<Text >{`${data.userInfo.first_name}, ${data.userInfo.last_name}`}</Text>
							</Text>	
							
							<Text as='div' style={{ fontSize: '25px', marginLeft: "20px" }} className={janifera.className}>{`${data.userInfo.first_name} ${data.userInfo.last_name}`}</Text>
						</>
						: ""
					}
					
					<Flex style={{ marginTop: '50px'}} justify="between" mt='9' mb='3'>
						<h2 style={{ fontSize: '14px'}}>Émargement</h2>
						<Text> {`Participants: ${data.attendances.length || "Aucun"}`}</Text>		
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
};