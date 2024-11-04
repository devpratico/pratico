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
		const { data: { user }, error } = await supabase.auth.getUser();
		if (!user || error)
		{
			logger.error("supabase:database", "startBtn user not found", error ? error : "");
			return ;
		}
		const { data, error: existedRoomError } = await supabase.from("rooms").select("code").eq("created_by", user?.id).eq("capsule_id", capsuleId).eq("status", "open").order('created_at', { ascending: false }).limit(1);

		if (existedRoomError)
			logger.error("supabase:database", "StartBtn for session", "error while getting data", existedRoomError.details, existedRoomError.code, existedRoomError.hint, existedRoomError.message, "discord");
		else
			logger.log("supabase:database",  "StartBtn for session data", data);

		if (!data?.length)
		{
			// Start the session and get the room that is created
			const { room: createdRoom, error} = await createRoom(capsuleId)

			// Redirect to the room page
			if (createdRoom) router.push(`/room/${createdRoom.code}`)
		}
		else
		{
			router.push(`/room/${data[0].code}`);
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