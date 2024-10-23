import logger from "@/app/_utils/logger";
import { SendDiscordMessageReturn } from "./server";


export default async function sendDiscordMessage(message: string): Promise<SendDiscordMessageReturn> {
    try {
        const response = await fetch('/api/discord/send-message', { method: 'POST', body: JSON.stringify({ message }) });

        if (!response.ok) {
            logger.error('next:api', 'sendDiscordMessage', 'Error sending message', JSON.stringify(response));
            return { success: false, error: 'Error sending message' };
        }
        return { success: true, error: null };

    } catch (error) {
        logger.error('next:api', 'sendDiscordMessage', 'Error sending message:', error);
        return { success: false, error: 'Error sending message' };
    }
}