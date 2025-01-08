import 'server-only'
import logger from "@/app/_utils/logger";
import { cache } from "react";
import { sanitizeUuid } from '@/app/_utils/utils_functions'
import createClient from '@/supabase/clients/server';
import { Tables, TablesInsert } from '@/supabase/types/database.types';


export const fetchCapsule = cache(async (capsuleId: string) => {
    const sanitizedCapsuleId = sanitizeUuid(capsuleId);
    if (!sanitizedCapsuleId)
        return ({ data: null, error: 'fetchCapsule, capsuleId missing' })
    const supabase = createClient()
    const { data, error } = await supabase.from('capsules').select('*').eq('id', sanitizedCapsuleId).single()
    if (error) logger.error('supabase:database', 'Error fetching capsule', error.message)
    return { data, error: error?.message }
})


export const fetchCapsulesData = cache(async (userId: string) => {
    const supabase = createClient()
    const { data, error } = await supabase.from('capsules').select('*').eq('created_by', userId)
    if (error) logger.error('supabase:database', 'Error fetching capsules', error.message, 'for user', userId)

    return { data, error: error?.message }
})

export const fetchCapsulesDataAndRoomStatus = cache(async (userId: string) => {
    const supabase = createClient();
    const { data, error } = await supabase.from('capsules').select('*, rooms(status)').eq('created_by', userId);
    if (error)
    {
        logger.error('supabase:database', 'fetchCapsulesAndRoomStatus', 'Error fetching capsules', error.message, 'for user', userId);
        return ({ data: null, error: error?.message });
    }
    console.log("Data fetchCapsulesAndRoomStatus: ", data);
    const capsules = data.map(capsule => ({
        ...capsule,
        roomOpen: capsule.rooms.some(room => room.status === 'open'), // Check if any room is 'open'
    }));
    return ({ data: capsules, error: null });
});


export async function downloadCapsuleFile(fileUrl: string) {
    const supabase = createClient()
    const { data, error } = await supabase.storage.from('capsules_files').download(fileUrl)
    if (error) logger.error('supabase:storage', 'Error downloading file', error)
    return { data, error: error?.message }
}

export async function createSignedUrl(fileUrl: string) {
    const supabase = createClient()
    const { data, error } = await supabase.storage.from('capsules_files').createSignedUrl(fileUrl, 60)
    if (error) logger.error('supabase:storage', 'Error creating signed URL', error)
    return { data, error: error?.message }
}






export const fetchCapsuleTitle = cache(async (capsuleId: string) => {
    const supabase = createClient()
    const { data, error } = await supabase.from('capsules').select('title').eq('id', capsuleId).single()
    if (error) logger.error('supabase:database', 'Error fetching capsule title', error.message)
    return { data, error: error?.message }
})

export const fetchCapsuleSnapshot = async (capsuleId: string) => {
    const supabase = createClient()
    logger.log('supabase:database', 'Fetching capsule snapshot for capsuleId', capsuleId)
    const { data, error } = await supabase.from('capsules').select('tld_snapshot').eq('id', capsuleId).single()
    if (error) logger.error('supabase:database', 'Error fetching capsule snapshot', error.message)
    return { data, error: error?.message }
}


export type Capsule = Tables<'capsules'>
export type SaveCapsuleArg = TablesInsert<'capsules'>

export async function saveCapsule(capsule: SaveCapsuleArg) {
    const supabase = createClient()
    logger.log('supabase:database', 'Saving capsule...')
    const { data, error } = await supabase.from('capsules').upsert(capsule).select().single()
    if (error || !data) logger.error('supabase:database', 'Error saving capsule', error?.message)
    if (data) logger.log('supabase:database', 'Saved capsule', data.id)
    return ({
        data: data as Capsule,
        error: error?.message
    })
}