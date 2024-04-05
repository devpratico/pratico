'use client' // Error components must be Client Components
import { Button, Callout } from '@radix-ui/themes'
import { RefreshCcw, TriangleAlert } from 'lucide-react'
import logger from '@/app/_utils/logger'

import { useEffect } from 'react'

export default function Error({error, reset,}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        logger.error("react:page", (error as Error).message, error)
    }, [error])
    
    return (
        <div style={containerStyle}>
            <h2>Erreur</h2>
            <Callout.Root mx='auto'>
                <Callout.Icon>
                    <TriangleAlert size={15} />
                </Callout.Icon>
                <Callout.Text>
                    {error.message}
                </Callout.Text>
            </Callout.Root>

            <Button onClick={() => reset()}>
                <RefreshCcw size={15} />
                Réessayer
            </Button>
        </div>
    )
}
    
    
const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    gap: '2rem',
    backgroundColor: 'var(--secondary)',
}