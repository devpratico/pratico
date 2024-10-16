"use client";
import { useFullscreen } from '@/app/(frontend)/_hooks/useFullscreen';

export const ClientLayoutController = ({children}: { children: React.ReactNode }) => {
 const { isFullscreen } = useFullscreen();


  return (
    <>
      {isFullscreen ? null : children}
    </>
  );
};
