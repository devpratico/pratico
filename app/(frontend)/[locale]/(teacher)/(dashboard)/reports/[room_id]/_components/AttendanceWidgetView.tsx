"use client";
import { Link } from "@/app/(frontend)/_intl/intlNavigation";
import { Json } from "@/supabase/types/database.types";
import { WidgetThumb } from "./WidgetThumb";
import ReportWidgetTemplate from "./ReportWidgetTemplate";
import { Button, DataList, IconButton, Strong, Tooltip } from "@radix-ui/themes";
import { useFormatter } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { AttendanceInfoType } from "../page";
import { FileDown } from "lucide-react";
import { AttendanceToPDF } from "../../_components/AttendanceToPdf";

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
		<>
			<Tooltip content="Imprimer / Exporter en PDF">
				<IconButton disabled={data.attendanceCount < 1}  variant="ghost" onClick={() => reactToPrint()}>
					<FileDown />
				</IconButton>
			</Tooltip>
			<Button disabled={data.attendanceCount < 1} radius="full" asChild>
				<Link href={data.attendanceCount >= 1 ? data.nextUrl : "#"}>
					Détails
				</Link>
			</Button>
		</>
    );

	return (
		<>
			<ReportWidgetTemplate
				thumb={<Thumb/>}
				content={<Content/>}
				buttons={buttons}
			/>
			<AttendanceToPDF
				attendances={data.attendances} 
				sessionDate={{startDate: date, startTime: start, endDate: dateEnd, endTime: end}}
				capsuleTitle={data.capsuleTitle}
				user={{ userInfo: data.userInfo }}
				backTo="/reports"
				hideClassname="hidden-on-screen"
				ref={contentRef}  />
		</>
		
	);
};