'use client'
import { createContext, useContext } from "react"
import { User } from "@supabase/supabase-js"
import logger from "../_utils/logger"

/**
 * AuthContextProvider is a context provider that wraps the entire app and provides the user object to all components.
 * It is used to provide the user to client components without having to pass it down through props.
 */


type AuthProviderType = {
    user: User | undefined
    userId: string | undefined
    firstName: string | undefined
    lastName: string | undefined
}

interface AuthContextProviderProps {
    user: User | undefined
    firstName: string | undefined
    lastName: string | undefined
    children: React.ReactNode
}

const AuthContext = createContext<AuthProviderType | undefined>(undefined)

export const AuthContextProvider = ({ user, firstName, lastName, children }: AuthContextProviderProps) => {
    const userId = user?.id
    logger.log('react:layout', 'AuthContextProvider', { userId })
    
    return (
        <AuthContext.Provider value={{ user, userId, firstName, lastName }}>
            {children}
        </AuthContext.Provider>
    )
}


export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) throw new Error('useAuth must be used within a AuthContextProvider')
    return context
}