import { NextRequest, NextResponse } from 'next/server';
import sendDiscordMessage from './server';




export async function POST(request: NextRequest) {
    const { message } = await request.json();
    const { success, error } = await sendDiscordMessage(message);

    if (!success) return NextResponse.json({ error }, { status: 500 });

    return NextResponse.json({ success });
}