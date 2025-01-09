"use client";
import { useEffect } from 'react';
import { useFocusZone } from './useFocusZone';

export type KeyboardShortcutType = Record<string, Record<string, () => void>>;

const useKeyboardShortcuts = (shortcuts: KeyboardShortcutType) => {
	const { activeZone } = useFocusZone();

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (activeZone && shortcuts[activeZone]?.[event.key]) {
				event.preventDefault(); // Prevent default browser action (e.g., scrolling for arrow keys)
				shortcuts[activeZone][event.key]();
			}
		};

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeZone, shortcuts]);
};

export default useKeyboardShortcuts;
