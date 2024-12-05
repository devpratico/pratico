"use client";
import { useRouter } from "@/app/(frontend)/_intl/intlNavigation";
import { Json } from "@/supabase/types/database.types";
import { WidgetThumb } from "./WidgetThumb";
import { WidgetContent } from "./WidgetContent";
import { WidgetButtons } from "./WidgetButtons";
import ReportWidgetTemplate from "./ReportWidgetTemplate";

export type AttendanceWidgetViewProps = {
	data: {
		sessionDate: {
			date: string,
			end: string | null | undefined
		},
		userInfo: {
			first_name: string | null,
			last_name: string | null,
			organization: Json | null
		} | null,
		attendanceCount: number;
		nextUrl: string;
	} | null;
};

export function AttendanceWidgetView ({data}: AttendanceWidgetViewProps) {
	const router = useRouter();
	
	const thumbData = {
		type: "attendance",
		count: data?.attendanceCount,
		message: data?.attendanceCount && data?.attendanceCount > 1 ? "PARTICIPANTS" : "PARTICIPANT",
		color: "var(--violet-10)"
	}
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

	const AttendanceThumb = <WidgetThumb data={thumbData}/>;
	const AttendanceContent = <WidgetContent data={contentData}/>;
	const AttendanceButtons = <WidgetButtons data={buttonData} />;

	return (
		<ReportWidgetTemplate thumb={AttendanceThumb} content={AttendanceContent} buttons={AttendanceButtons} />
	);
};