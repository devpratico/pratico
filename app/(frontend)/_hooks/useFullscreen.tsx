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
	const idToFullscreen = room?.activity_snapshot ? "activityAnimationId" : "tldrawId" ;
	const elementToFullscreen = document !== undefined ? document.getElementById(idToFullscreen) : null;
	const [isFullscreen, setIsFullscreen] = useState(false);
	useEffect(() => {
		const handleKeyPress = (e: KeyboardEvent) => {
			if (e.key === 'Escape')
			{
				document.exitFullscreen();
				setIsFullscreen(false);
		  	}
		};	
		window.addEventListener('keydown', handleKeyPress);

		return () => {
		  window.removeEventListener('keydown', handleKeyPress);
		};
	}, []);

	useEffect(() => {
		// document.addEventListener("fullscreenchange", (event) => {
		// 	if (document.fullscreen)
		// })
		if (isFullscreen)
		{	
			document.exitFullscreen();

		}
		if (elementToFullscreen?.requestFullscreen)
			elementToFullscreen?.requestFullscreen();
	}, [elementToFullscreen, isFullscreen])

	function setFullscreenOn () {
		logger.log("react:hook", "setFullscreenOn", idToFullscreen);
		setIsFullscreen(true);
		if (elementToFullscreen?.requestFullscreen)
			elementToFullscreen.requestFullscreen();
	}
    return (
        <FullscreenContext.Provider value={{ setFullscreenOn }}>
            {children}
        </FullscreenContext.Provider>
    );
};
