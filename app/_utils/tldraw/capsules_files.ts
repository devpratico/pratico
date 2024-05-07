'use server'
import createClient from "@/supabase/clients/server"


type UploadCapsuleFileArgs = {
    file: File
    capsuleId: string
    folder?: string
} | {
    blob: Blob
    name: string
    capsuleId: string
    folder?: string
}


export async function uploadCapsuleFile(args: UploadCapsuleFileArgs) {
    const supabase =  createClient()

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
    const { data, error } = await supabase.storage.from('capsules_files').upload(path, 'file' in args ? args.file : args.blob)

    if (error) {
        // For example, when the file name already exists
        throw error
    } else {
        return data.path
    }
}


export async function downloadCapsuleFile(fileUrl: string) {
    const supabase =  createClient()
    const { data, error } = await supabase.storage.from('capsules_files').download(fileUrl)
    if (error) {
        throw error
    } else {
        return data
    }
}


export async function createSignedUrl(fileUrl: string) {
    const supabase =  createClient()
    const { data, error } = await supabase.storage.from('capsules_files').createSignedUrl(fileUrl, 60)
    if (error) {
        throw error
    } else {
        return data.signedUrl
    }
}



export async function getPublicUrl(path: string) {
    const supabase = createClient()
    const { data } = supabase.storage.from('capsules_files').getPublicUrl(path)
    return data.publicUrl
}