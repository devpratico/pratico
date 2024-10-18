import logger from "@/app/_utils/logger";

/**
 * These wrappers only work client-side.
 * If you need to call these functions server-side, use discordMessageSender (utils.ts) directly.
 */

export async function sendDiscordMessage(message: string): Promise<void> {
    try {
        const response = await fetch('/api/discord/send-message', { method: 'POST', body: JSON.stringify({ message }) });

        if (!response.ok) {
            logger.error('next:api', 'sendDiscordMessage', 'Error sending message', JSON.stringify(response));
        }

        return;
    } catch (error) {
        logger.error('next:api', 'sendDiscordMessage', 'Error sending message:', error);
    }
}


export async function sendDiscordError(message: string): Promise<void> {
    try {
        const response = await fetch('/api/discord/log-error', { method: 'POST', body: JSON.stringify({ message }) });

        if (!response.ok) {
            logger.error('next:api', 'sendDiscordError', 'Error sending message', JSON.stringify(response));
        }

        return;
    } catch (error) {
        logger.error('next:api', 'sendDiscordError', 'Error sending message:', error);
    }
}