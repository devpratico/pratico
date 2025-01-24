import { ActivityTypeWidget } from "@/app/_types/activity";
import { ActivityWidgetView } from "./ActivityWidgetView";
import { fetchActivitiesWidgetData } from "@/app/(backend)/api/activity/activity.server";

const getParticipationColor = (rate: number) => {
	if (rate < 50) return ("var(--amber-9)");
	return ("var(--grass-9)");
};
export async function ActivityWidget ({roomId}
	: {roomId: string}) {
	
		const { data: activities, error } = await fetchActivitiesWidgetData(roomId);
		console.log("Aaaaactivities", activities, "error", error);

		return (
			<>
				{
					activities.map((activity: ActivityTypeWidget) => {
						const color = activity.type === "poll" ? undefined : getParticipationColor(activity.percentage);

						return (<ActivityWidgetView key={activity.id} color={color} activity={activity} />);
					})
				}
			</>
		);
}