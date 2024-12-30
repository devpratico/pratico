'use client'
import useSearchParams from "@/app/(frontend)/_hooks/contexts/useSearchParams"
import { Link } from "@/app/(frontend)/_intl/intlNavigation"
//import { Link as RadixLink } from "@radix-ui/themes"


interface SearchParamLinkProps {
    name: string
    value: string

    /**
     * Clicking on the link sets a search param.
     * If it was already set, by default, nothing happens.
     * If toggle is true, the param will be removed.
     */
    toggle?: boolean

    asChild?: boolean

    children: React.ReactNode
}


/**
 * This is a link that doesn't change the path, but only sets a search param.
 * Set toggle to `true` to remove the search param when clicking again.
 */
export default function SearchParamLink({ name, value, toggle=false, asChild=false, children }: SearchParamLinkProps) {
    const { getPathnameWithSearchParam, getPathnameWithSearchParamToggled } = useSearchParams()
    const href = toggle ? getPathnameWithSearchParamToggled(name, value) : getPathnameWithSearchParam(name, value)

    return (
        <Link href={href} style={{all: 'unset'}}>
            {children}
        </Link>
    )
}