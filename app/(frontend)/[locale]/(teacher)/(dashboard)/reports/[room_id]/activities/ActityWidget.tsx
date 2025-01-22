import { ActivityTypeWidget } from "@/app/_types/activity";
import { ActivityWidgetView } from "./ActivityWidgetView";
import logger from "@/app/_utils/logger";

const getParticipationColor = (rate: number) => {
	if (rate < 50) return ("var(--amber-9)");

	return ("var(--grass-9)");
};
export async function ActivityWidget ({activity}
	: {activity: ActivityTypeWidget}) {
	const color = activity.type === "poll" ? undefined : getParticipationColor(activity.percentage);

	switch (activity.type) {
		case "poll":
			
			break ;
		case "quiz":
			
			break ;
		default:
			logger.error("react:component", "ActivityWidget", "Unknown activity type", activity.type);
	}

	return (
		<ActivityWidgetView color={color} activity={activity} />
	)
}