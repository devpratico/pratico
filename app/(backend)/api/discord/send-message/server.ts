import 'server-only'


export interface SendDiscordMessageReturn {
    success: boolean;
    error: string | null;
}


const webhookUrl = process.env.DISCORD_WEBHOOK_URL || '';

export default async function sendDiscordMessage(message: string): Promise<SendDiscordMessageReturn> {

    if (!webhookUrl) {
        console.error('next:api', 'sendDiscordMessage', 'No webhook url provided. Please provide the DISCORD_WEBHOOK_URL environment variable');
        return { success: false, error: 'No webhook url provided' };
    }

    if (!message) {
        console.error('next:api', 'sendDiscordMessage', 'No message provided');
        return { success: false, error: 'No message provided' };
    }

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: message, }),
        });

        if (!response.ok) {
            console.error('next:api', 'sendDiscordMessage', 'Error sending message');
            return { success: false, error: 'Error sending message' };
        }

        return { success: true, error: null };

    } catch (error) {
        console.error('next:api', 'sendDiscordMessage', 'Error sending message:', error);
        return { success: false, error: 'Error sending message' };
    }

}