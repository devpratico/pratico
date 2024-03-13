import { useState, useEffect } from 'react';
import logger from '@/utils/logger';


interface WindowHookType {
  width: number | undefined;
  height: number | undefined;
  isMobile: boolean;
  orientation: 'landscape' | 'portrait';
}

function useWindow(): WindowHookType {
  const [windowSize, setWindowSize] = useState<{ width: number | undefined; height: number | undefined }>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    window.addEventListener('resize', handleResize);
    handleResize(); // Call on mount to get initial value

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const smallHeight = windowSize.height ? windowSize.height < 500 : false;
    const smallWidth  = windowSize.width  ? windowSize.width  < 500 : false;
    const mobile = smallHeight || smallWidth;
    if (mobile !== isMobile) {
      setIsMobile(mobile); // Only update if it changes to improve performance
      logger.log('react:hook', `Mobile: ${mobile}`);
    }
  }, [windowSize]);


  const [orientation, setOrientation] = useState<'landscape' | 'portrait'>('landscape');

  useEffect(() => {
    if (windowSize.width && windowSize.height) {
      const newOrientation = windowSize.width > windowSize.height ? 'landscape' : 'portrait';
      if (newOrientation !== orientation) {
        logger.log('react:hook', `Orientation: ${newOrientation}`);
        setOrientation(newOrientation);
      }
    }
  }, [windowSize]);

  return { ...windowSize, isMobile, orientation };
}

export default useWindow;