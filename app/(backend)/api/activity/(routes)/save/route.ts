import logger from "@/app/_utils/logger"
import { saveActivity, SaveActivityArgs, SaveActivityReturn } from "../../activities.server"


export async function POST(request: Request) {
    const { id, activity } = await request.json() as SaveActivityArgs

    const { data, error } = await saveActivity({ id, activity }) as SaveActivityReturn

    if (error) {
        logger.error('next:api', 'activity/save', error)
        return new Response(JSON.stringify({ data: null, error }), { status: 500, headers: { 'content-type': 'application/json' } })
    }

    return new Response(JSON.stringify({ data, error: null }), { headers: { 'content-type': 'application/json' } })
}