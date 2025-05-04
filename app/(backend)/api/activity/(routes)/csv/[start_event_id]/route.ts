//import { makeArrayForCsv } from "../../../../dowloadPollCsvReport";
import { convertToCsvString } from "@/app/_utils/csv";
import logger from "@/app/_utils/logger";
import {getPollData, makeDataArrayForPoll, getQuizData, makeDataArrayForQuiz} from "../../../get-activity-data";
import { NextRequest } from "next/server";


export async function GET(req: NextRequest, { params }: { params: Promise<{ start_event_id: string }> }) {

    logger.log('next:api', 'activity/routes/csv/poll/[start_event_id]/route.ts', 'GET', { params });

    const startEventId = (await params).start_event_id;

    const searchParams = req.nextUrl.searchParams
    const type = searchParams.get('type')

    let arr: string[][];

    if (type == 'poll') {
        const { data, error } = await getPollData(startEventId);

        if (error) {
            logger.error('next:api', 'activity/routes/csv/[start_event_id]/route.ts', 'Error making poll object for csv', error);
            return Response.json({ error }, { status: 500 });
        }

        arr = makeDataArrayForPoll(data);

    } else if (type == 'quiz') {
        const { data, error } = await getQuizData(startEventId);
        if (error) {
            logger.error('next:api', 'activity/routes/csv/[start_event_id]/route.ts', 'Error making quiz object for csv', error);
            return Response.json({ error }, { status: 500 });
        }
        arr = makeDataArrayForQuiz(data);
    } else {
        logger.error('next:api', 'activity/routes/csv/[start_event_id]/route.ts', 'Error making object for csv', 'No type provided');
        return Response.json({ error: 'No type provided' }, { status: 500 });
    }

    const csvString = convertToCsvString(arr);

    return Response.json({ csvString });
}