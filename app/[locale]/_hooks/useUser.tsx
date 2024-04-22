'use client'
import { User } from "@supabase/supabase-js";
import { createContext, useContext } from "react";


interface UserContextProps {
    user: User | undefined;
    firstName?: string;
    lastName?: string;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);



type UserProviderProps = UserContextProps & { children: React.ReactNode }

export function UserProvider({ user, firstName, lastName, children }: UserProviderProps) {
    return (
        <UserContext.Provider value={{ user, firstName, lastName }}>
            {children}
        </UserContext.Provider>
    );
}


export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}