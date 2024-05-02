'use client'
import { User } from "@supabase/supabase-js";
import { createContext, useContext } from "react";
import { getRandomColor } from "@/app/_utils/codeGen";


interface UserContextProps {
    user: User | undefined;
    color?: string;
    firstName: string | null;
    lastName: string | null;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);



type UserProviderProps = UserContextProps & { children: React.ReactNode }

export function UserProvider({ user, firstName, lastName, children }: UserProviderProps) {

    // Todo : fetch a color from supabase
    const color = getRandomColor();

    return (
        <UserContext.Provider value={{ user, color, firstName, lastName }}>
            {children}
        </UserContext.Provider>
    );
}


export function useUser() {
    const context = useContext(UserContext);
    if (!context) {throw new Error('useUser must be used within a UserProvider')}
    return context;
}