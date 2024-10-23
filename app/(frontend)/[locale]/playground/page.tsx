'use client';
import { Button } from "@radix-ui/themes";
import { sendDiscordMessage } from "@/app/(backend)/api/discord/wrappers";



export default function PlayGround () {
	if (process.env.NODE_ENV === 'production') {
		return (null);
	}

    const handleClick = async () => {
        const response = await sendDiscordMessage('Hello from the frontend');
        console.log(response);
    };

	return (<>
        <Button onClick={handleClick}>Send Message</Button>
        
	</>)
};