'use client'
import { createContext, useContext, useEffect, useState } from 'react';
import { User, fetchUser, onAuthStateChange, signOut } from '@/supabase/services/auth';
import { Subscription } from '@supabase/supabase-js';
//import { useRouter } from 'next/navigation';
import logger from '@/utils/logger';

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
    //const router = useRouter();

    // This useEffect runs once when the component mounts
    // It subscribes to changes in the auth state to update state accordingly
    useEffect(() => {
        // Subscribes to changes in the auth state
        // No need to set the user manually on mount, onAuthStateChange will do it for us
        setIsUserLoading(true);
        let onAuthChange: Subscription;
        const _subscribeToAuthChange = async () => {
            // Get the _onAuthChange method
            const _onAuthChange = await onAuthStateChange((event, session) => {
                logger.log('supabase:auth', 'event', event, 'session', session);
                setUser(session?.user ?? null);
                setIsUserLoading(false);
                // TODO: SHOULD WE REFRESH ?
                //router.refresh();
            })
            // Set the onAuthChange method
            onAuthChange = _onAuthChange.data.subscription;
        }
        _subscribeToAuthChange();
        
        // Cleanup (unsubscribe when component unmounts)
        return () => {
            if (onAuthChange) onAuthChange.unsubscribe();
        };
    }, []);

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