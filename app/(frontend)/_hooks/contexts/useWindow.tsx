import { useState, useEffect } from 'react';
import logger from '@/app/_utils/logger';
import { Breakpoint } from '@radix-ui/themes/dist/esm/props/prop-def.js';

// Values are `min-width` https://www.radix-ui.com/themes/docs/theme/breakpoints
const sizes: Record<Breakpoint, number> = {
    initial: 0,
    xs: 520,
    sm: 768,
    md: 1024,
    lg: 1280,
    xl: 1640,
};

interface WindowHookType {
    width: number | undefined;
    height: number | undefined;
    size: Breakpoint;
    widerThan: (size: Breakpoint) => boolean;
    narrowerThan: (size: Breakpoint) => boolean;
    orientation: 'landscape' | 'portrait';
}

// TODO: use a provider to avoid multiple listeners
// TODO: all those useEffects look suspicious
function useWindow(): WindowHookType {
    const [width, setWidth] = useState<number | undefined>(undefined);
    const [height, setHeight] = useState<number | undefined>(undefined);
    const [size, setSize] = useState<Breakpoint>('initial');
    const [widerThan, setWiderThan] = useState<(size: Breakpoint) => boolean>(() => () => false);
    const [narrowerThan, setNarrowerThan] = useState<(size: Breakpoint) => boolean>(() => () => false);
    const [orientation, setOrientation] = useState<'landscape' | 'portrait'>('landscape');


    useEffect(() => {
        function handleResize() {
            setWidth(window.innerWidth);
            setHeight(window.innerHeight);
        }
        window.addEventListener('resize', handleResize);
        handleResize(); // Call on mount to get initial value

        return () => window.removeEventListener('resize', handleResize);
    }, []);

  
    useEffect(() => {
        if (width) {
            const newSize: Breakpoint = Object.entries(sizes).reduce((acc, [key, value]) => {
                if (width >= value) {
                    return key as Breakpoint;
                }
                return acc;
            }, 'initial' as Breakpoint);

            setSize((prev) => {
                if (prev !== newSize) {
                    logger.log('react:hook', `Size: ${newSize}`);
                    return newSize;
                }
                return prev;
            });
        }
    }, [width]);


    useEffect(() => {
        if (!width) return;
        
        setWiderThan(() => (size: Breakpoint) => {
            return sizes[size] < width!;
        });
        setNarrowerThan(() => (size: Breakpoint) => {
            return sizes[size] > width!;
        });
    }, [size, width]);

    useEffect(() => {
        if (width && height) {
            const newOrientation = width > height ? 'landscape' : 'portrait';
            setOrientation((prev) => {
                if (prev !== newOrientation) {
                    logger.log('react:hook', `Orientation: ${newOrientation}`);
                    return newOrientation;
                }
                return prev;
            });
        }
    }, [width, height]);

  return { width, height, size, widerThan, narrowerThan, orientation };
}

export default useWindow;