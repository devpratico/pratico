"use client"
import { useActionState } from "react"
import { initialRes, ServerActionRes } from "@/client/server-actions/utils"

/**
 * This hooks simplifies a bit `useActionState` by handling the
 * prevState and initialState thing for you.
 */
export function useServerAction(
    action: (prevState: ServerActionRes, formData: FormData) => Promise<ServerActionRes>
) {
    return useActionState(action, initialRes)
}