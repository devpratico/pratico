import { sendDiscordError } from "../../discord.server";


export async function POST(req: Request) {
    const { message } = await req.json();
    const { error } = await sendDiscordError(message);

    if (error) return Response.json({ error }, { status: 500 });

    return Response.json({ success: true });
}