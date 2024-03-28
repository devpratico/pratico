import { useSearchParams } from 'next/navigation'


export default function useIsLocalDoc() {
    const searchParams = useSearchParams()
    return searchParams.get('local') === 'true'
}