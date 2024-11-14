'use client'
import { Poll } from "@/app/_types/poll2"
import { create } from 'zustand'

/*type Store = {
    capsule: {
        id: string
        title: string
        currentPage: {
            id: string
            index: number
        }
        totalPages: number
    }
}*/

type ActivityCreationState = {
    id: number
    activity: Poll
    currentQuestion: {
        id: string
        index: number
    }
} | null

type ActivityCreationActions = {
    editTitle: (title: string) => void
}


type ActivityCreationStore = ( ActivityCreationState & ActivityCreationActions )// | null // Can be null if no activity is being created


/*const useActivityCreationStore = create<ActivityCreationStore>((set, get) => {
    return null
})*/