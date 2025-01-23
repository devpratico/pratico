import { ActivityTypeTable, ActivityTypeWidget } from "@/app/_types/activity";
import { ActivityWidgetView } from "./ActivityWidgetView";
import logger from "@/app/_utils/logger";
import { TMPfetchActivitiesWidgetData } from "@/app/(backend)/api/activity/activity.server";

const getParticipationColor = (rate: number) => {
	if (rate < 50) return ("var(--amber-9)");
	return ("var(--grass-9)");
};
export async function ActivityWidget ({roomId}
	: {roomId: string}) {
	const activitiesTemplate: ActivityTypeTable[] = [
		{
			type: "poll",
			id: 0,
			object: {
				"type": "poll",
					"schemaVersion": "3",
					"title": "Voici un sondage",
					"questions": [
						{
						"id": "question-01",
						"text": "Etes vous satisfaits du quiz que nous avons vu ?",
						"choices": [
							{
							"id": "choice-1737538473427-2768",
							"text": "Ouais"
							},
							{
							"id": "choice-1737538476312-1833",
							"text": "Nan"
							}
						]
						},
						{
						"id": "question-1737538478306-5797",
						"text": "Salut",
						"choices": [
							{
							"id": "choice-1737538484205-5317",
							"text": "Bonjour"
							},
							{
							"id": "choice-1737538488530-1628",
							"text": "Tamayre"
							}
						]
						}
					]
				},
				created_at: new Date().toISOString(),
				created_by: "Johanna"
			},
			{
				type: "quiz",
				id: 1,
				object: {
					"type": "quiz",
					"schemaVersion": "3",
					"title": "Ceci est un quiz",
					"questions": [
					{
						"id": "question-0",
						"text": "Comment s'appelle votre animateur ?",
						"choices": [
						{
							"id": "choice-1737538350491-2520",
							"text": "Lyokha",
							"isCorrect": false
						},
						{
							"id": "choice-1737538353738-7570",
							"text": "Johanna",
							"isCorrect": true
						},
						{
							"id": "choice-1737538359070-6973",
							"text": "Keeghaan",
							"isCorrect": true
						},
						{
							"id": "choice-1737538368159-5516",
							"text": "Melvin",
							"isCorrect": false
						},
						{
							"id": "choice-1737538375062-2941",
							"text": "Victor",
							"isCorrect": false
						},
						{
							"id": "choice-1737538378733-3966",
							"text": "Alfred",
							"isCorrect": false
						}
						]
					},
					{
						"id": "question-1737538382754-3658",
						"text": "Combien y a t il de choux ?",
						"choices": [
						{
							"id": "choice-1737538396017-5237",
							"text": "5",
							"isCorrect": true
						},
						{
							"id": "choice-1737538399478-7158",
							"text": "4",
							"isCorrect": false
						},
						{
							"id": "choice-1737538400568-2983",
							"text": "3",
							"isCorrect": false
						},
						{
							"id": "choice-1737538401509-9347",
							"text": "2",
							"isCorrect": false
						},
						{
							"id": "choice-1737538402441-2364",
							"text": "1",
							"isCorrect": false
						},
						{
							"id": "choice-1737538404797-3566",
							"text": "0",
							"isCorrect": false
						}
						]
					},
					{
						"id": "question-1737538407313-2088",
						"text": "Allez bye",
						"choices": [
						{
							"id": "choice-1737538415194-8528",
							"text": "Bye",
							"isCorrect": true
						},
						{
							"id": "choice-1737538419665-8723",
							"text": "Bye bye bye",
							"isCorrect": false
						}
						]
					},
					{
						"id": "question-1737538427488-5680",
						"text": "Allez bye",
						"choices": [
						{
							"id": "choice-1737538427489-5882",
							"text": "Bye Bye",
							"isCorrect": false
						},
						{
							"id": "choice-1737538427489-7841",
							"text": "Ciao",
							"isCorrect": true
						}
						]
					}]
				},
				created_at: new Date().toISOString(),
				created_by: "Johanna"
			}
		];
	
		// const activities: ActivityTypeWidget[] = fetchActivitiesWidgetData(roomId);
		const { data: activities } = await TMPfetchActivitiesWidgetData(activitiesTemplate);
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