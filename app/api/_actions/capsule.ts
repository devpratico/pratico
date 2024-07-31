'use server'
import createClient from "@/supabase/clients/server"
import { Tables, TablesInsert } from "@/supabase/types/database.types"
import { TLStoreSnapshot } from "tldraw";
import logger from "@/app/_utils/logger";


export type Capsule = Tables<'capsules'>
export type Snapshot = TLStoreSnapshot


export async function saveCapsule(capsule: TablesInsert<'capsules'>) {
    const supabase = createClient()
    logger.log('supabase:database', 'Saving capsule...')
    const { data, error } = await supabase.from('capsules').upsert(capsule).select().single()
    if (error || !data) {
        logger.error('supabase:database', 'Error saving capsule', error?.message)
        throw error
    } else {
        logger.log('supabase:database', 'Saved capsule', data.title)
        return data as Capsule
    }
}