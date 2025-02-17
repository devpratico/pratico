import { makeArrayForCsv } from "../../../../dowloadPollCsvReport";
import { convertToCsvString } from "@/app/_utils/csv";
import logger from "@/app/_utils/logger";


export async function GET(req: Request, { params }: { params: { start_event_id: string } }) {

    logger.log('next:api', 'activity/routes/csv/poll/[start_event_id]/route.ts', 'GET', { params });

    const { data, error } = await makeArrayForCsv({startEventId: params.start_event_id});

    if (error) {
        logger.error('next:api', 'activity/routes/csv/poll/[start_event_id]/route.ts', 'Error making object for csv', error);
        return Response.json({ error }, { status: 500 });
    }

    const csvString = convertToCsvString(data.csvArray);

    return Response.json({ csvString });
}