"use client";
import { createContext, useContext, useEffect, useState } from 'react';
import { useRoom } from './useRoom';
import logger from '@/app/_utils/logger';

const FullscreenContext = createContext({
    setFullscreenOn: () => {}
});

export const useFullscreen = () => useContext(FullscreenContext);

export const FullscreenProvider = ({ children }: { children: React.ReactNode }) => {
	const { room } = useRoom();
	const activityOn = room?.activity_snapshot;
	const idToFullscreen = 'tldrawId'; // room?.activity_snapshot ? "activityAnimationId" : "tldrawId" ;
	const elementToFullscreen = document !== undefined ? document.getElementById(idToFullscreen) : null;
	const [isFullscreen, setIsFullscreen] = useState(false);
	useEffect(() => {
		const handleKeyPress = (e: KeyboardEvent) => {
			if (e.key === 'Escape')
			{
				if (document.fullscreenElement)
				{	
					document.exitFullscreen()
					.then(() => setIsFullscreen(false))
					.catch((error) => logger.error("react:hook", "ExitFullscreen escape", error))
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
			if (document.fullscreenElement)
			{	
				document.exitFullscreen()
				.then(() => setIsFullscreen(false))
				.catch((error) => logger.error("react:hook", "ExitFullscreen", error))
			}
		}
		else
		{
			if (elementToFullscreen)
				elementToFullscreen.requestFullscreen().then(() => setIsFullscreen(true))
				.catch((error) => logger.error("react:hook", "ExitFullscreen", error))
		}
	
	}, [elementToFullscreen, activityOn]);

	function setFullscreenOn () {
		logger.log("react:hook", "setFullscreenOn", idToFullscreen);
		if (elementToFullscreen)
			elementToFullscreen.requestFullscreen().then(() => setIsFullscreen(true))
			.catch((error) => logger.error("react:hook", "ExitFullscreen", error))
	}
    return (
        <FullscreenContext.Provider value={{ setFullscreenOn }}>
            {children}
        </FullscreenContext.Provider>
    );
};
