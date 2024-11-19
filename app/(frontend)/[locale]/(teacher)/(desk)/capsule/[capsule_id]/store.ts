'use client'
import { Poll } from "@/app/_types/poll2"
//import { changeTitle } from "@/app/_types/activity"
import { create } from 'zustand'
import logger from "@/app/_utils/logger"
import { produce } from "immer"


type CurrentActivity = {
    id: number
    activity: Poll
    currentQuestion: {
        id: string
        index: number
    }
}

type ActivityCreationState = {
    showActivityCreation: boolean
    currentActivity: CurrentActivity | null
}

type ActivityCreationActions = {
    openActivity:           ({id, activity}: {id: number, activity: Poll}) => void
    closeActivity:          () => void
    editTitle:              (title: string) => void
    changeCurrentQuestion:  (arg: {id: string} | {index: number}) => void
}


type ActivityCreationStore = ActivityCreationState & ActivityCreationActions


const useActivityCreationStore = create<ActivityCreationStore>((set, get) => ({

    showActivityCreation: false,

    currentActivity: null,

    openActivity: ({id, activity}) => {
        if (activity.questions.length === 0) {
            logger.error('zustand:action', 'Cannot open an activity with no questions (array length is 0)')
            return
        }
        set({
            showActivityCreation: true,
            currentActivity: { id, activity, currentQuestion: { id: activity.questions[0].id, index: 0 } }
        })
    },

    closeActivity: () => {
        set({ showActivityCreation: false, currentActivity: null })
    },

    editTitle: (title: string) => {
        if (!get().currentActivity) {
            logger.error('zustand:action', 'Cannot edit the title of a non-existing activity')
            return
        }
        set(produce((state) => {
            state.currentActivity!.activity.title = title
        }))
    },

    changeCurrentQuestion: (arg) => {
        if (!get().currentActivity) {
            logger.error('zustand:action', 'Cannot change the current question of a non-existing activity')
            return
        }
        set(state => {
            const currentActivity = state.currentActivity!
            if ('id' in arg) {
                const index = currentActivity.activity.questions.findIndex(q => q.id === arg.id)
                return { currentActivity: { ...currentActivity, currentQuestion: { id: arg.id, index } } }
            } else {
                const id = currentActivity.activity.questions[arg.index].id
                return { currentActivity: { ...currentActivity, currentQuestion: { id, index: arg.index } } }
            }
        })
    }

}))