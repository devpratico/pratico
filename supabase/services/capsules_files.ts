import getSupabaseClient from "../clients/getSupabaseClient";


type UploadCapsuleFileArgs = {
    file: File
    capsuleId: string
    folder?: string
} | {
    file: Blob
    name: string
    capsuleId: string
    folder?: string
}

/**
 * Uploads a file to the `capsules_files` bucket
 * @returns The url of the uploaded file
 */
export async function uploadCapsuleFile(args: UploadCapsuleFileArgs) {
    const supabase =  await getSupabaseClient()

    // Get user id because we use it in the path
    const res = await supabase.auth.getUser()
    if (res.error) {
        throw res.error
    }

    let folderName = 'folder' in args ? args.folder : undefined
    if (folderName) {
        folderName = folderName.replace(/[^a-z0-9.]/gi, '_')
        folderName = encodeURIComponent(folderName)
    }
    
    let fileName = 'name' in args ? args.name : args.file.name
    fileName = fileName.replace(/[^a-z0-9.]/gi, '_')
    fileName = encodeURIComponent(fileName)

    const userId = res.data.user.id
    const path = `${userId}/${args.capsuleId}/${folderName ? folderName + '/' : ''}${fileName}`
    const { data, error } = await supabase.storage.from('capsules_files').upload(path, args.file)

    if (error) {
        // For example, when the file name already exists
        throw error
    } else {
        return data.path
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

/**
 * Creates a signed URL for a file in the `capsules_files` bucket
 */
export async function createSignedUrl(fileUrl: string) {
    const supabase =  await getSupabaseClient()
    const { data, error } = await supabase.storage.from('capsules_files').createSignedUrl(fileUrl, 60)
    if (error) {
        throw error
    } else {
        return data.signedUrl
    }
}