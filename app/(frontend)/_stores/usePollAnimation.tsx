import { Poll, PollUserAnswer, isPollSnapshot, PollSnapshot } from "@/app/_types/poll2"
import { create } from "zustand"
import { produce } from "immer"
import { isEqual } from "lodash"
import logger from "@/app/_utils/logger"
//import { uniqueTimestampId } from "@/app/_utils/utils_functions"
import createClient from "@/supabase/clients/client"
import { Tables } from "@/supabase/types/database.types"
import { saveRoomActivitySnapshot } from "@/app/(backend)/api/room/room.client"


type Id = number | string

/** Looks a lot like PollSnapshot, but I prefer to keep client state and server data decoupled. */
type CurrentPoll = {
    id: Id,
    poll: Poll
    currentQuestionId: string
    questionState: 'answering' | 'show results'
    answers: PollUserAnswer[]
}

type PollState = {
    /** Wether or not to show the activity*/
    shouldShowPoll: boolean

    /** The activity to show, if any */
    currentPoll: CurrentPoll | null
}

type PollActions = {
    openPoll: (poll: Poll, id: Id) => void
    closePoll: () => void
    setAnswers: (answers: PollUserAnswer[]) => void
    addAnswer: (answer: PollUserAnswer) => void
    removeAnswer: (answerId: string) => void
    changeQuestionId: (questionId: string) => void
    changeQuestionState: (state: CurrentPoll['questionState']) => void
}

type PollStore = PollState & PollActions


const usePollAnimation = create<PollStore>((set, get) => ({

    shouldShowPoll: false,
    
    currentPoll: null,

    openPoll: (poll, id) => {
        set({
            shouldShowPoll: true,
            currentPoll: {
                id: id,
                poll: poll,
                currentQuestionId: poll.questions[0].id,
                questionState: 'answering',
                answers: []
            }
        })
    },

    closePoll: () => {
        set({ shouldShowPoll: false, currentPoll: null })
    },

    setAnswers: (answers) => {
        set(produce<PollState>(draft => {
            draft.currentPoll!.answers = answers
        }))
    },

    addAnswer: (answer) => {
        set(produce<PollState>(draft => {
            draft.currentPoll!.answers.push(answer)
        }))
    },

    removeAnswer: (answerId) => {
        set(produce<PollState>(draft => {
            draft.currentPoll!.answers = draft.currentPoll!.answers.filter(a => a.userId !== answerId)
        }))
    },

    changeQuestionId: (questionId) => {
        set(produce<PollState>(draft => {
            draft.currentPoll!.currentQuestionId = questionId
        }))
    },

    changeQuestionState: (state) => {
        set(produce<PollState>(draft => {
            draft.currentPoll!.questionState = state
        }))
    }

}))

export default usePollAnimation


// SERVICES

/** Any time the answers change in the database, update them in the state */
export function syncRemoteAnswers(roomCode: string) {
    const supabase = createClient()
    const channel  = supabase.channel(roomCode + "_realtime")
    const roomUpdate = {
        event: 'UPDATE',
        schema: 'public',
        table: 'rooms',
        filter: `code=eq.${roomCode} AND status=eq.open`
    } as any // TODO: handle type

    channel.on('postgres_changes', roomUpdate , (payload): void => {
        const newRecord = payload.new as Tables<'rooms'>
        const snapshot = newRecord.activity_snapshot
        logger.log('supabase:realtime', "activity snapshot updated", snapshot)

        if (!isPollSnapshot(snapshot)) {
            logger.log('supabase:realtime', "activity snapshot is not a poll. Doing nothing.")
            return
        }

        const newAnswers = (snapshot as PollSnapshot).answers
        const oldAnswers = usePollAnimation.getState().currentPoll?.answers

        if (isEqual(newAnswers, oldAnswers)) {
            logger.log('supabase:realtime', "answers are the same. Doing nothing.")
            return
        }

        usePollAnimation.getState().setAnswers(newAnswers)
        
    }).subscribe()


    // Use this cleanup function to remove the channel when the component unmounts
    return () => supabase.removeChannel(channel)
}


/** Any time the local store changes (from a local action), save it in the database */
export function syncLocalState(roomId: number) {

    usePollAnimation.subscribe(async state => {
        const currentPoll = state.currentPoll
        if (!currentPoll) return

        const snapshot = {
            type: 'poll',
            activityId: currentPoll.id,
            currentQuestionId: currentPoll.currentQuestionId,
            currentQuestionState: currentPoll.questionState,
            answers: currentPoll.answers
        } as PollSnapshot

        logger.log('supabase:realtime', "saving poll snapshot to database", snapshot)
        await saveRoomActivitySnapshot(roomId, snapshot)
    })

}