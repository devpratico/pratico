'use client'
import { ReadonlyURLSearchParams } from "next/navigation"
import { usePathname, useRouter } from "../_intl/intlNavigation"
import { useSearchParams as useNextSearchParams } from "next/navigation"


interface useSearchParamsType {
    /**
     * The current search params (given by Next.js' useSearchParams hook).
     */
    searchParams: ReadonlyURLSearchParams

    /**
     * Sets a new search param without removing the others.
     * If the param was not present, it is added. If it was, it is updated.
     */
    getPathnameWithSearchParam: (name: string, value: string ) => string

    /**
     * Removes a search param from the current ones.
     */
    getPathnameWithoutSearchParam: (name: string) => string

    /**
    * Toggles a search param.
    * If the param was not present, it is added.
    * If the param was already set with an other value, it is updated.
    * If the param was already set with the same value, it is removed.
    */
    getPathnameWithSearchParamToggled: (name: string, value: string) => string

    /**
     * Sets a new search param without removing the others.
     * If the param was not present, it is added. If it was, it is updated.
     */
    setSearchParam: (name: string, value: string) => void

    /**
     * Removes a search param from the current ones.
     */
    removeSearchParam: (name: string) => void

    /**
     * Toggles a search param.
     * If the param was not present, it is added.
     * If the param was already set with an other value, it is updated.
     * If the param was already set with the same value, it is removed.
     */
    toggleSearchParam: (name: string, value: string) => void

    /**
     * Removes all search params.
     */
    removeAllSearchParams: () => void
}


/**
 * Unfortunately, Next.js' useSearchParams hook only returns a readonly URLSearchParams object.
 * This hook provides more utility functions.
 */
export default function useSearchParams(): useSearchParamsType {
    const pathname = usePathname()
    const router = useRouter()
    const searchParams = useNextSearchParams()


    
    function getPathnameWithSearchParam(name: string, value: string ) {
        const params = new URLSearchParams(searchParams.toString())
        params.set(name, value)
        return pathname + '?' + params.toString()
    }

    
    function getPathnameWithoutSearchParam(name: string) {
        const params = new URLSearchParams(searchParams.toString())
        params.delete(name)
        return pathname + '?' + params.toString()
    }
    
   
    function getPathnameWithSearchParamToggled(name: string, value: string) {
        const params = new URLSearchParams(searchParams.toString())
        if (params.get(name) === value) {
            params.delete(name)
        } else {
            params.set(name, value)
        }
        return pathname + '?' + params.toString()
    }


    
    function setSearchParam(name: string, value: string) {
        const newPathname = getPathnameWithSearchParam(name, value)
        router.push(newPathname)
    }


    
    function removeSearchParam(name: string) {
        const newPathname = getPathnameWithoutSearchParam(name)
        router.push(newPathname)
    }

    
    function toggleSearchParam(name: string, value: string) {
        const newPathname = getPathnameWithSearchParamToggled(name, value)
        router.push(newPathname)
    }


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
