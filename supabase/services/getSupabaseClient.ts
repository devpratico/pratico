/**
 * This file is used to initialize the Supabase client.
 * It is used to ensure that the Supabase client is only initialized once.
 * It also imports the correct client based on the environment (server or client).
 */
import { SupabaseClient } from "@supabase/supabase-js";
import { type cookies } from 'next/headers'

// For type checking
type CreateServerClientFunction = (cookieStore: ReturnType<typeof cookies>) => SupabaseClient;
type CreateClientFunction = () => SupabaseClient;

// Placeholder for the Supabase client
let supabase: SupabaseClient | null = null;

/**
 * Returns the correct Supabase client based on the environment,
 * only if it has not been initialized yet.
 */
const getSupabaseClient = async (): Promise<SupabaseClient> => {
    if (supabase) return supabase
    
    
    // If the code is running on the server
    if (typeof window === 'undefined') {
        const { cookies } = await import('next/headers');
        const cookieStore = cookies();
        const createClient: CreateServerClientFunction  = (await import('../clients/server')).default;
        const client = createClient(cookieStore);
        supabase = client;
        return client;

    // If the code is running on the client
    } else {
        const createClient: CreateClientFunction  = (await import('../clients/client')).default;
        const client = createClient();
        supabase = client;
        return client;
    }
};

export default getSupabaseClient;