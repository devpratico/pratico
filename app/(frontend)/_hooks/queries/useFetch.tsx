'use client'
import { useCallback, useState } from "react"


/**
 * Very simple hook that wraps a fetcher function in order to provide a pending state.
 * @argument fetcher - The function that will be called when the fetch method is called
 * @example
 * const { fetch, isPending } = useFetch(() => {
 *    const client = supabase.createClient()
 *    return client.from('users').select('*')
 * })
 * */
export default function useFetch<T, A extends any[]>(fetcher: (...args: A) => Promise<T>): {
    fetch: (...args: A) => Promise<T>
    isPending: boolean
} {
    const [isPending, setIsPending] = useState(false)

    const fetch = useCallback(async (...args: A) => {
        setIsPending(true)
        const result = await fetcher(...args)
        setIsPending(false)
        return result
    }, [fetcher])

    return { fetch, isPending }
}