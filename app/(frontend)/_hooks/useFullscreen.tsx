"use client";
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useRoom } from './useRoom';
import logger from '@/app/_utils/logger';

const FullscreenContext = createContext({
    setFullscreenOn: () => {}
});

export const useFullscreen = () => useContext(FullscreenContext);

export const FullscreenProvider = ({ children }: { children: React.ReactNode }) => {
	const { room } = useRoom();
	const doc = typeof document !== 'undefined' ? document : null;
	const activityOn = room?.activity_snapshot;
	const idToFullscreen = 'tldrawId';
	const elementToFullscreen = doc ? doc.getElementById(idToFullscreen) : null;

	useEffect(() => {
		const handleKeyPress = (e: KeyboardEvent) => {
			if (e.key === 'Escape')
			{
				if (document.fullscreenElement)
				{	
					document.exitFullscreen()
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
			if (doc?.fullscreenElement)
			{	
				document.exitFullscreen()
				.catch((error) => logger.error("react:hook", "ExitFullscreen", error));
			}
		}
	
	}, [activityOn, doc?.fullscreenElement]);

	function setFullscreenOn () {
		logger.log("react:hook", "setFullscreenOn", idToFullscreen);
		if (elementToFullscreen)
			elementToFullscreen.requestFullscreen()
			.catch((error) => logger.error("react:hook", "requestFullscreen 0", error))
	}
    return (
        <FullscreenContext.Provider value={{ setFullscreenOn }}>
            {children}
        </FullscreenContext.Provider>
    );
};
