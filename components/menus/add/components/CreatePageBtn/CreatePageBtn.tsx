'use client'
import { useNav } from "@/hooks/useNav"


export default function CreatePageBtn() {

    const { newPage } = useNav()

    return (
        <button onClick={() => newPage?.()}>
            Page blanche
        </button>
    )
}