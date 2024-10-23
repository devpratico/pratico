import logger from "@/app/_utils/logger";


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