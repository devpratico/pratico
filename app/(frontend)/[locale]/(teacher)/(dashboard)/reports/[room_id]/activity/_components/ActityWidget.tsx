import { ActivityTypeWidget } from "@/app/_types/activity";
import { ActivityWidgetView } from "./ActivityWidgetView";
import { fetchActivitiesWidgetData } from "@/app/(backend)/api/activity/activity.server";
import logger from "@/app/_utils/logger";

const getParticipationColor = (rate: number) => {
	if (rate < 50) return ("var(--amber-9)");
	return ("var(--grass-9)");
};
export async function ActivityWidget ({roomId}
	: {roomId: string}) {
	
		const { data: activities, error } = await fetchActivitiesWidgetData(roomId);
		if (error) 
			logger.error("react:component", "ActivityWidget", "Error fetching activities widget data", error);
		return (
			<>
				{
					activities.map((activity: ActivityTypeWidget) => {
						const color = activity.type === "poll" ? undefined : getParticipationColor(activity.percentage);
						// console.log("ACTIVITY", activity);
						return (<ActivityWidgetView key={activity.id} color={color} activity={activity} />);
					})
				}
			</>
		);
}