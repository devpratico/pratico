'use server'
import sendDiscordMessage from "@/app/(backend)/api/discord/send-message/server";


export default async function PlayGround () {
	if (process.env.NODE_ENV === 'production') {
		return (null);
	}

    const { success, error } = await sendDiscordMessage('Hello from server');

	return (<>

    <p>Hello</p>

	</>)
};