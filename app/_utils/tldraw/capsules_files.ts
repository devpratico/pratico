//'use server'
//import createClient from "@/supabase/clients/server"
'use client'
import createClient from "@/supabase/clients/client"
import logger from "../logger"


type UploadCapsuleFileArgs = {
    file: File
    capsuleId: string
    folder?: string
} | {
    dataUrl: string
    name: string
    capsuleId: string
    folder?: string
}


export async function uploadCapsuleFile(args: UploadCapsuleFileArgs) {
    const supabase =  createClient()

    logger.log('supabase:storage', 'Uploading file', args);

    // Get user id because we use it in the path
    const res = await supabase.auth.getUser()
    if (res.error) {
        logger.error('supabase:auth', 'Error getting user', res.error)
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
    const { data, error } = await supabase.storage.from('capsules_files').upload(path, 'file' in args ? args.file : dataURLToBlob(args.dataUrl))

    if (error) {
        // For example, when the file name already exists
        logger.error('supabase:storage', 'Error uploading file', error)
        throw error
    } else {
        logger.log('supabase:storage', 'Uploaded file', path)
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



/**
 * Converts a data URL to a Blob, that can be uploaded to Supabase
 */
const dataURLToBlob = (dataURL: string): Blob => {
    const [headers, base64Data] = dataURL.split(',');
    const byteString = atob(base64Data);
    const mimeString = headers.split(':')[1].split(';')[0];

    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
}