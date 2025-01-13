'use client'
import { createContext, useContext } from "react"
import { User } from "@supabase/supabase-js"
import logger from "../../../_utils/logger"

/**
 * UserContextProvider is a context provider that wraps the entire app and provides the user object to all components.
 * It is used to provide the user to client components without having to pass it down through props.
 */


type UserProviderType = {
    user: User | undefined
    userId: string | undefined
    firstName: string | undefined
    lastName: string | undefined
    isSubscribed: boolean | undefined
}

interface UserContextProviderProps {
    user: User | undefined
    firstName: string | undefined
    lastName: string | undefined
    isSubscribed: boolean | undefined
    children: React.ReactNode
}

const UserContext = createContext<UserProviderType | undefined>(undefined)

export const UserContextProvider = ({ user, firstName, lastName, isSubscribed, children }: UserContextProviderProps) => {
    const userId = user?.id
    logger.log('react:layout', 'UserContextProvider', { userId })
    
    return (
        <UserContext.Provider value={{ user, userId, firstName, lastName, isSubscribed }}>
            {children}
        </UserContext.Provider>
    )
}


export const useUser = () => {
    const context = useContext(UserContext)
    if (context === undefined) throw new Error('useUser must be used within a UserContextProvider')
    return context
}