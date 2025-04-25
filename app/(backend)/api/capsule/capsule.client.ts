'use server'
import createClient from "@/supabase/clients/server"
import { Tables, TablesInsert, Json } from "@/supabase/types/database.types"
import { TLStoreSnapshot } from "tldraw";
import logger from "@/app/_utils/logger";
import {
    fetchCapsuleSnapshot as fetchCapsuleSnapshotServer,
    saveCapsule as saveCapsuleServer,
    SaveCapsuleArg,
} from "./capsule.server";


//export type Snapshot = TLStoreSnapshot

export const deleteCapsule = async (capsuleId: string) => {
    const supabase = createClient()
    const { error } = await supabase.from('capsules').delete().eq('id', capsuleId)
    if (error) logger.error('supabase:database', 'Error deleting capsule', capsuleId, error.message)
    return { error: error?.message }
}

const saveSnapshotToCapsules = async (capsuleId: string, snapshot: TLStoreSnapshot) => {
    const supabase = createClient()
    const jsonSnapshot = snapshot as unknown as Json
    const { data, error } = await supabase.from('capsules').update({ tld_snapshot: [jsonSnapshot] }).eq('id', capsuleId)
    if (error) logger.error('supabase:database', 'Error saving snapshot to capsule', error.message)
    return { data, error: error?.message }
}


export const saveCapsuleSnapshot = async (capsuleId: string, snapshot: any) => {
    const { data, error } = await saveSnapshotToCapsules(capsuleId, snapshot)
    return { data, error }
}


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

export async function getPublicUrl(path: string) {
    const supabase = createClient()
    const { data } = supabase.storage.from('capsules_files').getPublicUrl(path)
    return data.publicUrl
}


export async function fetchCapsuleSnapshot(capsuleId: string) {
    return await fetchCapsuleSnapshotServer(capsuleId)
}


export async function saveCapsule(capsule: SaveCapsuleArg) {
    return await saveCapsuleServer(capsule)
}
