import logger from "@/app/_utils/logger";

const webhookUrl = process.env.DISCORD_WEBHOOK_URL || '';


export const sendDiscordMessage = async (message: string) => {

    if (!webhookUrl) {
        logger.error('next:api', 'sendDiscordMessage', 'No webhook url provided. Please provide the DISCORD_WEBHOOK_URL environment variable');
        return;
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
            logger.error('next:api', 'sendDiscordMessage', 'Error sending message');
        }

        return;

    } catch (error) {
        logger.error('next:api', 'sendDiscordMessage', 'Error sending message:', error);
    }
};