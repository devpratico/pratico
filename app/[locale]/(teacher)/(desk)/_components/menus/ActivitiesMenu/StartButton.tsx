'use client'
import { IconButton, Tooltip } from "@radix-ui/themes"
import { Play } from "lucide-react"
import { useParams } from "next/navigation"
import { sendRoomEvent, ActivityStartEvent } from "@/app/api/actions/room_events"
import { fetchOpenRoomByCode } from "@/app/api/actions/room"
import { fetchUser } from "@/app/api/actions/user"
import { useState } from "react"
import { useCardDialog } from "@/app/_hooks/useCardDialog"
import QuizAnimation from "../../activities/QuizAnimation"
import { fetchActivity } from "@/app/api/actions/activities"
import { saveRoomActivitySnapshot, ActivitySnapshot } from "@/app/api/actions/room"
import logger from "@/app/_utils/logger"
import { Quiz, Poll } from "@/app/_hooks/usePollQuizCreation"
import PollAnimation from "../../activities/PollAnimation"


export default function StartButton({ activity_id }: { activity_id: number }) {
    const [loading, setLoading] = useState(false)
    const { room_code } = useParams<{ room_code?: string }>()
    const inRoom = !!room_code


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
        

        const { data: activity, error: activityError } = await fetchActivity(activity_id)
        if (activityError || !activity) return

        let activitySnapshot: ActivitySnapshot

        // Save the activity snapshot in the room
        if (activity.type === 'quiz') {
            activitySnapshot = {
                activityId: activity_id,
                currentQuestionIndex: 0,
                currentQuestionState: 'answering'
            }
        } else if (activity.type === 'poll') {
            activitySnapshot = {
                activityId: activity_id,
                currentQuestionIndex: 0,
                currentQuestionState: 'answering',
                votes: (activity.object as Poll).questions.map(() => 0)
            }
        } else {
            logger.log('react:component', 'StartButton', 'Impossible to set activity snapshot, type not recognized:', activity.type)
            return
        }
        
        const { error: saveActivityError } = await saveRoomActivitySnapshot(room.id, activitySnapshot)

        setLoading(false)
    }


    return (
        <Tooltip content={inRoom ? 'Démarrer' : 'Lancez une session pour démarrer'}>
            <IconButton size='1' radius='full' disabled={!inRoom} onClick={handleClick} loading={loading}>
                <Play size={15} />
            </IconButton>
        </Tooltip>
    )
}