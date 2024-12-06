"use client";
import { Link } from "@/app/(frontend)/_intl/intlNavigation";
import { Json } from "@/supabase/types/database.types";
import { WidgetThumb } from "./WidgetThumb";
import ReportWidgetTemplate from "./ReportWidgetTemplate";
import { Button, DataList, Strong } from "@radix-ui/themes";
import { useFormatter } from "next-intl";


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
	};
};

export function AttendanceWidgetView ({data}: AttendanceWidgetViewProps) {
    const formatter = useFormatter();

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

    const buttons = (
		<Button disabled={data.attendanceCount < 1} size="3" variant="soft" radius="full" asChild>
			<Link href={"/reports/" + data.nextUrl}>
				<Strong>Détails</Strong>
			</Link>
		</Button>
    );

	return (
		<ReportWidgetTemplate
            thumb={<Thumb/>}
            content={<Content/>}
            buttons={buttons}
        />
	);
};