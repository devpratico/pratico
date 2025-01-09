"use client";
import React, { useState, useContext, createContext, ReactNode } from 'react';

const FocusZoneContext = createContext({
	activeZone: null as string | null,
  setActiveZone: (zoneId: string | null) => {},
	registerZone: (zoneId: string) => () => {},
	unregisterZone: () => {}
});

export const useFocusZone = () => {
  return useContext(FocusZoneContext);
};

const FocusZoneProvider = ({ children }: { children: ReactNode }) => {
  const [activeZone, setActiveZone] = useState<string | null>(null);

  const registerZone = (zoneId: string) => () => setActiveZone(zoneId);
  const unregisterZone = () => setActiveZone(null);

  return (
    <FocusZoneContext.Provider value={{ activeZone, setActiveZone, registerZone, unregisterZone }}>
      {children}
    </FocusZoneContext.Provider>
  );
};

export const FocusZone = ({ id, children }: { id: string, children: ReactNode}) => {
  const { registerZone, unregisterZone } = useFocusZone();

  return (
    <div
      tabIndex={0}
      onFocus={registerZone(id)}
      onBlur={unregisterZone}
    >
      {children}
    </div>
  );
};

export default FocusZoneProvider;
