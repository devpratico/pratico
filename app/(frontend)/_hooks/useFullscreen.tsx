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
	const activityElem = doc ? doc.getElementById('activityAnimationId') : null;
	const [activity, setActivity] = useState(false);

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
			setActivity(true);
			if (doc?.fullscreenElement)
			{	
				console.log("0")

				document.exitFullscreen()
				.then(() => activityElem?.requestFullscreen().catch((error) => logger.error("react:hook", "requestFullscreen 1", error)))
				.catch((error) => logger.error("react:hook", "ExitFullscreen", error));
			}
		}
		else if (activity)
		{
			if (elementToFullscreen)
			{
				console.log("2")
				if (document.fullscreenElement)
					document.exitFullscreen()
					.then(() => elementToFullscreen?.requestFullscreen().catch((error) => logger.error("react:hook", "requestFullscreen 2", error)))
					.catch((error) => logger.error("react:hook", "exitFullscreen", error));
				else
					elementToFullscreen.requestFullscreen()
					.catch((error) => logger.error("react:hook", "requestFullscreen", error));
			}
		}
	
	}, [elementToFullscreen, activityOn, activity, doc?.fullscreenElement, activityElem]);

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
