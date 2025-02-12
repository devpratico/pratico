"use client"
import { TLAssetStore } from "tldraw"
import uploadCapsuleFile from "../uploadCapsuleFile"
import logger from "../logger"
import createClient from "@/supabase/clients/client"

const supabase = createClient()


export default function makeAssetStore(args: {
    capsuleId: string
}): TLAssetStore {
    return {
        async upload(asset, file) {

            logger.log('tldraw:editor', 'assetStore.ts', 'makeAssetStore', 'Uploading asset', file.name)

            const { data, error } = await uploadCapsuleFile({
                file,
                capsuleId: args.capsuleId,
                folder: 'images'
            })

            if (error || !data) {
                logger.error('supabase:storage', 'assetStore.ts', 'makeAssetStore', 'Error uploading asset', error)
                throw new Error('Error uploading asset')
            }

            const { data: publicUrlData } = supabase.storage.from('capsules_files').getPublicUrl(data.path)

            return publicUrlData.publicUrl
        },

        resolve(asset) {
            return asset.props.src
        },
    }
}