'use client'
import { sendDiscordError } from "@/app/(backend)/api/discord/discord.client";


export default function PlayGround () {
	if (process.env.NODE_ENV === 'production') {
		return (null);
	}

    //const { error } = await sendDiscordError('Hello from the server');
    const handleClick = async () => {
        const { error } = await sendDiscordError('Hello from the client');
        console.log(error);
    }

	return (<>

    <p>Hello</p>
    <button onClick={handleClick}>Send error</button>

	</>)
};