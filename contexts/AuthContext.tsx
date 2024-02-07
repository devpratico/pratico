'use client'
import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';


interface AuthContextProps {
    user: User | null;
    isUserLoading: boolean;

    //signIn: () => void;
    signOut: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isUserLoading, setIsUserLoading] = useState(true);
    const supabase = createClient();

    // This useEffect runs once when the component mounts
    // It sets the user for the first time (null if not logged in)
    // And subscribes to changes in the auth state to update state accordingly
    useEffect(() => {

        // Sets the user for the first time
        const _setUser = async () => {
            setIsUserLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            setIsUserLoading(false);
        }
        _setUser();

        // Subscribes to changes in the auth state
        const onAuthChange = supabase.auth.onAuthStateChange((event, session) => {
            console.log('🔐','event', event, 'session', session);
            const user = session?.user ?? null;
            setUser(user);
            setIsUserLoading(false);
        }).data.subscription;

        // Cleanup (unsubscribe when component unmounts)
        return () => {
            onAuthChange.unsubscribe();
        };
    }, [supabase]);

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider value={{ user, signOut, isUserLoading}}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within a AuthProvider');
    return context;
}