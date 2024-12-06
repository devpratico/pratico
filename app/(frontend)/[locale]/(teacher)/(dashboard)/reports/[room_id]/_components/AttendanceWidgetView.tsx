"use client";
import { useRouter } from "@/app/(frontend)/_intl/intlNavigation";
import { Json } from "@/supabase/types/database.types";
import { WidgetThumb } from "./WidgetThumb";
import { WidgetContent } from "./WidgetContent";
import { WidgetButtons } from "./WidgetButtons";
import WidgetButton from "./WidgetButton";
import ReportWidgetTemplate from "./ReportWidgetTemplate";
import { DataList } from "@radix-ui/themes";
import { useFormatter } from "next-intl";
import { format } from "path";


export type AttendanceWidgetViewProps = {
	data: {
		sessionDate: {
			//date: string,
			//end: string | null | undefined
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
	};
};

export function AttendanceWidgetView ({data}: AttendanceWidgetViewProps) {
	const router = useRouter();
    const formatter = useFormatter();
	
	const contentData = {
		type: "attendance",
		title: data?.userInfo?.first_name && data?.userInfo?.last_name ? `Animateur: ${data?.userInfo?.first_name} ${data?.userInfo?.last_name}`: "",
		info: "Date: ",
		date: data?.sessionDate,
	}
	const buttonData = {
		type: "attendance",
		buttons: [
			{
				label: "Détails",
				onClick: () => data?.nextUrl && router.push(data?.nextUrl)
			}
		]
	}


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
        );
    }

	//const AttendanceContent = <WidgetContent data={contentData}/>;
	const AttendanceButtons = <WidgetButtons data={buttonData} />;


    const buttons = (
        <>
            <WidgetButton key='1'>Détails</WidgetButton>
        </>
    );

	return (
		<ReportWidgetTemplate
            thumb={<Thumb/>}
            content={<Content/>}
            buttons={buttons}
        />
	);
};s