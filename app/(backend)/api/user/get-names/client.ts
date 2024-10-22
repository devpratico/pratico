import logger from '@/app/_utils/logger';


interface getNamesResponse {
    data: { firstName: string, lastName: string} | null;
    error: string | null;
}


export default async function getNames(): Promise<getNamesResponse> {
    try {
        const res = await fetch('/api/user/get-names');
        const data = await res.json();
        const { firstName, lastName } = data;
        return { data: { firstName, lastName }, error: null };

    } catch (error) {
        logger.error('supabase:auth', 'getNames', (error as Error).message);
        return { data: null, error: (error as Error).message };
    }
}