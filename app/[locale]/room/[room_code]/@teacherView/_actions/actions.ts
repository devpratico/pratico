'use server'
import createClient from "@/supabase/clients/server"
import { redirect } from "@/app/_intl/intlNavigation"


interface stopRoomArgs {
    roomId: number
    capsuleId: string
}

export async function stopRoom({ roomId, capsuleId }: stopRoomArgs) {
    const supabase = createClient()
    const { data, error } = await supabase.from('rooms').delete().eq('id', roomId)
    if (error) {
        throw error
    } else {
        redirect(`/capsule/${capsuleId}`)
    }
}

