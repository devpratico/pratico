import getSupabaseClient from "../clients/getSupabaseClient";


/**
 * Uploads a file to the `capsules_files` bucket
 * @returns The url of the uploaded file
 */
export async function uploadCapsuleFile(file: File, userId: string, capsuleId: string) {
    const supabase =  await getSupabaseClient()
    const path = `${userId}/${capsuleId}/${file.name}`
    const { data, error } = await supabase.storage.from('capsules_files').upload(path, file)

    if (error) {
        // For example, when the file name already exists
        throw error
    } else {
        return data
    }
}

/**
 * Downloads a file from the `capsules_files` bucket
 */
export async function downloadCapsuleFile(fileUrl: string) {
    const supabase =  await getSupabaseClient()
    const { data, error } = await supabase.storage.from('capsules_files').download(fileUrl)
    if (error) {
        throw error
    } else {
        return data
    }
}