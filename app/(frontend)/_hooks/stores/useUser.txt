import { User } from "@supabase/supabase-js"
import { createStore, StoreApi } from "zustand/vanilla"
import { useStore } from "zustand"
import { createContext, useRef, useContext } from "react"


type State = {
    user: User | undefined
    firstName: string | undefined
    lastName: string | undefined
    isSubscribed: boolean | undefined
}

const createUserStore = (initialState: State) => createStore<State>((set, get) => ({
    user: initialState.user,
    firstName: initialState.firstName,
    lastName: initialState.lastName,
    isSubscribed: initialState.isSubscribed
}))

const UserContext = createContext<StoreApi<State> | undefined>(undefined)

/**
 * This store is initialized by a provider, as explained in the zustand documentation.
 */
export const UserContextProvider = ({ value, children }: { value: State, children: React.ReactNode }) => {
    const storeRef = useRef<StoreApi<State>>();

    if (!storeRef.current) {
        storeRef.current = createUserStore(value)
    }

    return (
        <UserContext.Provider value={storeRef.current}>
            {children}
        </UserContext.Provider>
    )
}

const useUser = <T,>(selector: (store: State) => T): T => {
    const store = useContext(UserContext)
    if (!store) throw new Error('useUser must be used within a UserContextProvider')
    return useStore(store, selector)
}

export default useUser