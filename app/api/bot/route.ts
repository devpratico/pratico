import { NextRequest, NextResponse } from "next/server";

const webhookUrl = process.env.DISCORD_WEBHOOK_URL || '';

export const POST = async (req: NextRequest) => {
  if (req.method === 'POST') {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Info message missing' }, { status: 400 });
    }

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: message,
        }),
      });

      if (!response.ok) {
        throw new Error('Error sending message');
      }

      return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
      console.error('Error sending message:', error);
      return NextResponse.json({ error: 'Error sending message' }, { status: 500 });
    }
  } else {
    return NextResponse.json({ error: `Method ${req.method} not allowed` }, { status: 405 });
  }
};



/*

Usage:


const sendMessage = async (name: string) => {
    const response = await fetch('/api/bot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      throw new Error('Error sending message');
    }

    const data = await response.json();
    console.log(data.success ? 'Message sent successfully' : 'Error while sending msg');
  };

*/