'use client'
import { ReadonlyURLSearchParams } from "next/navigation"
import { usePathname, useRouter } from "../_intl/intlNavigation"
import { useSearchParams as useNextSearchParams } from "next/navigation"

/**
 * Unfortunately, Next.js' useSearchParams hook only returns a readonly URLSearchParams object.
 * This hook provides more utility functions.
 */


interface useSearchParamsType {
    searchParams: ReadonlyURLSearchParams

    // The following return a string without modifying the current URL
    getPathnameWithSearchParam: (name: string, value: string ) => string
    getPathnameWithoutSearchParam: (name: string) => string
    getPathnameWithSearchParamToggled: (name: string, value: string) => string

    // The following modify the current URL and refresh the page
    setSearchParam: (name: string, value: string) => void
    removeSearchParam: (name: string) => void
    toggleSearchParam: (name: string, value: string) => void
    removeAllSearchParams: () => void
}


export default function useSearchParams(): useSearchParamsType {
    const pathname = usePathname()
    const router = useRouter()
    const searchParams = useNextSearchParams()


    /**
     * Sets a new search param without removing the others.
     * If the param was not present, it is added. If it was, it is updated.
     */
    function getPathnameWithSearchParam(name: string, value: string ) {
        const params = new URLSearchParams(searchParams.toString())
        params.set(name, value)
        return pathname + '?' + params.toString()
    }

    /**
     * Removes a search param from the current ones.
     */
    function getPathnameWithoutSearchParam(name: string) {
        const params = new URLSearchParams(searchParams.toString())
        params.delete(name)
        return pathname + '?' + params.toString()
    }
    
    /**
     * Toggles a search param.
     * If the param was not present, it is added.
     * If the param was already set with an other value, it is updated.
     * If the param was already set with the same value, it is removed.
     */
    function getPathnameWithSearchParamToggled(name: string, value: string) {
        const params = new URLSearchParams(searchParams.toString())
        if (params.get(name) === value) {
            params.delete(name)
        } else {
            params.set(name, value)
        }
        return pathname + '?' + params.toString()
    }


    /**
     * Sets a new search param without removing the others.
     * If the param was not present, it is added. If it was, it is updated.
     */
    function setSearchParam(name: string, value: string) {
        const newPathname = getPathnameWithSearchParam(name, value)
        router.push(newPathname)
    }


    /**
     * Removes a search param from the current ones.
     */
    function removeSearchParam(name: string) {
        const newPathname = getPathnameWithoutSearchParam(name)
        router.push(newPathname)
    }

    /**
     * Toggles a search param.
     * If the param was not present, it is added.
     * If the param was already set with an other value, it is updated.
     * If the param was already set with the same value, it is removed.
     */
    function toggleSearchParam(name: string, value: string) {
        const newPathname = getPathnameWithSearchParamToggled(name, value)
        router.push(newPathname)
    }

    /**
     * Removes all search params.
     */
    function removeAllSearchParams() {
        router.push(pathname)
    }


    return (
        {
            searchParams,
            getPathnameWithSearchParam,
            getPathnameWithoutSearchParam,
            getPathnameWithSearchParamToggled,
            setSearchParam,
            removeSearchParam,
            toggleSearchParam,
            removeAllSearchParams
        }
    )
}
