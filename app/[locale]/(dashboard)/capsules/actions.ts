import createClient from "@/supabase/clients/server"
import { Tables, TablesInsert } from "@/supabase/types/database.types"
import { TLStoreSnapshot } from "tldraw";
import logger from "@/app/_utils/logger";


export type Capsule = Tables<'capsules'>
export type Snapshot = TLStoreSnapshot


export async function fetchCapsulesData(userId: string): Promise<Capsule[]> {
    const supabase = createClient()
    logger.log('supabase:database', 'Fetching capsules...')
    const { data, error } = await supabase.from('capsules').select('*').eq('created_by', userId)
    if (error) {
        logger.error('supabase:database', 'Error fetching capsules', error.message, 'for user', userId)
        throw error
    } else {
        logger.log('supabase:database', 'Fetched capsules:', data.map(c => c.title).join(', '))
        return data as Capsule[]
    }
}


