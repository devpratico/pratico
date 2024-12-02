"use client";
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useRoom } from './useRoom';
import logger from '@/app/_utils/logger';
import { useRouter } from '../_intl/intlNavigation';

const FullscreenContext = createContext({
    setFullscreenOn: () => {},
	isFullscreen: false
});

export const useFullscreen = () => useContext(FullscreenContext);

export const FullscreenProvider = ({ children }: { children: React.ReactNode }) => {
	const { room } = useRoom();
	const doc = typeof document !== 'undefined' ? document : null;
	const activityOn = room?.activity_snapshot;
	const classNameToFullscreen = 'tldraw-canvas';
	const elementToFullscreen = doc ? doc.getElementsByClassName(classNameToFullscreen)[0] : null;
	const [isFullscreen, _setIsFullscreen] = useState(false);
	const router = useRouter();

	useEffect(() => {
		const handleKeyPress = (e: KeyboardEvent) => {
			if (e.key === 'Escape')
			{
				if (document.fullscreenElement)
				{	
					document.exitFullscreen()
						.then(() => {
							_setIsFullscreen(false);
						})
						.catch((error) => logger.error("react:hook", "useFullcreen", "ExitFullscreen escape", error))
				}
		  	}
		};	
		window.addEventListener('keydown', handleKeyPress);

		return () => {
		  window.removeEventListener('keydown', handleKeyPress);
		};
	}, []);

	useEffect(() => {
		if (activityOn)
		{
			if (doc?.fullscreenElement)
			{	
				doc.exitFullscreen()
					.then(() => _setIsFullscreen(false))
					.catch((error) => logger.error("react:hook", "useFullcreen", "ExitFullscreen", error));
			}
		}
	}, [activityOn, doc?.fullscreenElement, isFullscreen, elementToFullscreen, doc]);

	const setFullscreenOn = (() => {
		logger.log("react:hook", "useFullcreen", "setFullscreenOn", classNameToFullscreen, isFullscreen);
		router.refresh();
		// if (elementToFullscreen)
			elementToFullscreen?.requestFullscreen()
			.then(() => _setIsFullscreen(true))
			.catch((error) => {
				logger.error("react:hook", "useFullcreen", "requestFullscreen 0", error);
				router.refresh();
			})
	});

    return (
        <FullscreenContext.Provider value={{ setFullscreenOn, isFullscreen }}>
            {children}
        </FullscreenContext.Provider>
    );
};
