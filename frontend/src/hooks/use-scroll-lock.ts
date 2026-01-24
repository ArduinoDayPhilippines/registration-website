import { useEffect } from 'react';

export function useScrollLock() {
  useEffect(() => {
    // Save original overflow style
    const originalStyle = window.getComputedStyle(document.body).overflow;
    
    // Lock scroll
    document.body.style.overflow = 'hidden';

    // Cleanup: Restore original style
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);
}
