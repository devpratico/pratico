import createClient from "@/supabase/clients/client";
import logger from "./logger";


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

/**
 * Client-side function to upload a file related to a capsule
 */
export default async function uploadCapsuleFile(args: UploadCapsuleFileArgs) {
    const supabase = createClient()

    logger.log('supabase:storage', 'Uploading file', args);

    // Get user id because we use it in the path
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError) {
        logger.error('supabase:auth', 'Error getting user', userError.message)
        return { data: null, error: userError.message }
    }

    let folderName = 'folder' in args ? args.folder : undefined
    if (folderName) {
        folderName = folderName.replace(/[^a-z0-9.]/gi, '_')
        folderName = encodeURIComponent(folderName)
    }

    let fileName = 'name' in args ? args.name : args.file.name
    fileName = fileName.replace(/[^a-z0-9.]/gi, '_')
    fileName = encodeURIComponent(fileName)

    // TODO: Remove the user id from the path. It should be independent.
    const userId = userData.user.id
    const path = `${userId}/${args.capsuleId}/${folderName ? folderName + '/' : ''}${fileName}`
    const { data, error } = await supabase.storage.from('capsules_files').upload(path, 'file' in args ? args.file : dataURLToBlob(args.dataUrl))

    if (error) logger.error('supabase:storage', 'Error uploading file', error)

    return { data, error: error?.message }
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