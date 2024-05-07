
/*
import logger from "@/app/_utils/logger";
import getSupabaseClient from "../clients/old_getSupabaseClient";
import { Tables, TablesInsert } from "../types/database.types";
import { TLStoreSnapshot } from "tldraw";


export type Capsule = Tables<'capsules'>
export type Snapshot = TLStoreSnapshot


// TODO: Go to https://supabase.com/docs/guides/platform/going-into-prod


async function fetchCapsules(): Promise<Capsule[]> {
    const supabase =  await getSupabaseClient()
    const { data, error } = await supabase.from('capsules').select('*')
    if (error) {
        throw error
    } else {
        return data
    }
}


export async function fetchCapsule(capsuleId: string): Promise<Capsule> {
    const supabase =  await getSupabaseClient()
    const { data, error } = await supabase.from('capsules').select('*').eq('id', capsuleId).single()
    if (error) {
        throw error
    } else {
        logger.log('supabase:database', 'got capsule', (data as Capsule).title)
        return data
    }
}



export async function fetchCapsuleSnapshot(capsuleId: string): Promise<TLStoreSnapshot | undefined> {
    const supabase =  await getSupabaseClient()
    const { data, error } = await supabase.from('capsules').select('tld_snapshot').eq('id', capsuleId).single()
    if (error) {
        throw error
    } else {
        return data.tld_snapshot?.[0] as TLStoreSnapshot || undefined
    }
}



export async function saveSnapshotToCapsules(capsuleId: string, snapshot: TLStoreSnapshot) {
    const supabase =  await getSupabaseClient()
    //const _snapshot = [JSON.stringify(snapshot)]
    const { data, error } = await supabase.from('capsules').update({tld_snapshot: [snapshot]}).eq('id', capsuleId)
    if (error) {
        throw error
    } else {
        return data
    }
}



export async function fetchCapsuleTitle(capsuleId: string): Promise<string> {
    const supabase =  await getSupabaseClient()
    const { data, error } = await supabase.from('capsules').select('title').eq('id', capsuleId).single()
    if (error) {
        throw error
    } else {
        return data.title || ''
    }
}



export async function saveCapsuleTitle(capsuleId: string, title: string) {
    const supabase =  await getSupabaseClient()
    const { data, error } = await supabase.from('capsules').update({title}).eq('id', capsuleId)
    if (error) {
        throw error
    } else {
        return data
    }
}



export async function saveCapsule(capsule: TablesInsert<'capsules'>) {
    const supabase =  await getSupabaseClient()
    const { data, error } = await supabase.from('capsules').upsert(capsule).select().single()
    if (error || !data) {
        throw error
    } else {
        return data as Capsule // TODO: not sure about this
    }
}


export async function fetchCapsuleIdsByUserId(userId: string): Promise<string[]> {
    const supabase =  await getSupabaseClient()
    const { data, error } = await supabase.from('capsules').select('id').eq('created_by', userId)
    if (error) {
        throw error
    } else {
        return data.map((capsule: any) => capsule.id)
    }
}



export async function fetchCapsuleIdsTitlesDates(userId: string): Promise<{id: string, title: string, created_at: Date}[]> {
    const supabase =  await getSupabaseClient()
    const { data, error } = await supabase.from('capsules').select('id, title, created_at').eq('created_by', userId)
    if (error) {
        throw error
    } else {
        return data as {id: string, title: string, created_at: Date}[]
    }
}


export async function fetchCapsulesData(userId: string): Promise<Capsule[]> {
    const supabase =  await getSupabaseClient()
    const { data, error } = await supabase.from('capsules').select('*').eq('created_by', userId)
    if (error) {
        throw error
    } else {
        return data
    }
}*/