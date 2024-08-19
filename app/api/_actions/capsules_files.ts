'use server'
import createClient from "@/supabase/clients/server"
import logger from "../../_utils/logger"


export async function downloadCapsuleFile(fileUrl: string) {
    const supabase =  createClient()
    const { data, error } = await supabase.storage.from('capsules_files').download(fileUrl)
    if (error) logger.error('supabase:storage', 'Error downloading file', error)
    return { data, error: error?.message }
}


export async function createSignedUrl(fileUrl: string) {
    const supabase =  createClient()
    const { data, error } = await supabase.storage.from('capsules_files').createSignedUrl(fileUrl, 60)
    if (error) logger.error('supabase:storage', 'Error creating signed URL', error)
    return { data, error: error?.message }
}



export async function getPublicUrl(path: string) {
    const supabase = createClient()
    const { data } = supabase.storage.from('capsules_files').getPublicUrl(path)
    return data.publicUrl
}