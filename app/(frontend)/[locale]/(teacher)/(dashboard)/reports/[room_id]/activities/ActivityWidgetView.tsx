import { ActivityTypeWidget } from "@/app/_types/activity";
import { WidgetThumb } from "../_components/WidgetThumb";
import { Box, Button, DataList, Grid, Heading } from "@radix-ui/themes";
import { Link } from "@/app/(frontend)/_intl/intlNavigation";
import ReportWidgetTemplate from "../_components/ReportWidgetTemplate";
import { useFormatter } from "next-intl";

export function ActivityWidgetView({ color, activity}
	: { color: string | undefined, activity: ActivityTypeWidget }) {
	const { startDate, endDate } = formatEventDates(new Date(activity.launched_at), new Date(activity.stopped_at)); 
	const thumbSmallText = activity.type === "poll" ? "de participation" : "de réussite";
	console.log("STart time", activity.launched_at);
	const Thumb = () => <WidgetThumb bigText={`${activity.percentage.toString()}`} bigTextOption="%" smallText={thumbSmallText} color={color} />;
	
	const Content = () => {
		const titleType = activity.type === "poll" ? "Sondage" : "Quiz";
		const title = (activity.title ==  "Sans titre") ? `${titleType} sans titre` : activity.title;
		return (
			<Box>
				<Heading as='h2' size='2'mb="2" color="gray">{titleType}</Heading>
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
	const buttons = <Button radius="full" asChild>
		<Link href={"#"}>
			Détails
		</Link>
	</Button>;

	return (
		<Grid columns='repeat(auto-fill, minmax(400px, 1fr))' gap='3' mt='8'>
			<ReportWidgetTemplate 
				thumb={<Thumb />}
				content={<Content />}
				buttons={buttons}
			/>
		</Grid>
	)
}


export function formatEventDates(start: Date, end: Date): { startDate: string, endDate: string } {
    const formatter = useFormatter();
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const isSameDay = start.getDay() === end.getDay() && start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
    const startDate = formatter.dateTime(start, { dateStyle: isSameDay ? undefined : "short", timeStyle: "medium", timeZone: timezone });
    const endDate = formatter.dateTime(end, { dateStyle: isSameDay ? undefined : "short", timeStyle: "medium", timeZone: timezone });

    return ({ startDate, endDate });
}