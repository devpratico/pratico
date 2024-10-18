import 'server-only';
import logger from '@/app/_utils/logger';


const webhookUrl = process.env.DISCORD_WEBHOOK_URL || '';

/**
 * This utility function sends a message to a Discord channel.
 * It runs server-side. Use it directly in your server code,
 * or use the wrappers if you need to call it client-side.
 */
export async function discordMessageSender(message: string) {
    if (!webhookUrl) {
        logger.error('next:api', 'sendDiscordMessage', 'No webhook url provided. Please provide the DISCORD_WEBHOOK_URL environment variable');
        return { success: false };
    }

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: message }),
        });

        if (!response.ok) {
            logger.error('next:api', 'sendDiscordMessage', 'Error sending message');
            return { success: false };
        }

        return { success: response.ok };

    } catch (error) {
        logger.error('next:api', 'sendDiscordMessage', 'Error sending message:', error);
        return { success: false };
    }

}