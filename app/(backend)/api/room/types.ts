import { Tables } from "@/supabase/types/database.types"
import { TLStoreSnapshot } from "tldraw"
import { ActivitySnapshot } from "@/app/_types/activity"


export interface RoomParams {
    navigation: {
        type: 'pratico' | 'animateur' | 'libre'
        follow: string
    },
    collaboration: {
        active: boolean
        allowAll: boolean
        allowedUsersIds: string[]
    }
}


/**
 * We use the type generated by supabase, but we replace the `Json`
 * columns with our types
 */
export type Room = Omit<Tables<'rooms'>, 'params' | 'capsule_snapshot' | 'activity_snapshot'> & {
    params: RoomParams | null
    capsule_snapshot: TLStoreSnapshot | null
    activity_snapshot: ActivitySnapshot | null
}