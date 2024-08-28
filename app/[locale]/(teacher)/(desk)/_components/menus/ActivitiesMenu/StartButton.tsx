'use client'
import { IconButton, Tooltip } from "@radix-ui/themes"
import { Play } from "lucide-react"
import { useParams } from "next/navigation"
import { sendRoomEvent, ActivityStartEvent } from "@/app/api/_actions/room_events"
import { fetchOpenRoomByCode } from "@/app/api/_actions/room"
import { fetchUser } from "@/app/api/_actions/user"
import { act, useState } from "react"
import { useCardDialog } from "@/app/_hooks/useCardDialog"
import QuizAnimation from "../../activities/QuizAnimation"
import { fetchActivity } from "@/app/api/_actions/activities"


export default function StartButton({ activity_id }: { activity_id: number }) {
    const [loading, setLoading] = useState(false)
    const { room_code } = useParams<{ room_code?: string }>()
    const inRoom = !!room_code

    // Test
    const { setOpen, setContent } = useCardDialog()

    // Adds a new event to the room_events table to start the activity.
    async function handleClick() {
        if (!inRoom) return

        setLoading(true)

        // Fetch the room to provide the room_id field to the event
        const { data: room, error: roomError } = await fetchOpenRoomByCode(room_code)
        if (!room?.id || roomError) {
            setLoading(false)
            return
        }

        // Fetch the user to provide the started_by field to the event
        const { user } = await fetchUser()
        if (!user) {
            setLoading(false)
            return
        }

        const { error } = await sendRoomEvent({room_id: room.id, event: { type: 'start activity', schemaVersion:'1', started_by: user.id, activity_id } as ActivityStartEvent })
        setLoading(false)

        const { data: activity, error: activityError } = await fetchActivity(activity_id)
        if (activityError || !(activity?.object?.type === 'quiz')) return

        const content = <QuizAnimation quiz={activity.object} />
        setOpen(true)
        setContent(content)
    }


    return (
        <Tooltip content={inRoom ? 'Démarrer' : 'Lancez une session pour démarrer'}>
            <IconButton size='1' radius='full' disabled={!inRoom} onClick={handleClick} loading={loading}>
                <Play size={15} />
            </IconButton>
        </Tooltip>
    )
}