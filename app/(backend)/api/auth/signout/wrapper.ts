import logger from "@/app/_utils/logger"


export default async function signOut(): Promise<{ error: string | null }> {
    const response = await fetch('/api/auth/signout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    if (response.ok) {
        return { error: null }
        
    } else {
        logger.error('next:api', 'signOut', 'Error signing out:', response.statusText, 'discord')
        return { error: response.statusText }
    }
}