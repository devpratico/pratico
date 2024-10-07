import logger from "@/app/_utils/logger";

export default async function sendDiscordMessage(message: string): Promise<void> {

    try {
        const response = await fetch('/api/discord', { method: 'POST', body: JSON.stringify({ message }) });

        if (!response.ok) {
            logger.error('next:api', 'sendDiscordMessage', 'Error sending message');
        }

        return;
    } catch (error) {
        logger.error('next:api', 'sendDiscordMessage', 'Error sending message:', error);
    }
}