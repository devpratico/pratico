"use client"
import { useEffect } from 'react';
import logger from '@/app/_utils/logger';


/**
 * Calls the `onWake` function when the tab is woken up.
 * For example, when you unlock your phone.
 */
export function useOnWake(onWake: () => Promise<void>) {
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                logger.log('react:hook', 'useOnWake.tsx', 'Waking up');
                onWake();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [onWake]);
}