'use server'
import createClient from "@/supabase/clients/server"
import { Tables, TablesInsert } from "@/supabase/types/database.types"
import { TLStoreSnapshot } from "tldraw";
import logger from "@/app/_utils/logger";
import { cache } from "react";


export type Capsule = Tables<'capsules'>
export type Snapshot = TLStoreSnapshot


export const saveCapsule = cache(async (capsule: TablesInsert<'capsules'>) => {
    const supabase = createClient()
    logger.log('supabase:database', 'Saving capsule...')
    const { data, error } = await supabase.from('capsules').upsert(capsule).select().single()
    if (error || !data) logger.error('supabase:database', 'Error saving capsule', error?.message)
    if (data) logger.log('supabase:database', 'Saved capsule', data.id)
    return ({
        data: data as Capsule,
        error: error?.message
    })
})