'use client'
import { Poll, PollQuestion, PollChoice } from "@/app/_types/poll2"
//import { changeTitle } from "@/app/_types/activity"
//import { create } from 'zustand'
//import { createStore } from 'zustand/vanilla'
//import { useStore } from 'zustand'
import logger from "@/app/_utils/logger"
import { produce } from "immer"
import { uniqueTimestampId } from "@/app/_utils/utils_functions"
//import { createContext, useContext, useRef } from "react"
import { create } from 'zustand'


type Id = number | string

type CurrentActivity = {
    id?: Id // id used in Supabase to save. If no provided, will be saved as a new entry
    activity: Poll
    currentQuestionId: Id
}

type ActivityCreationState = {
    showActivityCreation: boolean
    currentActivity: CurrentActivity | null

    /** Being saved on Supabase */
    isSaving: boolean
}

type ActivityCreationActions = {
    openActivity: ({id, activity}: {id?: Id, activity: Poll}) => void
    closeActivity: () => void
    setIsSaving: (isSaving: boolean) => void
    editTitle: (title: string) => void
    changeCurrentQuestionId: (id: Id) => void
    changeCurrentQuestionIndex: (index: number) => void
    addEmptyQuestion: () => { newId: Id | undefined }
    changeQuestionText: (id: Id, text: string) => void
    deleteQuestion: (id: Id) => void
    duplicateQuestion: (id: Id) => { newId: Id | undefined }
    addEmptyChoice: (questionId: Id) => void
    addChoice: (questionId: Id, choice: Partial<PollChoice>) => { newId: Id | undefined } // Not sure if the newId is needed
    changeChoiceText: (choiceId: Id, text: string) => void // Let's say all choices ids are unique
    deleteChoice: (choiceId: Id) => void
}


type ActivityCreationStore = ActivityCreationState & ActivityCreationActions


//const createActivityCreationStore = () => createStore<ActivityCreationStore>((set, get) => ({
const useActivityCreationStore = create<ActivityCreationStore>((set, get) => ({
    showActivityCreation: false,

    currentActivity: null,

    isSaving: false,

    openActivity: ({id, activity}) => {
        if (activity.questions.length === 0) {
            logger.error('zustand:action', 'Cannot open an activity with no questions (array length is 0)')
            return
        }
        set({
            showActivityCreation: true,
            currentActivity: { id, activity, currentQuestionId: activity.questions[0].id }
        })
    },

    closeActivity: () => {
        set({ showActivityCreation: false, currentActivity: null })
    },

    setIsSaving: (isSaving) => {
        set({ isSaving })
    },

    editTitle: (title: string) => {
        if (!get().currentActivity) {
            logger.error('zustand:action', 'Cannot edit the title of a non-existing activity')
            return
        }
        set(produce<ActivityCreationStore>(state => {
            state.currentActivity!.activity.title = title
        }))
    },

    changeCurrentQuestionId: (id: Id) => {
        if (!get().currentActivity) {
            logger.error('zustand:action', 'Cannot change the current question of a non-existing activity')
            return
        }
        set(state => {
            const currentActivity = state.currentActivity!
            const index = currentActivity.activity.questions.findIndex(q => q.id === id)
            if (index === -1) {
                logger.error('zustand:action', 'Cannot change the current question to a non-existing question')
                return state
            }

            return { currentActivity: { ...currentActivity, currentQuestionId: id } }
        })
    },

    /** Rather than providing the id of the question, change the current question by its index */
    changeCurrentQuestionIndex: (index: number) => {
        const currentActivity = get().currentActivity

        if (!currentActivity) {
            logger.error('zustand:action', 'Cannot change the current question of a non-existing activity')
            return
        }

        if (index < 0 || index >= currentActivity.activity.questions.length) {
            logger.error('zustand:action', 'Cannot change the current question to an index out of range')
            return
        }

        get().changeCurrentQuestionId(currentActivity.activity.questions[index].id)
    },

    addEmptyQuestion: () => {
        if (!get().currentActivity) {
            logger.error('zustand:action', 'Cannot add a question to a non-existing activity')
            return { newId: undefined }
        }

        const newQuestionId = uniqueTimestampId('question-')
        const newQuestion: PollQuestion = { id: newQuestionId, text: '', choices: [] }

        set(produce<ActivityCreationStore>(state => {
            state.currentActivity!.activity.questions.push(newQuestion)

            // Move to the new question
            state.currentActivity!.currentQuestionId = newQuestionId
        }))

        return { newId: newQuestionId }
    },

    changeQuestionText: (id: Id, text: string) => {
        if (!get().currentActivity) {
            logger.error('zustand:action', 'Cannot change the text of a question in a non-existing activity')
            return
        }
        set(produce<ActivityCreationStore>(state => {
            const currentActivity = state.currentActivity!
            const question = currentActivity.activity.questions.find(q => q.id === id)
            if (question) question.text = text
        }))
    },

    deleteQuestion: (id: Id) => {
        if (!get().currentActivity) {
            logger.error('zustand:action', 'Cannot delete a question from a non-existing activity')
            return
        }
        const index = get().currentActivity!.activity.questions.findIndex(q => q.id === id) // We'll need this later

        set(produce<ActivityCreationStore>(state => {
            const currentActivity = state.currentActivity!
            currentActivity.activity.questions = currentActivity.activity.questions.filter(q => q.id !== id)
            // If we were on the question to be deleted, stay to the same index (if in range, otherwise go to the previous one)
            if (currentActivity.currentQuestionId === id) {
                const newIndex = Math.min(index, currentActivity.activity.questions.length - 1)
                currentActivity.currentQuestionId = currentActivity.activity.questions[newIndex].id
            }
        }))
    },

    duplicateQuestion: (id: Id) => {
        if (!get().currentActivity) {
            logger.error('zustand:action', 'Cannot duplicate a question in a non-existing activity')
            return { newId: undefined }
        }
        const newQuestionId = uniqueTimestampId('question-')

        set(produce<ActivityCreationStore>(state => {
            const currentActivity = state.currentActivity!
            const question = currentActivity.activity.questions.find(q => q.id === id)
            if (question) {
                const newQuestion = { ...question, id: newQuestionId }
                const index = currentActivity.activity.questions.findIndex(q => q.id === id)
                currentActivity.activity.questions.splice(index + 1, 0, newQuestion)

                // Move to the new question
                currentActivity.currentQuestionId = newQuestionId
            } else {
                logger.error('zustand:action', 'Cannot duplicate a question. Question not found. Id:', id)
            }
        }))

        return { newId: newQuestionId }
    },

    addEmptyChoice: (questionId: Id) => {
        if (!get().currentActivity) {
            logger.error('zustand:action', 'Cannot add a choice to a question in a non-existing activity')
            return
        }
        set(produce<ActivityCreationStore>(state => {
            const currentActivity = state.currentActivity!
            const question = currentActivity.activity.questions.find(q => q.id === questionId)
            if (question) question.choices.push({ id: uniqueTimestampId('choice-'), text: '' })
        }))
    },

    addChoice: (questionId: Id, choice: Partial<PollChoice>) => {
        if (!get().currentActivity) {
            logger.error('zustand:action', 'Cannot add a choice to a question in a non-existing activity')
            return { newId: undefined }
        }

        const defaultEmptyChoice: PollChoice = { id: uniqueTimestampId('choice-'), text: '' } // Default empty choice
        const newChoice = { ...defaultEmptyChoice, ...choice } // Merge the default empty choice with the provided choice

        set(produce<ActivityCreationStore>(state => {
            const currentActivity = state.currentActivity!
            const question = currentActivity.activity.questions.find(q => q.id === questionId)
            if (question) question.choices.push(newChoice)
        }))

        return { newId: newChoice.id }
    },

    changeChoiceText: (choiceId: Id, text: string) => {
        if (!get().currentActivity) {
            logger.error('zustand:action', 'Cannot change the text of a choice in a non-existing activity')
            return
        }
        set(produce<ActivityCreationStore>(state => {
            const currentActivity = state.currentActivity!
            const choice = currentActivity.activity.questions.flatMap(q => q.choices).find(c => c.id === choiceId)
            if (choice) choice.text = text
        }))
    },

    deleteChoice: (choiceId: Id) => {
        if (!get().currentActivity) {
            logger.error('zustand:action', 'Cannot delete a choice from a non-existing activity')
            return
        }
        set(produce<ActivityCreationStore>(state => {
            const currentActivity = state.currentActivity!
            const choice = currentActivity.activity.questions.flatMap(q => q.choices).find(c => c.id === choiceId)
            if (choice) {
                // Find the question it belongs to
                const question = currentActivity.activity.questions.find(q => q.choices.includes(choice))
                if (question) question.choices = question.choices.filter(c => c.id !== choiceId)
            }
        }))
    }

}))


/*
type ActivityCreationStoreApi = ReturnType<typeof createActivityCreationStore>
const ActivityCreationContext = createContext<ActivityCreationStoreApi | undefined>(undefined)

const ActivityCreationStoreProvider = ({children}: {children: React.ReactNode}) => {
    const storeRef = useRef<ActivityCreationStoreApi>()

    if (!storeRef.current) {
        storeRef.current = createActivityCreationStore()
    }

    return (
        <ActivityCreationContext.Provider value={storeRef.current}>
            {children}
        </ActivityCreationContext.Provider>
    )
}

const useActivityCreationStore = <T,>(selector: (store: ActivityCreationStore) => T): T => {
    const store = useContext(ActivityCreationContext)
    if (!store) {
        throw new Error('useActivityCreationStore must be used within a ActivityCreationStoreProvider')
    }

    return useStore(store, selector)
}


export { ActivityCreationStoreProvider, useActivityCreationStore }
*/

export default useActivityCreationStore