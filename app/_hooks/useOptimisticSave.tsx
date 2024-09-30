'use client'
import {  useCallback, useOptimistic, useTransition } from "react"

/**
 * Useful values and methods returned by the hook.
 */
interface OptimisticSaveHook<T> {
    /**
     * The data that is being saved. It will be updated optimistically until the save is confirmed.
     * If the save fails, the data will be reverted to the previous state.
     */
    optimisticState: T | undefined

    /**
     * Saves the data to the database and
     */
    saveOptimistically: (newData: T) => Promise<{ error: string | null }>

    /**
     * `true` while saving to the database.
     */
    isPending: boolean
}

/**
 * Parameters needed by the hook.
 */
interface OptimisticSaveOptions<T> {
    /**
     * This is the *real* state that `optimisticState` will use to stay up to date.
     */
    state: T | undefined

    /**
     * If the save is successful, the hook needs to update the 'real' state with this function.
     */
    setState: (newState: T) => void

    /**
     * The async function that saves the data to the database. Typically a server action from `api/_actions` involving supabase.
     */
    saveFunction: (newData: T) => Promise<{ error: string | null }>
}

/**
 * A hook to optimistically save data to the database.
 */
export default function useOptimisticSave<T>({ state, setState, saveFunction }: OptimisticSaveOptions<T>): OptimisticSaveHook<T> {
    const [optimisticState, setOptimisticState] = useOptimistic(state)
    const [isPending, startTransition] = useTransition()

    const saveOptimistically = useCallback(async (newValue: T) => {
        const errorPromise = new Promise<{error: string | null }>(async (resolve) => {
            // useOptimistic must be used inside a transition or a server action (see React docs)
            startTransition(async () => {

                setOptimisticState(newValue) // Optimistically update the state
                const { error } = await saveFunction(newValue) // Save the data to the database and wait
                if (!error) setState(newValue) // If the save was successful, update the 'real' state. We don't need to fetch it from the database.

                resolve({ error })
                // The transitiion ends here. The optimistic state is reverted.
            })
        })

        return await errorPromise
    }, [saveFunction, setState, setOptimisticState])

    return { optimisticState, saveOptimistically, isPending }
}