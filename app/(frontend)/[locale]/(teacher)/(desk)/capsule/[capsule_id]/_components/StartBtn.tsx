'use client'
import logger from "@/app/_utils/logger";
import { createRoom } from "@/app/(backend)/api/room/room.client";
import { useParams } from "next/navigation";
import { useRouter } from "@/app/(frontend)/_intl/intlNavigation";
import { Button } from "@radix-ui/themes";
import { useState } from "react";
import { Play } from "lucide-react";
import createClient from "@/supabase/clients/client";


interface StartBtnProps {
    message?: string;
    variant?: "surface" | "outline" | "classic" | "solid" | "soft" | "ghost"
}

export default function StartBtn({ message, variant='surface' }: StartBtnProps) {
    const { capsule_id: capsuleId } = useParams<{ capsule_id: string }>()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
	const supabase = createClient();


    const handleClick = async () => {
        logger.log('react:component', 'Clicked start button', capsuleId)

        if (!capsuleId) return logger.error('supabase:database', 'No capsule id provided for start button')
    
        setLoading(true)
		const { data: existedRoomData, error: existedRoomError } = await supabase.from("rooms").select("*").eq("status", "open");
		if (existedRoomError)
			logger.error("react:component", "StartBtn for session", "error while getting data", existedRoomError);
		logger.log("react:component",  "StartBtn for session data", existedRoomData);

		if (!existedRoomData?.length)
		{
			// Start the session and get the room that is created
			const { room: createdRoom, error} = await createRoom(capsuleId)

			// Redirect to the room page
			if (createdRoom) router.push(`/room/${createdRoom.code}`)
		}
		else
		{
			const mostRecentItem = existedRoomData.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

			if (mostRecentItem)
				router.push(`/room/${mostRecentItem.code}`);
			else
				logger.error("react:component", "StartBnt session", "Error while getting the most recent active session", "discord");
		}
  
    }

    return (
        <Button
            variant={variant}
            radius='large'
            loading={loading}
            disabled={!capsuleId}
            onClick={handleClick}
            style={{ boxShadow: 'none', ...(variant === 'surface' ? { backgroundColor: 'var(--background)'} : {}) }}
        >
            <Play size={15} strokeWidth='3' />
            {message}
        </Button>
    )
}