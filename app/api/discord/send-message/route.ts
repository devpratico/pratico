import { NextRequest, NextResponse } from 'next/server';

const webhookUrl = process.env.DISCORD_WEBHOOK_URL || '';


export async function POST(request: NextRequest) {
    if (!webhookUrl) {
        console.error('next:api', 'sendDiscordMessage', 'No webhook url provided. Please provide the DISCORD_WEBHOOK_URL environment variable');
        return NextResponse.json({ error: 'No webhook url provided' }, { status: 400 });
    }

    const { message } = await request.json();

    if (!message) {
        console.error('next:api', 'sendDiscordMessage', 'No message provided');
        return NextResponse.json({ error: 'No message provided' }, { status: 400 });
    }

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({content: message,}),
        });

        if (!response.ok) {
            console.error('next:api', 'sendDiscordMessage', 'Error sending message');
            return NextResponse.json({ error: 'Error sending message' }, { status: 500 });
        }

        return NextResponse.json({ msg: 'Message sent' }, { status: 200 });

    } catch (error) {
        console.error('next:api', 'sendDiscordMessage', 'Error sending message:', error);
        return NextResponse.json({ error: 'Error sending message' }, { status: 500 });
    }
}