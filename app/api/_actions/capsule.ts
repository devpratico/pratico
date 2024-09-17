'use server'
import createClient from "@/supabase/clients/server"
import { Tables, TablesInsert, Json } from "@/supabase/types/database.types"
import { TLStoreSnapshot } from "tldraw";
import logger from "@/app/_utils/logger";
import { cache } from "react";


export type Capsule = Tables<'capsules'>
export type Snapshot = TLStoreSnapshot


export const saveCapsule = async (capsule: TablesInsert<'capsules'>) => {
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

export const fetchCapsule = cache(async (capsuleId: string) => {
    const supabase = createClient()
    const { data, error } = await supabase.from('capsules').select('*').eq('id', capsuleId).single()
    if (error) logger.error('supabase:database', 'Error fetching capsule', error.message)
    return { data, error: error?.message }
})


export const fetchCapsulesData = cache(async (userId: string) => {
    const supabase = createClient()
    const { data, error } = await supabase.from('capsules').select('*').eq('created_by', userId)
    if (error) logger.error('supabase:database', 'Error fetching capsules', error.message, 'for user', userId)

    return { data, error: error?.message }
})


export const deleteCapsule = async (capsuleId: string) => {
    const supabase = createClient()
    const { error } = await supabase.from('capsules').delete().eq('id', capsuleId)
    if (error) logger.error('supabase:database', 'Error deleting capsule', capsuleId, error.message)
    return { error: error?.message }
}

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



export async function getPublicUrl(path: string) {
    const supabase = createClient()
    const { data } = supabase.storage.from('capsules_files').getPublicUrl(path)
    return data.publicUrl
}


export const saveCapsuleSnapshot = async (capsuleId: string, snapshot: any) => {
    const { data, error } = await saveSnapshotToCapsules(capsuleId, snapshot)
    return { data, error }
}

export const fetchCapsuleSnapshot = async (capsuleId: string) => {
    const supabase = createClient()
    const { data, error } = await supabase.from('capsules').select('tld_snapshot').eq('id', capsuleId).single()
    if (error) logger.error('supabase:database', 'Error fetching capsule snapshot', error.message)
    return { data, error: error?.message }
}


export const fetchCapsuleTitle = cache(async (capsuleId: string) => {
    const supabase = createClient()
    const { data, error } = await supabase.from('capsules').select('title').eq('id', capsuleId).single()
    if (error) logger.error('supabase:database', 'Error fetching capsule title', error.message)
    return { data, error: error?.message }
})


export const saveCapsuleTitle = async (capsuleId: string, title: string) => {
    let result: { error: string | null } = { error: null }

    if (title.length === 0) result = { error: 'Title cannot be empty' }
    if (title.length > 100) result = { error: 'Title cannot be longer than 100 characters' }
    if (title.length < 3) result = { error: 'Title must be at least 3 characters long' }

    if (result.error) {
        logger.error('supabase:database', 'Error saving capsule title', result.error)
        return result
    }

    const supabase = createClient()
    const { error } = await supabase.from('capsules').update({ title }).eq('id', capsuleId)

    if (error) {
        logger.error('supabase:database', 'Error saving capsule title', error.message)
        return { error: error.message }
    } else {
        return { error: null }
    }
}


const saveSnapshotToCapsules = async (capsuleId: string, snapshot: TLStoreSnapshot) => {
    const supabase = createClient()
    const jsonSnapshot = snapshot as unknown as Json
    const { data, error } = await supabase.from('capsules').update({ tld_snapshot: [jsonSnapshot] }).eq('id', capsuleId)
    if (error) logger.error('supabase:database', 'Error saving snapshot to capsule', error.message)
    return { data, error: error?.message }
}