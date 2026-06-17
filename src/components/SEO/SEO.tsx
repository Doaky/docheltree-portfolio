import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const BASE_URL = 'https://danielocheltree.com';
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;
const SITE_NAME = 'Daniel Ocheltree';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  favicon?: string; // Emoji or path
  bare?: boolean;
}

export default function SEO({ title, description, image, imageAlt, favicon, bare }: SEOProps) {
  const { pathname } = useLocation();
  const fullTitle = bare ? title : title.endsWith(SITE_NAME) ? title : `${title} // ${SITE_NAME}`;
  
  const canonical = pathname === '/' ? '' : pathname.replace(/\/$/, '');
  const url = `${BASE_URL}${canonical}`;
  const ogImage = image ?? DEFAULT_IMAGE;
  const ogImageAlt = imageAlt ?? `${fullTitle} preview`;

  // If favicon is an emoji, we turn it into an SVG string
  const faviconUrl = favicon && favicon.length < 5 
    ? `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>${favicon}</text></svg>`
    : favicon;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      
      {/* Favicon - now managed by Helmet */}
      {faviconUrl && <link rel="icon" href={faviconUrl} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={ogImageAlt} />
    </Helmet>
  );
}