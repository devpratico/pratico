'use server'
import {
    sendDiscordMessage as sendDiscordMessageServer,
    sendDiscordError   as sendDiscordErrorServer,
    SendDiscordMessageReturn
} from "./discord.server";


export async function sendDiscordError(message: string): Promise<SendDiscordMessageReturn> {
    return sendDiscordErrorServer(message);
}

export async function sendDiscordMessage(message: string): Promise<SendDiscordMessageReturn> {
    return sendDiscordMessageServer(message);
}