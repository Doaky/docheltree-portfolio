import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const BASE_URL = 'https://danielocheltree.com';
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;
const SITE_NAME = 'Daniel Ocheltree';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  favicon?: string;
  bare?: boolean;
}

export default function SEO({ title, description, image, imageAlt, favicon, bare }: SEOProps) {
  const { pathname } = useLocation();
  const fullTitle = bare ? title : title.endsWith(SITE_NAME) ? title : `${title} // ${SITE_NAME}`;

  useEffect(() => {
    if (!favicon) return;
    const link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!link) return;
    const original = link.href;
    link.href = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>${favicon}</text></svg>`;
    return () => { link.href = original; };
  }, [favicon]);
  const canonical = pathname === '/' ? pathname : pathname.replace(/\/$/, '');
  const url = `${BASE_URL}${canonical}`;
  const ogImage = image ?? DEFAULT_IMAGE;
  const ogImageAlt = imageAlt ?? `${fullTitle} preview`;

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={ogImageAlt} />
    </>
  );
}
