"use client";
import { createContext, useContext, useState } from 'react';

const FullscreenContext = createContext({
    isFullscreen: false,
    setIsFullscreen: (isFullscreen: boolean) => {},
});

export const useFullscreen = () => useContext(FullscreenContext);

export const FullscreenProvider = ({ children }: { children: React.ReactNode }) => {
    const [isFullscreen, setIsFullscreen] = useState(false);

    return (
        <FullscreenContext.Provider value={{ isFullscreen, setIsFullscreen }}>
            {children}
        </FullscreenContext.Provider>
    );
};
