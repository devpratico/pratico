import logger from "@/app/_utils/logger";


interface ResetPasswordReturn {
    error: string | null
}


export default async function resetPassword(email: string): Promise<ResetPasswordReturn> {

    const encodedEmail = encodeURIComponent(email);

    try {
        const response = await fetch(`/api/auth/reset-password?email=${encodedEmail}`, { method: 'POST' });
        logger.log('next:api', 'resetPassword', response);

        // Check for HTTP response errors
        if (!response.ok) {
            const { error } = await response.json();
            return { error: error || 'An error occurred' }; // Provide fallback message
        }

        // Assume success case (no error in response body)
        return { error: null };
    } catch (err) {
        // Catch network errors or unexpected issues
        return { error: 'An error occurred. ' + (err as Error).message }; // Provide a more specific message
    }
}