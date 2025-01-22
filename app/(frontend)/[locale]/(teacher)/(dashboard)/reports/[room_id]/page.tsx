import logger from "@/app/_utils/logger";
import { Container, Grid, ScrollArea, Section, Text, Heading } from "@radix-ui/themes";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import createClient from "@/supabase/clients/server";
import { AttendanceWidget } from "./attendance/_components/AttendanceWidget";
import { BackButton } from "@/app/(frontend)/[locale]/_components/BackButton";
import { getFormatter } from "next-intl/server";
import { CapsuleWidget } from "./_components/CapsuleWidget";
import { ActivityWidget } from "./activities/ActityWidget";
import { ActivityTypeTable } from "@/app/_types/activity";
import { fetchActivitiesWidgetData, TMPfetchActivitiesWidgetData } from "@/app/(backend)/api/activity/activity.server";

// TYPE
export type AttendanceInfoType = {
	first_name: string | null,
	last_name: string | null,
	additional_info: string | null,
	connexion: string | undefined,
}
// // TYPE
export type SessionInfoType = {
  id: string;
  created_at: string;
  numberOfParticipant: number;
  status?: 'open' | 'closed';
  capsule_id?: string;
  capsule_title?: string | null
};

export default async function SessionDetailsPage ({ params }: { params: Params }) {
	const roomId: string = params.room_id;
    let capsuleTitle = "Sans titre";
    let sessionDateSubtitle = "Date inconnue";

    const capsuleId = await getCapsuleId(roomId);

    if (capsuleId) {
        capsuleTitle = await getCapsuleTitle(capsuleId) ?? capsuleTitle;
    }

    const sessionDate = await getSessionStartDate(roomId);

    if (sessionDate) {
        const formatter = await getFormatter();
        sessionDateSubtitle = `Session du ${formatter.dateTime(sessionDate, {dateStyle: "short"})}`;
    }

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
		<ScrollArea>
			<Container>

                <Section size='1'>
                    <BackButton backTo="/reports" />
                </Section>

                <Section size='2'>

                    <Heading as='h1' size="7" color='violet'>{capsuleTitle}</Heading>
                    <Text size="2" color='gray'>{sessionDateSubtitle}</Text> 

                    <Grid columns='repeat(auto-fill, minmax(400px, 1fr))' gap='5' mt='8'>
                        <AttendanceWidget roomId={roomId} capsuleTitle={capsuleTitle}/>
                        <CapsuleWidget capsuleTitle={capsuleTitle} capsuleId={capsuleId} roomId={roomId} />
                        {
                            activities.map((activity) => <ActivityWidget key={activity.id} activity={activity} />)
                        }
                    </Grid>

                </Section>
                
			</Container>
		</ScrollArea>
	);
};


// TODO: put the following functions inside the relevant _.server.ts file,
// with proper error handling (returning a { data, error } object)

async function getCapsuleId(roomId: string) {
    const supabase = createClient();
    const { data, error } = await supabase.from('rooms').select('capsule_id').eq('id', roomId).single();
    if (error || !data.capsule_id) {
        logger.error('next:page', 'SessionDetailsPage', 'Error fetching capsuleId', error?.message ?? 'No data');
        return null
    }
    return data.capsule_id
}


async function getCapsuleTitle(capsuleId: string) {
    const supabase = createClient();
    const { data, error } = await supabase.from('capsules').select('title').eq('id', capsuleId).single();
    if (error || !data.title) {
        logger.error('next:page', 'SessionDetailsPage', 'Error fetching capsuleTitle', error?.message ?? 'No data');
        return null
    }
    return data.title
}


async function getSessionStartDate(roomId: string) {
    const supabase = createClient();
    const { data, error } = await supabase.from('rooms').select('created_at').eq('id', roomId).single();
    if (error || !data.created_at) {
        logger.error('next:page', 'SessionDetailsPage', 'Error fetching session date', error?.message ?? 'No data');
        return null
    }
    return new Date(data.created_at)
}
