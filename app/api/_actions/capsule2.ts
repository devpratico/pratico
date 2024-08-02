'use server'
import createClient from "@/supabase/clients/server"
import { Tables, TablesInsert } from "@/supabase/types/database.types"
import { TLStoreSnapshot, TLEditorSnapshot } from "tldraw";
import logger from "@/app/_utils/logger";
import { cache } from "react";


export type Capsule = Tables<'capsules'>
export type Snapshot = TLEditorSnapshot //TLStoreSnapshot


export const fetchCapsulesData = cache(async (userId: string) => {
    const supabase = createClient()
    const { data, error } = await supabase.from('capsules').select('*').eq('created_by', userId)
    if (error) logger.error('supabase:database', 'Error fetching capsules', error.message, 'for user', userId)
        
    return { data, error: error?.message }
})


export const deleteCapsule = cache(async (capsuleId: string) => {
    const supabase = createClient()
    const { error } = await supabase.from('capsules').delete().eq('id', capsuleId)
    if (error) logger.error('supabase:database', 'Error deleting capsule', capsuleId, error.message)
    return { error: error?.message }
})