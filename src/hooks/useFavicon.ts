import { useEffect } from 'react';

/**
 * Temporarily overrides the page favicon while the calling component is mounted.
 * Mutates the existing <link rel="icon"> element so browsers detect both the
 * override and the restore as a real href change (appending/removing a node is
 * not reliably noticed on unmount).
 */
export function useFavicon(svgHref: string) {
  useEffect(() => {
    const link = document.querySelector<HTMLLinkElement>('link[rel="icon"][sizes="32x32"]');
    if (!link) return;

    const origHref = link.getAttribute('href') ?? '';
    const origType = link.getAttribute('type') ?? '';

    link.setAttribute('href', svgHref);
    link.setAttribute('type', 'image/svg+xml');

    return () => {
      link.setAttribute('href', origHref);
      link.setAttribute('type', origType);
    };
  }, [svgHref]);
}
