import { ActivityTypeWidget } from "@/app/_types/activity";
import { WidgetThumb } from "../_components/WidgetThumb";
import { Box, Button, DataList, Grid, Heading } from "@radix-ui/themes";
import { Link } from "@/app/(frontend)/_intl/intlNavigation";
import ReportWidgetTemplate from "../_components/ReportWidgetTemplate";
import { useFormatter } from "next-intl";

export function ActivityWidgetView({ color, activity}
	: { color: string | undefined, activity: ActivityTypeWidget }) {
	const formatter = useFormatter();
	const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	const startTime = formatter.dateTime(new Date(activity.launched_at), {timeStyle: "medium", timeZone: timezone});
	const endTime = formatter.dateTime(new Date(activity.launched_at), {timeStyle: "medium", timeZone: timezone});
	const thumbSmallText = activity.type === "poll" ? "de participation" : "de réussite";
	console.log("STart time", activity.launched_at);
	const Thumb = () => <WidgetThumb bigText={`${activity.percentage.toString()}%`} smallText={thumbSmallText} color={color} />;
	
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
						<DataList.Value>{startTime}</DataList.Value>
					</DataList.Item>

					<DataList.Item>
						<DataList.Label>Fin</DataList.Label>
						<DataList.Value>{endTime}</DataList.Value>
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