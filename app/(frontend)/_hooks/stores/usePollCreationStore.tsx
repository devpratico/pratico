import { Poll, PollQuestion, PollChoice } from "@/core/domain/entities/activities/poll"
import logger from "@/app/_utils/logger"
import { produce } from "immer"
import { uniqueTimestampId } from "@/app/_utils/utils_functions"
import { create } from 'zustand'


type Id = number | string

type CurrentPoll = {
    id?: Id // id used in Supabase to save. If no provided, will be saved as a new entry
    poll: Poll
    currentQuestionId: Id
}

type PollCreationState = {
    showPollCreation: boolean
    currentPoll: CurrentPoll | null
}

type PollCreationActions = {
    openPoll: ({id, poll}: {id?: Id, poll: Poll}) => void
    setPollId: (id: Id) => void
    setShowPollCreation: (show: boolean) => void
    deletePoll: () => void
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


type PollCreationStore = PollCreationState & PollCreationActions


//const createPollCreationStore = () => createStore<PollCreationStore>((set, get) => ({
const usePollCreationStore = create<PollCreationStore>((set, get) => ({
    showPollCreation: false,

    currentPoll: null,

    openPoll: ({id, poll}) => {
        if (poll.questions.length === 0) {
            logger.error('zustand:action', 'Cannot open an poll with no questions (array length is 0)')
            return
        }
        set({
            showPollCreation: true,
            currentPoll: { id, poll, currentQuestionId: poll.questions[0].id }
        })
    },

    setPollId: (id: Id) => {
        if (!get().currentPoll) {
            logger.error('zustand:action', 'Cannot set the id of a non-existing poll')
            return
        }
        set(produce<PollCreationStore>(state => {
            state.currentPoll!.id = id
        }))
    },

    setShowPollCreation: (show: boolean) => {
        set({ showPollCreation: show })
    },

    deletePoll: () => {
        set({ showPollCreation: false, currentPoll: null })
    },

    editTitle: (title: string) => {
        if (!get().currentPoll) {
            logger.error('zustand:action', 'Cannot edit the title of a non-existing poll')
            return
        }
        set(produce<PollCreationStore>(state => {
            state.currentPoll!.poll.title = title
        }))
    },

    changeCurrentQuestionId: (id: Id) => {
        if (!get().currentPoll) {
            logger.error('zustand:action', 'Cannot change the current question of a non-existing poll')
            return
        }
        set(state => {
            const currentPoll = state.currentPoll!
            const index = currentPoll.poll.questions.findIndex(q => q.id === id)
            if (index === -1) {
                logger.error('zustand:action', 'Cannot change the current question to a non-existing question')
                return state
            }

            return { currentPoll: { ...currentPoll, currentQuestionId: id } }
        })
    },

    /** Rather than providing the id of the question, change the current question by its index */
    changeCurrentQuestionIndex: (index: number) => {
        const currentPoll = get().currentPoll

        if (!currentPoll) {
            logger.error('zustand:action', 'Cannot change the current question of a non-existing poll')
            return
        }

        if (index < 0 || index >= currentPoll.poll.questions.length) {
            logger.error('zustand:action', 'Cannot change the current question to an index out of range')
            return
        }

        get().changeCurrentQuestionId(currentPoll.poll.questions[index].id)
    },

    addEmptyQuestion: () => {
        if (!get().currentPoll) {
            logger.error('zustand:action', 'Cannot add a question to a non-existing poll')
            return { newId: undefined }
        }

        const newQuestionId = uniqueTimestampId('question-')
        const newQuestion: PollQuestion = { id: newQuestionId, text: '', choices: [] }

        set(produce<PollCreationStore>(state => {
            state.currentPoll!.poll.questions.push(newQuestion)

            // Move to the new question
            state.currentPoll!.currentQuestionId = newQuestionId
        }))

        return { newId: newQuestionId }
    },

    changeQuestionText: (id: Id, text: string) => {
        if (!get().currentPoll) {
            logger.error('zustand:action', 'Cannot change the text of a question in a non-existing poll')
            return
        }
        set(produce<PollCreationStore>(state => {
            const currentPoll = state.currentPoll!
            const question = currentPoll.poll.questions.find(q => q.id === id)
            if (question) question.text = text
        }))
    },

    deleteQuestion: (id: Id) => {
        if (!get().currentPoll) {
            logger.error('zustand:action', 'Cannot delete a question from a non-existing poll')
            return
        }

        // If there is only one question left in the poll, don't delete
        if (get().currentPoll!.poll.questions.length === 1) {
            logger.error('zustand:action', 'Cannot delete the only question in the poll')
            return
        }


        const index = get().currentPoll!.poll.questions.findIndex(q => q.id === id) // We'll need this later

        set(produce<PollCreationStore>(state => {
            const currentPoll = state.currentPoll!
            currentPoll.poll.questions = currentPoll.poll.questions.filter(q => q.id !== id)
            // If we were on the question to be deleted, stay to the same index (if in range, otherwise go to the previous one)
            if (currentPoll.currentQuestionId === id) {
                const newIndex = Math.min(index, currentPoll.poll.questions.length - 1)
                currentPoll.currentQuestionId = currentPoll.poll.questions[newIndex].id
            }
        }))
    },

    duplicateQuestion: (id: Id) => {
        if (!get().currentPoll) {
            logger.error('zustand:action', 'Cannot duplicate a question in a non-existing poll')
            return { newId: undefined }
        }
        const newQuestionId = uniqueTimestampId('question-')

        set(produce<PollCreationStore>(state => {
            const currentPoll = state.currentPoll!
            const question = currentPoll.poll.questions.find(q => q.id === id)
            if (question) {

                // Duplicate the choices, and change all of their ids
                const newChoices = question.choices.map(choice => ({ ...choice, id: uniqueTimestampId('choice-') }))

                const newQuestion: PollQuestion = { id: newQuestionId, text: question.text, choices: newChoices }
                
                const index = currentPoll.poll.questions.findIndex(q => q.id === id)
                currentPoll.poll.questions.splice(index + 1, 0, newQuestion)

                // Move to the new question
                currentPoll.currentQuestionId = newQuestionId
            } else {
                logger.error('zustand:action', 'Cannot duplicate a question. Question not found. Id:', id)
            }
        }))

        return { newId: newQuestionId }
    },

    addEmptyChoice: (questionId: Id) => {
        if (!get().currentPoll) {
            logger.error('zustand:action', 'Cannot add a choice to a question in a non-existing poll')
            return
        }
        set(produce<PollCreationStore>(state => {
            const currentPoll = state.currentPoll!
            const question = currentPoll.poll.questions.find(q => q.id === questionId)
            if (question) question.choices.push({ id: uniqueTimestampId('choice-'), text: '' })
        }))
    },

    addChoice: (questionId: Id, choice: Partial<PollChoice>) => {
        if (!get().currentPoll) {
            logger.error('zustand:action', 'Cannot add a choice to a question in a non-existing poll')
            return { newId: undefined }
        }

        const defaultEmptyChoice: PollChoice = { id: uniqueTimestampId('choice-'), text: '' } // Default empty choice
        const newChoice = { ...defaultEmptyChoice, ...choice } // Merge the default empty choice with the provided choice

        set(produce<PollCreationStore>(state => {
            const currentPoll = state.currentPoll!
            const question = currentPoll.poll.questions.find(q => q.id === questionId)
            if (question) question.choices.push(newChoice)
        }))

        return { newId: newChoice.id }
    },

    changeChoiceText: (choiceId: Id, text: string) => {
        if (!get().currentPoll) {
            logger.error('zustand:action', 'Cannot change the text of a choice in a non-existing poll')
            return
        }
        set(produce<PollCreationStore>(state => {
            const currentPoll = state.currentPoll!
            const choice = currentPoll.poll.questions.flatMap(q => q.choices).find(c => c.id === choiceId)
            if (choice) choice.text = text
        }))
    },

    deleteChoice: (choiceId: Id) => {
        if (!get().currentPoll) {
            logger.error('zustand:action', 'Cannot delete a choice from a non-existing poll')
            return
        }
        set(produce<PollCreationStore>(state => {
            const currentPoll = state.currentPoll!
            const choice = currentPoll.poll.questions.flatMap(q => q.choices).find(c => c.id === choiceId)
            if (choice) {
                // Find the question it belongs to
                const question = currentPoll.poll.questions.find(q => q.choices.includes(choice))
                if (question) question.choices = question.choices.filter(c => c.id !== choiceId)
            }
        }))
    }

}))


/*
type PollCreationStoreApi = ReturnType<typeof createPollCreationStore>
const PollCreationContext = createContext<PollCreationStoreApi | undefined>(undefined)

const PollCreationStoreProvider = ({children}: {children: React.ReactNode}) => {
    const storeRef = useRef<PollCreationStoreApi>()

    if (!storeRef.current) {
        storeRef.current = createPollCreationStore()
    }

    return (
        <PollCreationContext.Provider value={storeRef.current}>
            {children}
        </PollCreationContext.Provider>
    )
}

const usePollCreationStore = <T,>(selector: (store: PollCreationStore) => T): T => {
    const store = useContext(PollCreationContext)
    if (!store) {
        throw new Error('usePollCreationStore must be used within a PollCreationStoreProvider')
    }

    return useStore(store, selector)
}


export { PollCreationStoreProvider, usePollCreationStore }
*/

export default usePollCreationStore