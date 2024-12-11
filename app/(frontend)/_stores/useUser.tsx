import { User } from "@supabase/supabase-js"
import { createStore } from "zustand"


type State = {
    user: User | undefined
    userId: string | undefined
    firstName: string | undefined
    lastName: string | undefined
    isSubscribed: boolean | undefined
}

const createUserStore = (initialState: State) => createStore<State>((set, get) => ({
    user: initialState.user,
    userId: initialState.userId,
    firstName: initialState.firstName,
    lastName: initialState.lastName,
    isSubscribed: initialState.isSubscribed
}))