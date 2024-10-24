import logger from "@/app/_utils/logger"
import { duplicateActivity, DuplicateActivityArgs, DuplicateActivityReturn } from "../../activities.server"


export async function POST(request: Request) {
    const { id } = await request.json() as DuplicateActivityArgs

    const { data, error } = await duplicateActivity({ id }) as DuplicateActivityReturn

    if (error) {
        logger.error('next:api', 'activity/duplicateActivity', error)
        return new Response(JSON.stringify({ data: null, error }), { status: 500, headers: { 'content-type': 'application/json' } })
    }

    return new Response(JSON.stringify({ data, error: null }), { headers: { 'content-type': 'application/json' } })
}