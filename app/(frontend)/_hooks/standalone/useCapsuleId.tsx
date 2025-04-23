"use client"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import createClient from "@/supabase/clients/client"
import logger from "@/app/_utils/logger"


const supabase = createClient()


export default function useCapsuleId(): string | undefined {
    const params = useParams()
    const [capsuleId, setCapsuleId] = useState<string | undefined>(undefined)


    useEffect(() => {
        if (params.capsule_id) {
            logger.log('react:hook', 'useCapsuleId.tsx', 'useCapsuleId', 'Setting capsule id from capsule_id params', params.capsule_id)
            setCapsuleId(params.capsule_id as string)
        }
    }, [params.capsule_id])

    useEffect(() => {
        const fetchCapsuleId = async () => {

            const { data, error } = await supabase
                .from('rooms')
                .select('capsule_id')
                .eq('code', params.room_code as string)
                .eq('status', 'open')
                .single()

            if (error) {
                logger.error('supabase:database', 'useCapsuleId.tsx', 'fetchCapsuleId', 'Error fetching capsule id', error)
                return
            }

            logger.log('react:hook', 'useCapsuleId.tsx', 'fetchCapsuleId', 'Setting capsule id from room_code param', data.capsule_id)
            setCapsuleId(`${data.capsule_id}`)
        }
            

        if (params.room_code) {
            fetchCapsuleId()
        }
    }, [params.room_code])


    return capsuleId
}