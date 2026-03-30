import { useEffect } from 'react';

/**
 * Custom hook for handling keyboard shortcuts.
 * @param {Array<[string, (e: KeyboardEvent) => void]>} hotkeys - An array of tuples,
 * where each tuple contains a key code (e.g., 'F5', 'Enter') and a callback function.
 */
export const useHotkeys = (hotkeys, deps = []) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      const hotkey = hotkeys.find(([key]) => key === event.key);
      if (hotkey) {
        const [, callback] = hotkey;
        event.preventDefault();
        callback(event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hotkeys, ...deps]);
};
