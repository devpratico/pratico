"use client";
import { WidgetThumb } from "./WidgetThumb";
import { Box, DataList, Heading } from "@radix-ui/themes";
import ReportWidgetTemplate from "./ReportWidgetTemplate";
import { ActivityData } from "@/app/(backend)/api/activity/fetchActivitiesDoneInRoom";


export function ActivityWidgetView(props: {
    color: string | undefined;
    activity: ActivityData;
    downloadCsvButton: React.ReactNode;
}) {
    const { color, activity, downloadCsvButton } = props;
	const { startDate, endDate } = formatEventDates(activity.startDate, activity.endDate!); 
	const thumbSmallText = activity.type === "poll" ? "de participation" : "de réussite";

	const Thumb = () => <WidgetThumb bigText={`${activity.relevantNumber?.toString()}`} bigTextOption="%" smallText={thumbSmallText} color={color} />;
	
	const Content = () => {
		const titleType = activity.type === "poll" ? "Sondage" : "Quiz";
		const title = (activity.title ==  "Sans titre") ? `${titleType} sans titre` : activity.title;
		return (
			<Box>
				<Heading style={{fontWeight: "lighter"}} as='h2' size='2' mb="1" color="gray">{titleType}</Heading>
				<Heading as='h3' size='4' mb='4'>{title}</Heading>
				<DataList.Root size='1'>
					<DataList.Item>
						<DataList.Label>Questions</DataList.Label>
						<DataList.Value>{activity.nbQuestions}</DataList.Value>
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
			</Box>);
	};
	const buttons = <>
		{downloadCsvButton}
	</>
    
	return (
		<ReportWidgetTemplate 
			thumb={<Thumb />}
			content={<Content />}
			buttons={buttons}
		/>
	)
}


export function formatEventDates(start: Date, end: Date): { startDate: string, endDate: string } {
	const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	const isSameDay = start.getDate() === end.getDate() && start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();

	const dateOptions: Intl.DateTimeFormatOptions = {
		dateStyle: isSameDay ? undefined : "short",
		timeStyle: "medium",
		timeZone: timezone,
	};

	const startDate = new Intl.DateTimeFormat("fr-FR", dateOptions).format(start);
	const endDate = new Intl.DateTimeFormat("fr-FR", dateOptions).format(end);

	return { startDate, endDate };
}