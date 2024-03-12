'use client'
import { useNavNew } from "@/hooks/navContextNew"


export default function CreatePageBtn() {

    const { newPage } = useNavNew()

    return (
        <button onClick={() => newPage()}>
            Page blanche
        </button>
    )
}