import { NextRequest, NextResponse } from 'next/server';
import { discordMessageSender } from '../utils';


export async function POST(request: NextRequest) {

    const { message } = await request.json();

    if (!message) {
        console.error('next:api', 'sendDiscordMessage', 'No message provided');
        return NextResponse.json({ error: 'No message provided' }, { status: 400 });
    }

    const { success } = await discordMessageSender(message);

    if (!success) {
        return NextResponse.json({ error: 'Error sending message' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}