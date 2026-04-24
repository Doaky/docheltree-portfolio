import { useEffect } from 'react';

export function useGrain() {
  useEffect(() => {
    const overlay = document.getElementById('grain-overlay');
    overlay?.classList.add('grain-active');
    return () => overlay?.classList.remove('grain-active');
  }, []);
}
