'use client'
import { useState } from "react"






export function useSaveQuizService(): {
    save: () => Promise<{error: string | null}>
    closeAndSave: () => Promise<{error: string | null}>
    isPending: boolean
} {
    const [isPending, setIsPending] = useState(false)




    return {
        save: async () => ({error: null}),
        closeAndSave: async () => ({error: null}),
        isPending: isPending
    }
}