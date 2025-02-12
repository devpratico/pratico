"use client"
import { TLAssetStore } from "tldraw"
import uploadCapsuleFile from "../uploadCapsuleFile"
import logger from "../logger"


export default function makeAssetStore(args: {
    capsuleId: string
}): TLAssetStore {
    return {
        async upload(asset, file) {
            const { data, error } = await uploadCapsuleFile({
                file,
                capsuleId: args.capsuleId,
                folder: 'images'
            })

            if (error || !data) {
                logger.error('supabase:storage', 'assetStore.ts', 'makeAssetStore', 'Error uploading asset', error)
                throw new Error('Error uploading asset')
            }

            return data.fullPath
        },

        resolve(asset) {
            return asset.props.src
        },
    }
}