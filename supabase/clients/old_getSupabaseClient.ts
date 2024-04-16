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

/**
 * Returns the correct Supabase client based on the environment,
 */
const getSupabaseClient = async (): Promise<SupabaseClient> => {

    // If the code is running on the server
    if (typeof window === 'undefined') {
        const { cookies } = await import('next/headers');
        const cookieStore = cookies(); // Should be called every time to get the latest cookies
        const createClient: CreateServerClientFunction  = (await import('./old_server')).default;
        const client = createClient(cookieStore);
        return client;

    // If the code is running on the client
    } else {
        const createClient: CreateClientFunction  = (await import('./client')).default;
        const client = createClient();
        return client;
    }
};

export default getSupabaseClient;