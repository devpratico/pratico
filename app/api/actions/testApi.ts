'use server'
import createClient from "@/supabase/clients/server"

export const testFetch = async(capsuleId: string) => {
    const supabase = createClient()
    console.log('Fetching initial snapshot for capsule', capsuleId)
    const { data, error } = await supabase.from('capsules').select('tld_snapshot').eq('id', capsuleId).single()
    console.log('testFetch data', data, 'error', error)
    return { data, error: error?.message }
}