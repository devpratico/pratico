import { makeObjectForCsv } from "../../../../dowloadPollCsvReport";
import { convertToCsvString } from "@/app/_utils/csv";


export async function GET(req: Request, { params }: { params: { start_event_id: string } }) {

    const { data, error } = await makeObjectForCsv({startEventId: params.start_event_id});

    if (error) return Response.json({ error }, { status: 500 });

    const csvString = convertToCsvString(data.csvData);

    return Response.json({ csvString });
}