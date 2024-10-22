import logger from '@/app/_utils/logger';
import { User } from '@supabase/supabase-js';


interface getUserResponse {
    user: User | null;
    error: string | null;
}


export default async function getUser(): Promise<getUserResponse> {
    try {
        const res = await fetch('/api/user/get-user');
        const data = await res.json();

        return { user: data as User, error: null };

    } catch (error) {
        logger.error('supabase:auth', 'getUser', (error as Error).message);
        return { user: null, error: (error as Error).message };
    }
}