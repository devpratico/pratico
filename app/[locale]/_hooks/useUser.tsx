'use client'
import { User } from "@supabase/supabase-js";
import { createContext, useContext } from "react";


interface UserContextProps {
    user: User | undefined;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export function UserProvider({ user, children }: { user: User | undefined, children: React.ReactNode }) {
    return (
        <UserContext.Provider value={{ user }}>
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