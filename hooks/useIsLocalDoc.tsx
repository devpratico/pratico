import { useSearchParams } from 'next/navigation'

// TODO: Maybe delete this
export default function useIsLocalDoc() {
    const searchParams = useSearchParams()
    return searchParams.get('local') === 'true'
}