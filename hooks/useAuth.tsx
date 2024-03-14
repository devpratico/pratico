'use client'
import { createContext, useContext, useEffect, useState } from 'react';
import { User, fetchUser, onAuthStateChange, signOut } from '@/supabase/services/auth';
import { Subscription } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
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
    // It sets the user for the first time (null if not logged in)
    // And subscribes to changes in the auth state to update state accordingly
    useEffect(() => {
        // Sets the user for the first time
        const _setUser = async () => {
            setIsUserLoading(true);
            //const { data: { user } } = await fetchUser();
            try {
                const user = await fetchUser();
                setUser(user);
                setIsUserLoading(false);
                logger.log('supabase:auth', 'Authenticated user -', user);
            } catch (error) {
                logger.log('supabase:auth', 'No authenticated user -', (error as Error).message);
            }

            
        }
        _setUser();

        // Subscribes to changes in the auth state
        let onAuthChange: Subscription;
        const _subscribeToAuthChange = async () => {
            // Get the _onAuthChange method
            const _onAuthChange = await onAuthStateChange((event, session) => {
                //console.log('🔐','event', event, 'session', session);
                const user = session?.user ?? null;
                setUser(user);
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