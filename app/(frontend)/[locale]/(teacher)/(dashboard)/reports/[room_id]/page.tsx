import logger from "@/app/_utils/logger";
import { Container, Grid, ScrollArea, Section, Text, Heading } from "@radix-ui/themes";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import createClient from "@/supabase/clients/server";
import { AttendanceWidget } from "./attendance/_components/AttendanceWidget";
import { BackButton } from "@/app/(frontend)/[locale]/_components/BackButton";
import { getFormatter } from "next-intl/server";
import { CapsuleWidget } from "./_components/CapsuleWidget";
import { ActivityWidgetView } from "./_components/ActivityWidgetView";
import { ActivityData, fetchActivitiesDoneInRoom } from "@/app/(backend)/api/activity/fetchActivitiesDoneInRoom";
import DownloadCsvBtn from "./_components/DownloadCsvBtn";

// // TYPE
// export type ActivityTypeWidget = {
//     id: string,
//     type: string,
//     title: string | undefined,
//     started_at: Date,
//     stopped_at: Date,
//     percentage: number,
//     nbQuestions: number
// }
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
    
    const { data: activities, error } = await fetchActivitiesDoneInRoom(roomId);
    if (error)
        logger.error('next:page', 'SessionDetailsPage', 'Error fetching activities done in room', error.message);
    
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
                            activities?.map((activity: ActivityData) => {

                                const color = activity.type === "poll" ? undefined : getParticipationColor(activity.relevantNumber!);
                                const downloadCsvButton = <DownloadCsvBtn type={activity.type} startEventId={activity.startEventId} variant='ghost'/>;

                                return (
                                    <ActivityWidgetView
                                        key={activity.widgetId}
                                        color={color}
                                        activity={activity}
                                        downloadCsvButton={downloadCsvButton}
                                    />
                                );
                            })
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
    const { data, error } = await supabase.from('rooms').select('capsule_id').eq('id', parseInt(roomId)).single();
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
    const { data, error } = await supabase.from('rooms').select('created_at').eq('id', parseInt(roomId)).single();
    if (error || !data.created_at) {
        logger.error('next:page', 'SessionDetailsPage', 'Error fetching session date', error?.message ?? 'No data');
        return null
    }
    return new Date(data.created_at)
}

const getParticipationColor = (rate: number) => {
	if (rate < 50) return ("var(--amber-9)");
	return ("var(--grass-9)");
};